import { Formatter } from "@imranbarbhuiya/duration";

export const formatter = new Formatter({
  format: "long",
  patterns: ["y", "mo", "w", "d", "h", "m", "s"],
});

export const lazyFormattedTime = (avgTime: number) => {
  const patterns = avgTime > 24 * 60 * 60 * 1_000 ? (["y", "mo", "w", "d"] as const) : (["h", "m", "s"] as const);
  return new Formatter({
    format: "short",
    patterns,
    separator: " ",
  }).format(avgTime);
};

export const numberFormatter = (num: number) => {
  if (num < 1) return num;
  const SI = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" },
    { value: 1, symbol: "" },
  ];

  const regex = /\.0+$|(\.[0-9]*[1-9])0+$/; // find (5454.0 = .0)

  let i: number;
  for (i = 0; i < SI.length; i++) {
    if (num >= SI[i].value) break;
  }

  return (num / SI[i].value).toFixed(2).replace(regex, "$1") + SI[i].symbol;
};
