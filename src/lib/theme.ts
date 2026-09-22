// localStorage key for the chosen colour theme: "light", or absent for
// dark, where every visitor starts. Shared by the head script in layout.tsx (server) and
// ThemeToggle (client), so it lives outside any "use client" file: a
// constant exported from one reaches the server as a stub, not a value.
export const THEME_KEY = "pbp-theme";
