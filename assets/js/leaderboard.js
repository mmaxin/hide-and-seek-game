const leaderboardRoot = document.querySelector("[data-leaderboard]");

if (leaderboardRoot && window.LeaderboardCore) {
  const { ROLES, groupRows, sortEventNames } = window.LeaderboardCore;
  const sheetId = leaderboardRoot.dataset.sheetId?.trim();
  const sheetName = leaderboardRoot.dataset.sheetName?.trim() || "Public Leaderboard";
  const formUrl = leaderboardRoot.dataset.formUrl?.trim();
  const gameSelect = leaderboardRoot.querySelector("[data-game-select]");
  const refreshButton = leaderboardRoot.querySelector("[data-refresh]");
  const status = leaderboardRoot.querySelector("[data-status]");
  const submitLink = leaderboardRoot.querySelector("[data-submit-score]");
  const state = { games: new Map(), ignored: 0, timeoutId: null };

  if (!formUrl) {
    submitLink.hidden = true;
  } else {
    submitLink.href = formUrl;
  }

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle("leaderboard-status--error", isError);
  };

  const renderEmptyRole = (role, message) => {
    const body = document.querySelector(`[data-role-body="${role}"]`);
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.className = "leaderboard-empty";
    cell.textContent = message;
    row.append(cell);
    body.replaceChildren(row);
    document.querySelector(`[data-role-count="${role}"]`).textContent = "0 players";
  };

  const renderRole = (role, entries) => {
    const body = document.querySelector(`[data-role-body="${role}"]`);
    const count = document.querySelector(`[data-role-count="${role}"]`);

    if (!entries.length) {
      renderEmptyRole(role, `No ${role.toLowerCase()} scores yet.`);
      return;
    }

    const rows = entries.map((entry) => {
      const row = document.createElement("tr");
      const rank = document.createElement("td");
      const player = document.createElement("td");
      const score = document.createElement("td");
      rank.className = "leaderboard-rank";
      score.className = "leaderboard-score";
      rank.textContent = entry.rank;
      player.textContent = entry.player;
      score.textContent = entry.score;
      row.append(rank, player, score);
      return row;
    });

    body.replaceChildren(...rows);
    count.textContent = `${entries.length} ${entries.length === 1 ? "player" : "players"}`;
  };

  const renderGame = (game) => {
    const roles = state.games.get(game);
    ROLES.forEach((role) => renderRole(role, roles?.[role] || []));
    const url = new URL(window.location.href);
    url.searchParams.set("game", game);
    window.history.replaceState({}, "", url);
  };

  const populateGames = () => {
    const games = sortEventNames(state.games.keys());
    const requestedGame = new URL(window.location.href).searchParams.get("game");
    gameSelect.replaceChildren();

    if (!games.length) {
      const option = document.createElement("option");
      option.textContent = "No games yet";
      gameSelect.append(option);
      gameSelect.disabled = true;
      ROLES.forEach((role) => renderEmptyRole(role, "No scores submitted yet."));
      setStatus("No scores have been submitted yet. Try refreshing in a few minutes.");
      return;
    }

    games.forEach((game) => {
      const option = document.createElement("option");
      option.value = game;
      option.textContent = game;
      gameSelect.append(option);
    });

    const initialGame = games.includes(requestedGame) ? requestedGame : games[0];
    gameSelect.value = initialGame;
    gameSelect.disabled = false;
    renderGame(initialGame);

    const scoreCount = [...state.games.values()].reduce(
      (total, roles) => total + roles.Hider.length + roles.Seeker.length,
      0,
    );
    const time = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date());
    const ignoredMessage = state.ignored ? ` ${state.ignored} invalid ${state.ignored === 1 ? "row was" : "rows were"} ignored.` : "";
    setStatus(`Loaded ${scoreCount} ${scoreCount === 1 ? "score" : "scores"}. Refreshed at ${time}.${ignoredMessage}`);
  };

  const finishRequest = () => {
    leaderboardRoot.setAttribute("aria-busy", "false");
    refreshButton.disabled = false;
    window.clearTimeout(state.timeoutId);
  };

  window.hideSeekLeaderboardReceive = (response) => {
    if (!response || response.status !== "ok" || !response.table) {
      finishRequest();
      setStatus("Results could not be loaded. The organizer may still be finishing the leaderboard setup.", true);
      ROLES.forEach((role) => renderEmptyRole(role, "Results unavailable."));
      return;
    }

    const rows = (response.table.rows || []).map((row) =>
      (row.c || []).slice(0, 4).map((cell) => cell?.v ?? cell?.f ?? ""),
    );
    const grouped = groupRows(rows);
    state.games = grouped.games;
    state.ignored = grouped.ignored;
    finishRequest();
    populateGames();
  };

  const loadResults = () => {
    if (!sheetId) {
      finishRequest();
      setStatus("Leaderboard setup is incomplete: no public Sheet is configured.", true);
      return;
    }

    leaderboardRoot.setAttribute("aria-busy", "true");
    refreshButton.disabled = true;
    setStatus("Loading the latest results…");

    document.querySelector("[data-leaderboard-request]")?.remove();
    const query = encodeURIComponent("select A, B, C, D where A is not null");
    const callback = encodeURIComponent("out:json;responseHandler:hideSeekLeaderboardReceive");
    const script = document.createElement("script");
    script.dataset.leaderboardRequest = "";
    script.src = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&headers=1&tq=${query}&tqx=${callback}&_=${Date.now()}`;
    script.onerror = () => {
      finishRequest();
      setStatus("Results could not be reached. Check your connection or try again shortly.", true);
      ROLES.forEach((role) => renderEmptyRole(role, "Results unavailable."));
    };
    document.head.append(script);

    state.timeoutId = window.setTimeout(() => {
      script.remove();
      finishRequest();
      setStatus("Results are taking longer than expected. Try refreshing in a moment.", true);
    }, 12000);
  };

  gameSelect.addEventListener("change", () => renderGame(gameSelect.value));
  refreshButton.addEventListener("click", loadResults);
  loadResults();
}
