(function attachLeaderboardCore(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.LeaderboardCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createLeaderboardCore() {
  const ROLES = ["Hider", "Seeker"];

  function normalizeRow(row) {
    if (!Array.isArray(row) || row.length < 4) return null;

    const game = String(row[0] ?? "").trim();
    const player = String(row[1] ?? "").trim();
    const roleInput = String(row[2] ?? "").trim().toLowerCase();
    const role = ROLES.find((candidate) => candidate.toLowerCase() === roleInput);
    const score = typeof row[3] === "number" ? row[3] : Number(String(row[3] ?? "").trim());

    if (!game || !player || !role || !Number.isFinite(score) || score < 0 || !Number.isInteger(score)) {
      return null;
    }

    return {
      game: game.slice(0, 120),
      player: player.slice(0, 80),
      role,
      score,
    };
  }

  function sortEventNames(eventNames) {
    return [...eventNames].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  }

  function rankEntries(entries) {
    const sorted = [...entries].sort(
      (a, b) => b.score - a.score || a.player.localeCompare(b.player, undefined, { sensitivity: "base" }),
    );
    let previousScore = null;
    let previousRank = 0;

    return sorted.map((entry, index) => {
      const rank = entry.score === previousScore ? previousRank : index + 1;
      previousScore = entry.score;
      previousRank = rank;
      return { ...entry, rank };
    });
  }

  function groupRows(rows) {
    const games = new Map();
    let ignored = 0;

    rows.forEach((row) => {
      const entry = normalizeRow(row);
      if (!entry) {
        ignored += 1;
        return;
      }

      if (!games.has(entry.game)) {
        games.set(entry.game, { Hider: [], Seeker: [] });
      }

      games.get(entry.game)[entry.role].push(entry);
    });

    games.forEach((roles) => {
      ROLES.forEach((role) => {
        roles[role] = rankEntries(roles[role]);
      });
    });

    return { games, ignored };
  }

  return { ROLES, groupRows, normalizeRow, rankEntries, sortEventNames };
});
