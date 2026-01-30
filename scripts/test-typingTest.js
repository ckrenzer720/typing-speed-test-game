/**
 * Node-runner for typingTest correctness logic (no DOM).
 * Run: node scripts/test-typingTest.js
 */

function computeCorrectness(typed, target) {
  const t = String(typed);
  const ref = String(target || "");
  let correct = 0;
  let mistakes = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i] === (ref[i] ?? "")) correct++;
    else mistakes++;
  }
  return { correct, mistakes };
}

function assert(name, condition, expected, actual) {
  const ok = condition;
  const status = ok ? "PASS" : "FAIL";
  console.log(
    `${status} ${name}` +
      (expected !== undefined
        ? ` (expected: ${expected}, got: ${actual})`
        : ""),
  );
  return ok;
}

let passed = 0;
let failed = 0;

let r = computeCorrectness("", "abc");
if (assert("Empty typed: 0 correct", r.correct === 0, 0, r.correct)) passed++;
else failed++;
if (assert("Empty typed: 0 mistakes", r.mistakes === 0, 0, r.mistakes))
  passed++;
else failed++;

r = computeCorrectness("abc", "abc");
if (assert("Exact match: 3 correct", r.correct === 3, 3, r.correct)) passed++;
else failed++;
if (assert("Exact match: 0 mistakes", r.mistakes === 0, 0, r.mistakes))
  passed++;
else failed++;

r = computeCorrectness("axc", "abc");
if (assert("One wrong char: 2 correct", r.correct === 2, 2, r.correct))
  passed++;
else failed++;
if (assert("One wrong char: 1 mistake", r.mistakes === 1, 1, r.mistakes))
  passed++;
else failed++;

r = computeCorrectness("abcd", "abc");
if (assert("Extra char: 3 correct", r.correct === 3, 3, r.correct)) passed++;
else failed++;
if (assert("Extra char: 1 mistake", r.mistakes === 1, 1, r.mistakes)) passed++;
else failed++;

r = computeCorrectness("ab", "abc");
if (assert("Short typed: 2 correct", r.correct === 2, 2, r.correct)) passed++;
else failed++;
if (assert("Short typed: 0 mistakes", r.mistakes === 0, 0, r.mistakes))
  passed++;
else failed++;

r = computeCorrectness("hello world", "hello world");
if (assert("Words exact: 11 correct", r.correct === 11, 11, r.correct))
  passed++;
else failed++;
if (assert("Words exact: 0 mistakes", r.mistakes === 0, 0, r.mistakes))
  passed++;
else failed++;

console.log("\n--- typingTest logic (Node) ---");
console.log(`Total: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
