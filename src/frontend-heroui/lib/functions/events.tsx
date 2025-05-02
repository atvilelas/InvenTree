import { SyntheticEvent } from "react";

// Helper function to cancel event propagation
export const cancelEvent = (event: SyntheticEvent) => {
  event?.preventDefault();
  event?.stopPropagation();
  event?.nativeEvent?.stopImmediatePropagation();
}
