import { lazy, Suspense } from "react";
import { getImageIdByName } from "@lib/defaults/images";

import { getThemeSpacingVariables } from "..";

import { iconMap } from "./svg/iconMap"; // your generated map
import { IconDefinedSizes } from "./IconProps";
import { ImageSVGProps } from "./ImageSVGProps";

const lazyCache = new Map<string, ReturnType<typeof lazy>>();
const ImageSVGFallback = (props: { size: string; name: string }) => (
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

export const ImageSVG = (
  props: ImageSVGProps & { name?: string; localSrc?: string }
) => {
  const imageId = props.name || props.src || "";

  if (!imageId) {
    console.error(`ID not found for image name: ${props.name}`);

    return null;
  }

  const importer = iconMap[imageId];
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
    <Suspense
      fallback={<ImageSVGFallback name={props.name || ""} size={size} />}
    >
      <LazyIcon height={size} width={size} />
    </Suspense>
  );
};
