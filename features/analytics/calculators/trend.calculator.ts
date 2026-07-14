export interface VarianceResult {
  difference: number;
  percentageChange: number;
}

export function calculateMoMVariance(current: number, previous: number): VarianceResult {
  const difference = current - previous;
  if (previous === 0) {
    return {
      difference,
      percentageChange: current > 0 ? 100 : 0,
    };
  }

  const percentageChange = (difference / previous) * 100;
  return {
    difference,
    percentageChange,
  };
}
