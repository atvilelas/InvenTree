export type IconDefinedSizes = "sm" | "md" | "lg" | "xl";
export type IconProps<ExtraProps = {}> = ExtraProps & {
  size?: IconDefinedSizes | string;
};
