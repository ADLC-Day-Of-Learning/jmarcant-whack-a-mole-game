const STORAGE_KEY = 'whack-a-mole.best-score';

let sessionBest = null;

export function resetBestScoreSessionFallback() {
  sessionBest = null;
}

function defaultStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function loadBestScore(storage = defaultStorage()) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    const value = Number.parseInt(raw ?? '', 10);
    const stored = Number.isFinite(value) && value >= 0 ? value : 0;
    return sessionBest !== null ? Math.max(stored, sessionBest) : stored;
  } catch {
    return sessionBest ?? 0;
  }
}

export function updateBestScore(score, storage = defaultStorage()) {
  const current = loadBestScore(storage);
  if (!Number.isFinite(score) || score < 0 || score <= current) {
    return { best: current, isNewBest: false };
  }
  try {
    storage.setItem(STORAGE_KEY, String(score));
  } catch {
    sessionBest = Math.max(sessionBest ?? 0, score);
  }
  return { best: score, isNewBest: true };
}
