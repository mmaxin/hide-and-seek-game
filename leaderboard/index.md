---
layout: default
title: Game Leaderboards
description: View Hider and Seeker results from every Hide & Seek game.
page_type: leaderboard
main_id: leaderboards
skip_label: the leaderboards
eyebrow: Game results
hero_lede: Pick a game, compare both final roles, and see who finished on top.
share_label: results
share_text: Hide & Seek game leaderboards
---

<section
  class="leaderboard-panel"
  data-leaderboard
  data-sheet-id="{{ site.leaderboard.sheet_id }}"
  data-sheet-name="{{ site.leaderboard.sheet_name }}"
  data-form-url="{{ site.leaderboard.form_url }}"
  aria-busy="true"
>
  <div class="leaderboard-panel__heading">
    <div>
      <p class="eyebrow eyebrow--dark">Results by game</p>
      <h2>Choose a game</h2>
      <p>Each game has separate rankings for players who ended as Hiders and Seekers.</p>
    </div>
    <a class="button" href="{{ site.leaderboard.form_url }}" target="_blank" rel="noopener" data-submit-score>Submit your score</a>
  </div>

  <div class="leaderboard-controls">
    <label for="leaderboard-game">Game</label>
    <select id="leaderboard-game" data-game-select disabled>
      <option>Loading games…</option>
    </select>
    <button class="leaderboard-refresh" type="button" data-refresh>Refresh results</button>
  </div>

  <p class="leaderboard-status" data-status role="status" aria-live="polite">Loading results…</p>
</section>

<section class="leaderboard-grid" aria-label="Rankings">
  <article class="leaderboard-card leaderboard-card--hider" data-role-board="Hider">
    <div class="leaderboard-card__heading">
      <div>
        <p class="leaderboard-card__kicker">Final role</p>
        <h2>Hiders</h2>
      </div>
      <span class="leaderboard-count" data-role-count="Hider">0 players</span>
    </div>
    <div class="leaderboard-table-wrap">
      <table class="leaderboard-table">
        <thead><tr><th scope="col">Rank</th><th scope="col">Player</th><th scope="col">Score</th></tr></thead>
        <tbody data-role-body="Hider"><tr><td colspan="3">Loading scores…</td></tr></tbody>
      </table>
    </div>
  </article>

  <article class="leaderboard-card leaderboard-card--seeker" data-role-board="Seeker">
    <div class="leaderboard-card__heading">
      <div>
        <p class="leaderboard-card__kicker">Final role</p>
        <h2>Seekers</h2>
      </div>
      <span class="leaderboard-count" data-role-count="Seeker">0 players</span>
    </div>
    <div class="leaderboard-table-wrap">
      <table class="leaderboard-table">
        <thead><tr><th scope="col">Rank</th><th scope="col">Player</th><th scope="col">Score</th></tr></thead>
        <tbody data-role-body="Seeker"><tr><td colspan="3">Loading scores…</td></tr></tbody>
      </table>
    </div>
  </article>
</section>

<aside class="leaderboard-note">
  <strong>Good to know:</strong> results use player-selected names and may take a few minutes to appear. Contact the organizer if a score needs correcting.
</aside>
