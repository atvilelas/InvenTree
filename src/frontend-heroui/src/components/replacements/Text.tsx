import { PropsWithChildren } from "react";

export const Text = (props: PropsWithChildren<unknown>) => {
  const { children, ...restProps } = props;

  return <div {...restProps}>{children}</div>;
};
