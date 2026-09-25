export type TrayCell = {
  /** Where the slot sits on a 4 by 4 grid: x, y, width, height. */
  rect: readonly [number, number, number, number];
  label: string;
  filled: boolean;
  ghost?: boolean;
  selected?: boolean;
};
