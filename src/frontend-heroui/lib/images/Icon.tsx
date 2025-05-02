import { lazy, Suspense } from "react";

import { getThemeSpacingVariables } from "..";

import { iconMap } from "./svg/iconMap"; // your generated map
import { IconDefinedSizes, IconProps } from "./IconProps";

const lazyCache = new Map<string, ReturnType<typeof lazy>>();
const IconFallback = (props: { size: string; name: string }) => (
  <div
    style={{
      overflow: "hidden",
      width: props.size,
      height: props.size,
      fontSize: "0px",
    }}
  >
    Could not find icon {props.name}
  </div>
);

export const Icon = (props: IconProps & { name?: string; src?: string }) => {
  const imageId = props.name || props.src || "";
  const importer = iconMap[imageId];

  if (!importer) {
    console.error(`ID not found for image name: ${props.name}`);

    return null;
  }

  let size: string | undefined = props.size;

  if (!size) {
    size = "lg";
  }

  if (["sm", "md", "lg", "xl"].includes(size)) {
    size = getThemeSpacingVariables().fontSize[size as IconDefinedSizes];
  }
  if (!importer) {
    console.error(`Image: ${props.name} not found under id: ${imageId}`);

    return null;
  }

  let LazyIcon = lazyCache.get(imageId);

  if (!LazyIcon) {
    LazyIcon = lazy(importer);
    lazyCache.set(imageId, LazyIcon);
  }

  return (
    <Suspense fallback={<IconFallback name={props.name!} size={size} />}>
      <LazyIcon height={size} width={size} />
    </Suspense>
  );
};
