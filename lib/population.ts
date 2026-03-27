// Synthetic population for percentile calculation.
// Generated once – represents a realistic right-skewed distribution.

function seededRandom(seed: number): () => number {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function generatePopulation(): number[] {
  const rand = seededRandom(42)
  const population: number[] = []

  for (let i = 0; i < 5000; i++) {
    // Log-normal approximation: most people cluster in the 2–10 range
    // with a long tail toward higher numbers.
    const u1 = rand()
    const u2 = rand()
    const normal = Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2)
    const logNormal = Math.exp(1.8 + 0.9 * normal)
    population.push(Math.max(0, Math.round(logNormal)))
  }

  return population.sort((a, b) => a - b)
}

const SYNTHETIC_POPULATION = generatePopulation()

export function computePercentile(score: number): number {
  const below = SYNTHETIC_POPULATION.filter((s) => s < score).length
  const percentile = Math.round((below / SYNTHETIC_POPULATION.length) * 100)
  return Math.min(99, Math.max(1, percentile))
}
