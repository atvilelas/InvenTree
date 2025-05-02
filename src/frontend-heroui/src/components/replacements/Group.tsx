import { PropsWithChildren } from "react";

export const Group = (props: PropsWithChildren<unknown>) => {
  const { children, ...restProps } = props;

  return <div {...restProps}>{children}</div>;
};
