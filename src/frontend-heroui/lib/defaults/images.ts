export const images: Record<string, string> = {
  "google-logo": "svg:flat-color-icons:google",
  "github-logo": "svg:mdi:github",
  "alert-icon": "svg:si:warning-line",
  "eye-closed-icon": "svg:ph:eye-closed",
  "eye-opened-icon": "svg:ph:eye",
  "link-back-icon": "svg:icon-park-outline:back",
  "success-icon": "si:check-circle-line",
};

export const getImageIdByName = (name?: string): string =>
  (images[name || ""] || "").replaceAll("svg:", "");
