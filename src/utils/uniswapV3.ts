import { BigNumber } from "ethers5";

export const MIN_TICK = -887272;
export const MAX_TICK = 887272;

export function tickToPrice(tick: number, decimal0: number, decimal1: number): number {
  const ratio = Math.pow(1.0001, tick);
  return ratio * Math.pow(10, decimal0 - decimal1);
}

export function priceToTick(price: number, decimal0: number, decimal1: number): number {
  const adjustedPrice = price * Math.pow(10, decimal1 - decimal0);
  return Math.floor(Math.log(adjustedPrice) / Math.log(1.0001));
}

export function sqrtPriceX96ToPrice(
  sqrtPriceX96: BigNumber,
  decimal0: number,
  decimal1: number
): number {
  const ratioX192 = sqrtPriceX96.mul(sqrtPriceX96);
  const price = Number(ratioX192) / Math.pow(2, 192);
  return price * Math.pow(10, decimal0 - decimal1);
}

export function nearestUsableTick(tick: number, tickSpacing: number): number {
  const minMultiple = Math.ceil(MIN_TICK / tickSpacing) * tickSpacing;
  const maxMultiple = Math.floor(MAX_TICK / tickSpacing) * tickSpacing;

  const rounded = Math.floor(tick / tickSpacing) * tickSpacing;

  if (rounded < minMultiple) return minMultiple;
  if (rounded > maxMultiple) return maxMultiple;
  return rounded;
}