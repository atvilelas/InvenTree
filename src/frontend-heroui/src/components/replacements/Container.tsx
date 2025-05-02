import { PropsWithChildren } from "react";

export const Container = (props: PropsWithChildren<unknown>) => {
  const { children, ...restProps } = props;

  return <div {...restProps}>{children}</div>;
};
