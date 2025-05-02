import type { ModelType } from "../enums/ModelType";

import { BaseColors, ThemeColors } from "@heroui/theme";
import { useTheme } from "@heroui/use-theme";
import { Badge } from "@heroui/badge";

import { useGlobalStatusState } from "../states/StatusState";
import { resolveItem } from "../functions/conversion";


export interface StatusCodeInterface {
  key: number;
  label: string;
  name: string;
  color: keyof Omit<ThemeColors, keyof BaseColors>;
}

export interface StatusCodeListInterface {
  status_class: string;
  values: {
    [key: string]: StatusCodeInterface;
  };
}

interface RenderStatusLabelOptionsInterface {
  size?: "sm" | "md" | "lg";
  hidden?: boolean;
}

/*
 * Generic function to render a status label
 */
const StatusLabel = (
  key: string | number,
  codes: StatusCodeListInterface,
  options: RenderStatusLabelOptionsInterface = {},
) => {
  const { theme } = useTheme();
  let text;
  let color: keyof Omit<ThemeColors, keyof BaseColors> | undefined;

  // Find the entry which matches the provided key
  for (const name in codes.values) {
    const entry: StatusCodeInterface = codes.values[name];

    if (entry?.key == key) {
      text = entry.label;
      color = entry.color;
      break;
    }
  }

  if (!text) {
    console.error(
      `ERR: renderStatusLabel could not find match for code ${key}`,
    );
  }

  // Fallbacks
  if (color === undefined) {
    color = "primary" as keyof Omit<ThemeColors, keyof BaseColors>;
  }

  const size = options.size || "sm";

  if (!text) {
    text = key;
  }

  return (
    <Badge color={color} size={size} variant="solid">
      {text}
    </Badge>
  );
};

export function getStatusCodes(
  type: ModelType | string,
): StatusCodeListInterface | null {
  const statusCodeList = useGlobalStatusState.getState().status;

  if (statusCodeList === undefined) {
    console.log("StatusRenderer: statusCodeList is undefined");

    return null;
  }

  const statusCodes = statusCodeList[type];

  if (statusCodes === undefined) {
    console.log("StatusRenderer: statusCodes is undefined");

    return null;
  }

  return statusCodes;
}

/**
 * Return a list of status codes select options for a given model type
 * returns an array of objects with keys "value" and "display_name"
 *
 */
export const getStatusCodeOptions = (type: ModelType | string): any[] => {
  const statusCodes = getStatusCodes(type);

  if (!statusCodes) {
    return [];
  }

  return Object.values(statusCodes?.values ?? []).map((entry) => {
    return {
      value: entry.key,
      display_name: entry.label,
    };
  });
};

/*
 * Return the name of a status code, based on the key
 */
export function getStatusCodeName(
  type: ModelType | string,
  key: string | number,
) {
  const statusCodes = getStatusCodes(type);

  if (!statusCodes) {
    return null;
  }

  for (const name in statusCodes) {
    const entry: StatusCodeInterface = statusCodes.values[name];

    if (entry.key == key) {
      return entry.name;
    }
  }

  return null;
}

/*
 * Render the status for a object.
 * Uses the values specified in "status_codes.py"
 */
export const StatusRenderer = ({
  status,
  type,
  options,
}: {
  status: string | number;
  type: ModelType | string;
  options?: RenderStatusLabelOptionsInterface;
}) => {
  const statusCodes = getStatusCodes(type);

  if (options?.hidden) {
    return null;
  }

  if (statusCodes === undefined || statusCodes === null) {
    console.warn("StatusRenderer: statusCodes is undefined");

    return null;
  }

  return StatusLabel(status, statusCodes, options);
};

/*
 * Render the status badge in a table
 */
export const TableStatusRenderer = (
  type: ModelType,
  accessor?: string,
): ((record: any) => any) | undefined => {
  const TableStatus = (record: any) => {
    const status = resolveItem(record, accessor ?? "status");

    return (
      status && <div>{StatusRenderer({ status: status, type: type })}</div>
    );
  };

  return TableStatus;
};
