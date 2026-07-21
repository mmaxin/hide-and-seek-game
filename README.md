# Photo-Clue Infection Hide & Seek

A one-page, mobile-friendly rules site for the game. GitHub Pages publishes the site automatically from the `main` branch.

## Edit the rules

The complete rules live in [`rules.md`](rules.md). This is the only file you normally need to edit.

1. Open `rules.md` on GitHub.
2. Select the pencil icon.
3. Make the change and commit it to `main`.
4. GitHub Pages will rebuild the public site automatically, usually within a few minutes.

Markdown basics:

```md
## Section heading

- A bullet point
- Another bullet point

| Column | Column |
| --- | --- |
| Value | Value |
```

## Update the map

- Replace `assets/game-map.png` with a new image using the same filename.
- If the interactive Google Map changes, update the two map links at the bottom of `rules.md`.

## Site structure

| File | Purpose |
| --- | --- |
| `rules.md` | All player-facing rule content |
| `index.md` | Loads the rules onto the home page |
| `_layouts/default.html` | Page frame, navigation, share/print actions |
| `assets/css/style.css` | Mobile, desktop, and print styling |
| `_config.yml` | Site title, URL, and GitHub Pages settings |

The site uses GitHub Pages’ built-in Jekyll support, so there is no JavaScript framework, package manager, or dependency update process to maintain.
