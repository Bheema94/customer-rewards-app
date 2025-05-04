import { calculateRewardPoints } from "../Utlis/RewardsUtils";

describe("calculateRewardPoints", () => {
  // Whole number test cases
  test("returns 0 points for whole amounts <= 50", () => {
    expect(calculateRewardPoints(0)).toBe(0);
    expect(calculateRewardPoints(30)).toBe(0);
    expect(calculateRewardPoints(50)).toBe(0);
  });

  test("returns correct points for whole amounts between 51 and 100", () => {
    expect(calculateRewardPoints(51)).toBe(1);
    expect(calculateRewardPoints(75)).toBe(25);
    expect(calculateRewardPoints(100)).toBe(50);
  });

  test("returns correct points for whole amounts over 100", () => {
    expect(calculateRewardPoints(120)).toBe(90); // (20 * 2) + 50
    expect(calculateRewardPoints(150)).toBe(150); // (50 * 2) + 50
    expect(calculateRewardPoints(101)).toBe(52); // (1 * 2) + 50
  });

  // Fractional amounts should be floored before calculating rewards
  test("ignores fractional part of amount below 51", () => {
    expect(calculateRewardPoints(50.99)).toBe(0); // floor = 50
    expect(calculateRewardPoints(49.75)).toBe(0); // floor = 49
  });

  test("returns correct points for fractional amounts between 51 and 100", () => {
    expect(calculateRewardPoints(51.99)).toBe(1); // floor = 51 → 1 point
    expect(calculateRewardPoints(99.99)).toBe(49); // floor = 99 → 49 points
  });

  test("returns correct points for fractional amounts over 100", () => {
    expect(calculateRewardPoints(100.99)).toBe(50); // floor = 100 → 50 points
    expect(calculateRewardPoints(120.75)).toBe(90); // floor = 120 → (20*2)+50
    expect(calculateRewardPoints(150.49)).toBe(150); // floor = 150 → (50*2)+50
  });

  test("edge case: just over reward boundary", () => {
    expect(calculateRewardPoints(50.01)).toBe(0); // floor = 50
    expect(calculateRewardPoints(100.01)).toBe(50); // floor = 100
    expect(calculateRewardPoints(100.99)).toBe(50); // floor = 100
    expect(calculateRewardPoints(101.01)).toBe(52); // floor = 101 → (1*2)+50
  });
});
