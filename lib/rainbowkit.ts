import { darkTheme, lightTheme, Theme } from "@rainbow-me/rainbowkit";

export const customDarkTheme = darkTheme({
  borderRadius: "medium",
  accentColor: "#7c3aed",
  accentColorForeground: "white",
  fontStack: "system",
  overlayBlur: "small",
});

export const customLightTheme = lightTheme({
  borderRadius: "medium",
  accentColor: "#7c3aed",
  accentColorForeground: "white",
  fontStack: "system",
  overlayBlur: "small",
});

export const getTheme = (isDarkMode: boolean): Theme => {
  return isDarkMode ? customDarkTheme : customLightTheme;
};
