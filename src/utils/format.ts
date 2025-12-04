// src/utils/format.ts
export const formatNumber = (value: number | string): string => {
  if (!value) return "0";
  return Number(value).toLocaleString();
};
