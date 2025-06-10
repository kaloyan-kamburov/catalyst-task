export const formatValue = (
  value: string | number | boolean | null | undefined,
  type: string
): string => {
  if (value === undefined || value === null) return "";
  if (type === "number" && typeof value === "number") {
    return value.toFixed(2);
  }
  if (type === "date" && (typeof value === "string" || typeof value === "number")) {
    return new Date(String(value)).toLocaleDateString();
  }
  return String(value);
};
