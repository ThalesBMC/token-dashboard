/**
 * Utility for formatting large numbers for display
 */

export const formatDisplayValue = (value: string, decimals: number = 4) => {
  if (!value) return "0";

  const num = parseFloat(value);
  if (isNaN(num)) return value;

  if (num > 0 && num < 0.0001) {
    return num.toExponential(2);
  }

  if (num >= 1000000) {
    return num.toLocaleString("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    });
  }

  // For normal numbers, limit decimal places and truncate if too long
  const parts = value.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] ? parts[1].slice(0, decimals) : "";

  // If integer part is too long (more than 8 digits), truncate with ellipsis
  const formattedIntegerPart =
    integerPart.length > 8
      ? `${integerPart.slice(0, 4)}...${integerPart.slice(-4)}`
      : integerPart;

  // Return formatted value
  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
};

// Format timestamp to readable date
export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};
