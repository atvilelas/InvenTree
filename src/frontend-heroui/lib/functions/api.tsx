import type { ApiEndpoints } from "../enums/ApiEndpoints";
import type { PathParams } from "../types/Core";

/**
 * Function to return the API prefix.
 * For now it is fixed, but may be configurable in the future.
 */
export function apiPrefix(): string {
  return "/api/";
}

/**
 * Construct an API URL with an endpoint and (optional) pk value
 */
export function apiUrl(
  endpoint: ApiEndpoints | string,
  pk?: any,
  pathParams?: PathParams
): string {
  let _url = endpoint;

  // If the URL does not start with a '/', add the API prefix
  if (!_url.startsWith("/")) {
    _url = apiPrefix() + _url;
  }

  if (_url && pk) {
    if (_url.indexOf(":id") >= 0) {
      _url = _url.replace(":id", `${pk}`);
    } else {
      _url += `${pk}/`;
    }
  }

  if (_url && pathParams) {
    for (const key in pathParams) {
      _url = _url.replace(`:${key}`, `${pathParams[key]}`);
    }
  }

  return _url;
}

import { t } from "@lingui/core/macro";

/**
 * Extract a sensible error message from an API error response
 * @param error The error response from the API
 * @param field The field to extract the error message from (optional)
 * @param defaultMessage A default message to use if no error message is found (optional)
 */
export function extractErrorMessage({
  error,
  field,
  defaultMessage,
}: {
  error: any;
  field?: string;
  defaultMessage?: string;
}): string {
  const error_data = error.response?.data ?? null;

  let message = "";

  if (error_data) {
    message = error_data[field ?? "error"] ?? error_data["non_field_errors"];
  }

  // No message? Look at the response status codes
  if (!message) {
    const status = error.response?.status ?? null;

    if (status) {
      switch (status) {
        case 400:
          message = t`Bad request`;
          break;
        case 401:
          message = t`Unauthorized`;
          break;
        case 403:
          message = t`Forbidden`;
          break;
        case 404:
          message = t`Not found`;
          break;
        case 405:
          message = t`Method not allowed`;
          break;
        case 500:
          message = t`Internal server error`;
          break;
        default:
          break;
      }
    }
  }

  if (!message) {
    message = defaultMessage ?? t`An error occurred`;
  }

  return message;
}
