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
