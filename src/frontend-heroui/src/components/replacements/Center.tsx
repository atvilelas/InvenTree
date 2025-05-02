import { PropsWithChildren } from "react";

export const Center = (props: PropsWithChildren<unknown>) => {
  const { children, ...restProps } = props;

  return <div {...restProps}>{children}</div>;
};
