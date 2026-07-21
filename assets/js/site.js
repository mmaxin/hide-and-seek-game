const shareButton = document.querySelector("[data-share]");

if (shareButton) {
  const canShare = typeof navigator.share === "function";
  const canCopy = navigator.clipboard && typeof navigator.clipboard.writeText === "function";

  if (!canShare && !canCopy) {
    shareButton.hidden = true;
  } else {
    shareButton.addEventListener("click", async () => {
      try {
        if (canShare) {
          await navigator.share({
            title: document.title,
            text: "Photo-Clue Infection Hide & Seek game rules",
            url: window.location.href,
          });
          return;
        }

        await navigator.clipboard.writeText(window.location.href);
        const originalLabel = shareButton.textContent;
        shareButton.textContent = "Link copied";
        window.setTimeout(() => {
          shareButton.textContent = originalLabel;
        }, 1800);
      } catch (error) {
        if (error.name !== "AbortError") {
          shareButton.textContent = "Copy the page URL";
        }
      }
    });
  }
}

const searchToggle = document.querySelector("[data-search-toggle]");
const searchPanel = document.querySelector("[data-search-panel]");
const searchForm = document.querySelector("[data-search-form]");
const searchInput = document.querySelector("[data-search-input]");
const searchClear = document.querySelector("[data-search-clear]");
const searchStatus = document.querySelector("[data-search-status]");
const searchResults = document.querySelector("[data-search-results]");
const rulesCard = document.querySelector(".rules-card");

if (
  searchToggle &&
  searchPanel &&
  searchForm &&
  searchInput &&
  searchClear &&
  searchStatus &&
  searchResults &&
  rulesCard
) {
  const sectionAliases = {
    objective: "goal aim win winning purpose most points",
    roles: "role hider seeker infected items wristband band found caught conversion become seeker",
    teams: "team size player count how many starting seekers starting hiders group pair solo setup",
    "general-rules": "start hide period waiting release watch follow track survival starting seeker",
    "locked-location": "locked location move movement distance far how far can i move ten metres meters steps rehide re-hiding photo one spot",
    scoring: "score scoring points how many points starting seeker points bonus winner survival item value calculate calculation",
    "photo-clues": "photo photos clue clues camera picture pictures schedule time times due deadline when send submit zoom ground upper view",
    finds: "find finding found caught call phrase say first seeker reach three metres tag grab chase chasing post whatsapp survived",
    boundaries: "boundary boundaries zone area map sidewalk street move resident staff public inside outside",
    safety: "safe safety run running walk walking legal public private property road roads bathroom washroom toilet organizer ruling end late",
    map: "map maps zone zones boundary boundaries play area live map rhodes old town blue outline",
  };

  const stopWords = new Set([
    "a",
    "am",
    "an",
    "and",
    "are",
    "can",
    "do",
    "does",
    "for",
    "how",
    "i",
    "in",
    "is",
    "it",
    "me",
    "my",
    "of",
    "on",
    "or",
    "the",
    "to",
    "what",
    "when",
    "where",
    "who",
    "why",
  ]);

  const normalize = (value) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9:]+/g, " ")
      .trim();

  const tokenize = (value) => normalize(value).match(/[a-z0-9]+(?::[0-9]+)?/g) || [];

  const sectionEntries = Array.from(rulesCard.querySelectorAll("h2[id]")).map((heading, order) => {
    const sectionParts = [];
    let element = heading.nextElementSibling;

    while (element && element.tagName !== "H2") {
      sectionParts.push(element.textContent || "");
      element = element.nextElementSibling;
    }

    const title = heading.textContent.trim();
    const body = sectionParts.join(" ").replace(/\s+/g, " ").trim();
    const snippet = body.length > 165 ? `${body.slice(0, 162).trimEnd()}…` : body;
    const aliases = sectionAliases[heading.id] || "";

    return {
      aliases: normalize(aliases),
      body: normalize(body),
      href: `#${heading.id}`,
      order,
      snippet,
      title,
      titleSearch: normalize(title.replace(/^\d+\.\s*/, "")),
    };
  });

  const includesRelatedWord = (text, token) => {
    const words = text.split(" ");

    if (words.includes(token)) {
      return true;
    }

    if (token.length < 4) {
      return false;
    }

    return words.some(
      (word) => word.length >= 4 && (word.startsWith(token) || token.startsWith(word)),
    );
  };

  const searchSections = (query) => {
    const normalizedQuery = normalize(query);
    const allTokens = tokenize(query);
    const usefulTokens = allTokens.filter((token) => !stopWords.has(token));
    const tokens = usefulTokens.length ? usefulTokens : allTokens;

    if (!normalizedQuery || !tokens.length) {
      return [];
    }

    return sectionEntries
      .map((entry) => {
        let score = 0;
        let matchedTokens = 0;

        if (entry.titleSearch.includes(normalizedQuery)) score += 60;
        if (entry.aliases.includes(normalizedQuery)) score += 45;
        if (entry.body.includes(normalizedQuery)) score += 30;

        tokens.forEach((token) => {
          const titleMatch = includesRelatedWord(entry.titleSearch, token);
          const aliasMatch = includesRelatedWord(entry.aliases, token);
          const bodyMatch = includesRelatedWord(entry.body, token);

          if (titleMatch) score += 15;
          if (aliasMatch) score += 10;
          if (bodyMatch) score += 4;
          if (titleMatch || aliasMatch || bodyMatch) matchedTokens += 1;
        });

        return { ...entry, matchedTokens, score };
      })
      .filter((entry) => {
        const minimumMatches = tokens.length === 1 ? 1 : Math.ceil(tokens.length * 0.6);
        return entry.score > 0 && entry.matchedTokens >= minimumMatches;
      })
      .sort((a, b) => b.score - a.score || a.order - b.order)
      .slice(0, 5);
  };

  const closeSearch = ({ returnFocus = false } = {}) => {
    searchPanel.hidden = true;
    searchToggle.setAttribute("aria-expanded", "false");
    if (returnFocus) searchToggle.focus();
  };

  const openSearch = () => {
    searchPanel.hidden = false;
    searchToggle.setAttribute("aria-expanded", "true");
    searchInput.focus();
  };

  const renderResults = () => {
    const query = searchInput.value.trim();
    const matches = searchSections(query);
    searchResults.replaceChildren();
    searchClear.hidden = !query;

    if (!query) {
      searchStatus.textContent = "Type a question or keyword to find the right section.";
      return;
    }

    if (!matches.length) {
      searchStatus.textContent = `No sections found for “${query}”. Try a shorter phrase or another game term.`;
      return;
    }

    searchStatus.textContent = `${matches.length} matching ${matches.length === 1 ? "section" : "sections"}.`;

    matches.forEach((match) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const title = document.createElement("strong");
      const snippet = document.createElement("span");

      link.href = match.href;
      title.textContent = match.title;
      snippet.textContent = match.snippet;
      link.append(title, snippet);
      link.addEventListener("click", () => closeSearch());
      item.append(link);
      searchResults.append(item);
    });
  };

  searchToggle.addEventListener("click", () => {
    if (searchPanel.hidden) {
      openSearch();
    } else {
      closeSearch({ returnFocus: true });
    }
  });

  searchInput.addEventListener("input", renderResults);

  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    renderResults();
    searchInput.focus();
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstResult = searchResults.querySelector("a");
    if (firstResult) firstResult.click();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !searchPanel.hidden) {
      closeSearch({ returnFocus: true });
    }
  });

  document.querySelectorAll(".section-nav__links a").forEach((link) => {
    link.addEventListener("click", () => closeSearch());
  });
}
