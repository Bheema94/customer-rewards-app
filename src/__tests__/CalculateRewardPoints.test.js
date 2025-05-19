import { calculateRewardPoints } from "../Utlis/RewardsUtils";

describe("calculateRewardPoints", () => {
  // Whole number test cases
  describe("Whole number amounts", () => {
    test("returns 0 points for amounts <= 50", () => {
      expect(calculateRewardPoints(0)).toBe(0);
      expect(calculateRewardPoints(30)).toBe(0);
      expect(calculateRewardPoints(50)).toBe(0);
    });

    test("returns correct points for amounts between 51 and 100", () => {
      expect(calculateRewardPoints(51)).toBe(1);
      expect(calculateRewardPoints(75)).toBe(25);
      expect(calculateRewardPoints(100)).toBe(50);
    });

    test("returns correct points for amounts over 100", () => {
      expect(calculateRewardPoints(120)).toBe(90); // (20 * 2) + 50
      expect(calculateRewardPoints(150)).toBe(150); // (50 * 2) + 50
      expect(calculateRewardPoints(101)).toBe(52); // (1 * 2) + 50
    });
  });

  // Fractional amount test cases
  describe("Fractional amounts", () => {
    test("returns 0 points for amounts < 51 even with fractions", () => {
      expect(calculateRewardPoints(50.99)).toBe(0); // floor = 50
      expect(calculateRewardPoints(49.75)).toBe(0); // floor = 49
      expect(calculateRewardPoints(50.499)).toBe(0); // floor = 50
    });

    test("returns correct points for amounts between 51 and 100 with fractions", () => {
      expect(calculateRewardPoints(51.99)).toBe(1); // floor = 51
      expect(calculateRewardPoints(99.99)).toBe(49); // floor = 99
      expect(calculateRewardPoints(75.25)).toBe(25); // floor = 75
    });

    test("returns correct points for amounts over 100 with fractions", () => {
      expect(calculateRewardPoints(100.99)).toBe(50); // floor = 100
      expect(calculateRewardPoints(120.75)).toBe(90); // floor = 120
      expect(calculateRewardPoints(150.49)).toBe(150); // floor = 150
    });

    test("handles edge cases just over reward boundaries", () => {
      expect(calculateRewardPoints(50.01)).toBe(0); // floor = 50
      expect(calculateRewardPoints(100.01)).toBe(50); // floor = 100
      expect(calculateRewardPoints(101.01)).toBe(52); // floor = 101
    });

    test("handles high-precision decimal values", () => {
      expect(calculateRewardPoints(100.0001)).toBe(50); // floor = 100
      expect(calculateRewardPoints(100.9999)).toBe(50); // floor = 100
      expect(calculateRewardPoints(101.0001)).toBe(52); // floor = 101
    });
  });
});
