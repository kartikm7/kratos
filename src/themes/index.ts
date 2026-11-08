import type { Theme } from "./types";
import kratos from "./variants/kratos.json" with { type: "json" };
import tokyonight from "./variants/tokyonight.json" with { type: "json" };
import catppuccin from "./variants/catppuccin.json" with { type: "json" };
import catppuccinFrappe from "./variants/catppuccin-frappe.json" with { type: "json" };
import catppuccinMacchiato from "./variants/catppuccin-macchiato.json" with { type: "json" };
import gruvbox from "./variants/gruvbox.json" with { type: "json" };
import github from "./variants/github.json" with { type: "json" };
import dracula from "./variants/dracula.json" with { type: "json" };
import nord from "./variants/nord.json" with { type: "json" };
import oneDark from "./variants/one-dark.json" with { type: "json" };
import rosepine from "./variants/rosepine.json" with { type: "json" };
import solarized from "./variants/solarized.json" with { type: "json" };
import everforest from "./variants/everforest.json" with { type: "json" };
import kanagawa from "./variants/kanagawa.json" with { type: "json" };
import vesper from "./variants/vesper.json" with { type: "json" };

// drop future variant JSONs into ./variants and register them here
const themeRegistry: { [key: string]: Theme } = {
  kratos,
  tokyonight,
  catppuccin,
  "catppuccin-frappe": catppuccinFrappe,
  "catppuccin-macchiato": catppuccinMacchiato,
  gruvbox,
  github,
  dracula,
  nord,
  "one-dark": oneDark,
  rosepine,
  solarized,
  everforest,
  kanagawa,
  vesper,
};

const getTheme = (name?: string): Theme => {
  if (name && themeRegistry[name]) return themeRegistry[name];
  return themeRegistry.kratos as Theme;
};

export { themeRegistry, getTheme };
