import { cssUnitPair } from "..";

export const getThemeVariables = (name: string | number): string => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--theme-${name}`)
    .trim();
};

export const getThemeSpacingVariables = () => {
  const [fontXLSize, fontXLUnit] = cssUnitPair(
    getThemeVariables("font-size-large"),
  );

  const [radiusSize, radiusUnit] = cssUnitPair(
    getThemeVariables("adius-large"),
  );

  return {
    spacing: {
      sm: getThemeVariables("spacing-small"),
      md: getThemeVariables("spacing-medium"),
      lg: getThemeVariables("spacing-large"),
      xl: getThemeVariables("spacing-extra-large"),
    },
    fontSize: {
      sm: getThemeVariables("font-size-small"),
      md: getThemeVariables("font-size-medium"),
      lg: getThemeVariables("font-size-large"),
      xl: `${fontXLSize * 1.25}${fontXLUnit}`,
    },
    radius: {
      sm: getThemeVariables("radius-small"),
      md: getThemeVariables("radius-medium"),
      lg: getThemeVariables("radius-large"),
      xl: `${radiusSize * 1.25}${radiusUnit}`,
    },
  };
};
