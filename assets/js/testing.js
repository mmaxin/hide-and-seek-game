(() => {
  const input = document.querySelector("[data-markdown-input]");
  const output = document.querySelector("[data-preview-output]");
  const status = document.querySelector("[data-preview-status]");
  const loadButton = document.querySelector("[data-load-rules]");
  const copyButton = document.querySelector("[data-copy-markdown]");
  const downloadButton = document.querySelector("[data-download-markdown]");
  const newButton = document.querySelector("[data-new-draft]");
  const rulesUrl = document.body.dataset.rulesUrl;
  const storageKey = "hide-and-seek-rules-preview-v1";

  if (!input || !output || !status || !window.marked) {
    if (status) status.textContent = "The previewer could not start. Reload the page and try again.";
    return;
  }

  const allowedTags = new Set([
    "A", "BLOCKQUOTE", "BR", "CODE", "DEL", "EM", "H1", "H2", "H3", "H4", "H5", "H6",
    "HR", "IMG", "LI", "OL", "P", "PRE", "STRONG", "TABLE", "TBODY", "TD", "TH", "THEAD", "TR", "UL",
  ]);
  const removableTags = new Set(["IFRAME", "OBJECT", "SCRIPT", "STYLE", "TEMPLATE"]);
  const allowedClasses = new Set(["button", "map-button"]);

  const sample = [
    "> **At a glance:** 2-hour game · 4 clue photos",
    "",
    "## 1. Objective",
    "{: #objective }",
    "",
    "Score the most points by staying hidden or finding Hiders.",
    "",
    "## Example section",
    "{: #example-section }",
    "",
    "- Use **bold text** for important terms.",
    "- Add bullets for rules players need to scan.",
    "",
    "| Result | Points |",
    "| --- | ---: |",
    "| Found | 2 |",
    "| Survived | 10 |",
  ].join("\n");

  const setStatus = (message) => {
    status.textContent = message;
  };

  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    })[character]);

  const addHeadingAnchors = (markdown) =>
    markdown.replace(
      /^(#{1,6})[ \t]+(.+)\r?\n\{:\s+#([A-Za-z][\w-]*)\s*\}[ \t]*$/gm,
      (_match, hashes, heading, id) =>
        `<h${hashes.length} id="${id}">${escapeHtml(heading.trim())}</h${hashes.length}>`,
    );

  const stripHiddenSections = (markdown) => {
    const hiddenPattern = /{%\s*comment\s*%}[\s\S]*?{%\s*endcomment\s*%}/gi;
    const hiddenSections = markdown.match(hiddenPattern) || [];
    return {
      hiddenCount: hiddenSections.length,
      visibleMarkdown: markdown.replace(hiddenPattern, ""),
    };
  };

  const resolveSafeUrl = (value, type) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (type === "link" && trimmed.startsWith("#")) return trimmed;

    try {
      const rulesBase = new URL(rulesUrl || "../rules.md", window.location.href);
      const resolved = new URL(trimmed, rulesBase);
      const allowedProtocols = type === "image"
        ? new Set(["http:", "https:"])
        : new Set(["http:", "https:", "mailto:"]);
      return allowedProtocols.has(resolved.protocol) ? resolved.href : null;
    } catch (_error) {
      return null;
    }
  };

  const sanitize = (html) => {
    const documentFragment = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");

    Array.from(documentFragment.body.querySelectorAll("*")).forEach((element) => {
      if (removableTags.has(element.tagName)) {
        element.remove();
        return;
      }

      if (!allowedTags.has(element.tagName)) {
        element.replaceWith(...element.childNodes);
        return;
      }

      const alignment = element.style.textAlign || element.getAttribute("align");
      Array.from(element.attributes).forEach((attribute) => element.removeAttribute(attribute.name));

      if ((element.tagName === "TD" || element.tagName === "TH") && ["left", "center", "right"].includes(alignment)) {
        element.dataset.align = alignment;
      }

      if (/^H[1-6]$/.test(element.tagName)) {
        const originalId = element.getAttribute("id");
        if (originalId && /^[A-Za-z][\w-]*$/.test(originalId)) element.id = originalId;
      }
    });

    const sourceDocument = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
    const cleanElements = Array.from(documentFragment.body.querySelectorAll("a, img, h1, h2, h3, h4, h5, h6"));
    const sourceElements = Array.from(sourceDocument.body.querySelectorAll("a, img, h1, h2, h3, h4, h5, h6"));

    cleanElements.forEach((element, index) => {
      const source = sourceElements[index];
      if (!source || source.tagName !== element.tagName) return;

      if (element.tagName === "A") {
        const href = resolveSafeUrl(source.getAttribute("href") || "", "link");
        if (href) element.setAttribute("href", href);

        const classes = (source.getAttribute("class") || "")
          .split(/\s+/)
          .filter((className) => allowedClasses.has(className));
        if (classes.length) element.className = classes.join(" ");

        if (source.getAttribute("target") === "_blank") {
          element.target = "_blank";
          element.rel = "noopener noreferrer";
        }
      }

      if (element.tagName === "IMG") {
        const src = resolveSafeUrl(source.getAttribute("src") || "", "image");
        if (src) element.setAttribute("src", src);
        element.alt = source.getAttribute("alt") || "";
        element.loading = "lazy";
      }

      if (/^H[1-6]$/.test(element.tagName)) {
        const id = source.getAttribute("id");
        if (id && /^[A-Za-z][\w-]*$/.test(id)) element.id = id;
      }
    });

    documentFragment.body.querySelectorAll("a:not([href]), img:not([src])").forEach((element) => element.remove());
    return documentFragment.body.innerHTML;
  };

  let renderTimer;
  const render = ({ announce = true } = {}) => {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(() => {
      const markdown = input.value;
      try {
        if (!markdown.trim()) {
          output.innerHTML = '<p class="preview-empty">Start typing Markdown to see the page preview.</p>';
        } else {
          const { hiddenCount, visibleMarkdown } = stripHiddenSections(markdown);
          const html = window.marked.parse(addHeadingAnchors(visibleMarkdown), { gfm: true, breaks: false });
          output.innerHTML = sanitize(html);
          if (announce) {
            const hiddenMessage = hiddenCount
              ? ` · ${hiddenCount} hidden ${hiddenCount === 1 ? "section" : "sections"} omitted`
              : "";
            setStatus(`Preview updated · Draft saved on this device${hiddenMessage}`);
          }
        }
        window.localStorage.setItem(storageKey, markdown);
        if (announce && !markdown.trim()) setStatus("Blank draft saved on this device");
      } catch (_error) {
        output.innerHTML = '<p class="preview-error">This Markdown could not be previewed. Check the last element you added.</p>';
        setStatus("Preview error · Your Markdown is still saved");
      }
    }, announce ? 120 : 0);
  };

  const replaceDraft = (markdown, message) => {
    input.value = markdown;
    render({ announce: false });
    setStatus(message);
    input.focus();
  };

  const loadCurrentRules = async ({ confirmReplace = true } = {}) => {
    if (confirmReplace && input.value.trim() && !window.confirm("Replace this draft with the currently published rules?")) return;
    setStatus("Loading the current rules…");

    try {
      const response = await fetch(rulesUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`Rules request failed: ${response.status}`);
      replaceDraft(await response.text(), "Current rules loaded · Draft saved on this device");
    } catch (_error) {
      if (!input.value.trim()) replaceDraft(sample, "Example loaded because the current rules could not be reached");
      else setStatus("Could not load the current rules · Your existing draft is unchanged");
    }
  };

  input.addEventListener("input", () => render());
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const start = input.selectionStart;
    input.setRangeText("  ", start, input.selectionEnd, "end");
    render();
  });

  loadButton.addEventListener("click", () => loadCurrentRules());

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(input.value);
      setStatus("Markdown copied · Paste it into rules.md when ready");
    } catch (_error) {
      input.select();
      document.execCommand("copy");
      setStatus("Markdown copied · Paste it into rules.md when ready");
    }
  });

  downloadButton.addEventListener("click", () => {
    const downloadUrl = URL.createObjectURL(new Blob([input.value], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "rules-draft.md";
    link.click();
    URL.revokeObjectURL(downloadUrl);
    setStatus("Downloaded rules-draft.md");
  });

  newButton.addEventListener("click", () => {
    if (input.value.trim() && !window.confirm("Clear this draft and start with a blank editor?")) return;
    replaceDraft("", "Blank draft ready · Previous local draft cleared");
  });

  const savedDraft = window.localStorage.getItem(storageKey);
  if (savedDraft !== null) {
    replaceDraft(savedDraft, "Local draft restored · Nothing has been published");
  } else {
    loadCurrentRules({ confirmReplace: false });
  }
})();
