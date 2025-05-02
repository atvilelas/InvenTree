import { t } from "@lingui/core/macro";
import { addToast } from "@heroui/toast";
import { Icon } from "@lib/images";

import { extractErrorMessage } from "./api";

/**
 * Show a notification that the feature is not yet implemented
 */
export const notYetImplemented = () => {
  addToast({
    title: t`Not implemented`,
    description: t`This feature is not yet implemented`,
    color: "danger",
    timeout: 2000,
  });
};

/**
 * Show a notification that the user does not have permission to perform the action
 */
export function permissionDenied() {
  addToast({
    title: t`Permission Denied`,
    description: t`You do not have permission to perform this action`,
    color: "danger",
    timeout: 2000,
  });
}

/**
 * Display a notification on an invalid return code
 */
export function invalidResponse(returnCode: number) {
  // TODO: Specific return code messages
  addToast({
    title: t`Invalid Return Code`,
    color: "danger",
    timeout: 2000,
  });
}

/**
 * Display a notification on timeout
 */
export function showTimeoutNotification() {
  addToast({
    title: t`Timeout`,
    description: t`The request timed out`,
    color: "danger",
    timeout: 2000,
  });
}

/*
 * Display a login / logout notification message.
 * Any existing login notification(s) will be hidden.
 */
export function showLoginNotification({
  title,
  message,
  success = true,
}: {
  title: string;
  message: string;
  success?: boolean;
}) {
  addToast({
    title: title,
    description: message,
    color: success ? "success" : "danger",
    icon: success ? <Icon name="success-icon" /> : <Icon name="alert-icon" />,
    timeout: 2500,
  });
}

export function showApiErrorMessage({
  error,
  title,
  message,
  field,
}: {
  error: any;
  title: string;
  message?: string;
  field?: string;
}) {
  const errorMessage = extractErrorMessage({
    error: error,
    field: field,
    defaultMessage: message,
  });

  addToast({
    title: title,
    description: errorMessage,
    color: "danger",
  });
}
