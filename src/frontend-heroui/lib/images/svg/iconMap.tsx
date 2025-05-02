export const iconMap: Record<string, () => Promise<any>> = {
  "../../images/inventory.svg": () => import("./LocalInventory"),
  "../../images/kaleidoscope-backdrop.svg": () =>
    import("./LocalKaleidoscopeBackdrop"),
  "google-logo": () => import("./IconifyFlatColorIconsGoogle"),
  "flat-color-icons:google": () => import("./IconifyFlatColorIconsGoogle"),
  "github-logo": () => import("./IconifyMdiGithub"),
  "mdi:github": () => import("./IconifyMdiGithub"),
  "eye-opened-icon": () => import("./IconifyPhEye"),
  "ph:eye": () => import("./IconifyPhEye"),
  "eye-closed-icon": () => import("./IconifyPhEyeClosed"),
  "ph:eye-closed": () => import("./IconifyPhEyeClosed"),
  "alert-icon": () => import("./IconifySiWarningLine"),
  "si:warning-line": () => import("./IconifySiWarningLine"),
  "success-icon": () => import("./IconifySiCheckCircleLine"),
  "si:check-circle-line": () => import("./IconifySiCheckCircleLine"),
};
