const assert = require("node:assert/strict");
const {
  groupRows,
  normalizeRow,
  rankEntries,
  sortEventNames,
} = require("../assets/js/leaderboard-core.js");

assert.deepEqual(normalizeRow(["2026-08-07 14:00 — Game", "Alex", "hider", "8"]), {
  game: "2026-08-07 14:00 — Game",
  player: "Alex",
  role: "Hider",
  score: 8,
});
assert.equal(normalizeRow(["Game", "Alex", "Runner", 8]), null);
assert.equal(normalizeRow(["Game", "Alex", "Seeker", -1]), null);
assert.equal(normalizeRow(["Game", "Alex", "Seeker", 1.5]), null);
assert.equal(normalizeRow(["", "Alex", "Seeker", 2]), null);
assert.equal(normalizeRow(["Game", "Alex", "Seeker", "not a score"]), null);
assert.equal(normalizeRow(["Game", "Alex", "Seeker", 0]).score, 0);

const empty = groupRows([]);
assert.equal(empty.games.size, 0);
assert.equal(empty.ignored, 0);

assert.deepEqual(
  rankEntries([
    { player: "Zoe", score: 10 },
    { player: "Alex", score: 10 },
    { player: "Ben", score: 7 },
  ]).map(({ player, score, rank }) => ({ player, score, rank })),
  [
    { player: "Alex", score: 10, rank: 1 },
    { player: "Zoe", score: 10, rank: 1 },
    { player: "Ben", score: 7, rank: 3 },
  ],
);

const grouped = groupRows([
  ["2026-08-07 14:00 — Old Town #1", "Zoe", "Hider", 10],
  ["2026-08-07 14:00 — Old Town #1", "Alex", "Hider", 10],
  ["2026-08-07 14:00 — Old Town #1", "Ben", "Seeker", 7],
  ["2026-08-07 18:00 — Old Town #2", "Kai", "Seeker", 9],
  ["bad", "row", "Unknown", 9],
]);

assert.equal(grouped.games.size, 2);
assert.equal(grouped.ignored, 1);
assert.deepEqual(
  grouped.games.get("2026-08-07 14:00 — Old Town #1").Hider.map(({ player, rank }) => ({ player, rank })),
  [
    { player: "Alex", rank: 1 },
    { player: "Zoe", rank: 1 },
  ],
);
assert.deepEqual(
  sortEventNames(grouped.games.keys()),
  ["2026-08-07 18:00 — Old Town #2", "2026-08-07 14:00 — Old Town #1"],
);

const duplicates = groupRows([
  ["2026-08-07 20:00 — Duplicate test", "Alex", "Hider", 5],
  ["2026-08-07 20:00 — Duplicate test", "Alex", "Hider", 5],
]);
assert.equal(duplicates.games.get("2026-08-07 20:00 — Duplicate test").Hider.length, 2);
assert.deepEqual(
  duplicates.games.get("2026-08-07 20:00 — Duplicate test").Hider.map(({ rank }) => rank),
  [1, 1],
);

console.log("leaderboard-core tests passed");
