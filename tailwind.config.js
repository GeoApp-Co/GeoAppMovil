/** @type {import('tailwindcss').Config} */
export const presets = [require("nativewind/preset")];
export const content = [
  "./App.tsx",
  "./app/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
  "./screens/**/*.{js,jsx,ts,tsx}",
  "./assets/**/*.{js,jsx,ts,tsx}"
];
export const theme = {
  extend: {
      colors: {
        azul: "#0054a6",
        verde: "#a3c614",
      },
  }
};
export const plugins = [];