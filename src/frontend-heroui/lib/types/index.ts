import {
  BaseColors,
  ColorScale,
  SemanticBaseColors,
  ThemeColors,
} from "@heroui/theme";

export * from "./Auth";
export * from "./Core";
export * from "./Filters";
export * from "./Forms";
export * from "./Modals";
export * from "./Plugins";
export * from "./Server";
export * from "./Settings";
export * from "./Tables";
export * from "./User";

export type AllThemeColors = BaseColors &
  ColorScale &
  SemanticBaseColors &
  ThemeColors;
