import type { RawCashflowSparkline } from "../repositories/analytics.repository";

export function calculateSparkline(
  rawPoints: RawCashflowSparkline[],
  limitDays = 7
): number[] {
  const pointsMap = new Map<string, number>();
  rawPoints.forEach((p) => {
    pointsMap.set(p._id, p.amount);
  });

  const sparkline: number[] = [];
  const now = new Date();

  for (let i = limitDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    sparkline.push(pointsMap.get(dateStr) ?? 0);
  }

  return sparkline;
}
