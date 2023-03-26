import classNames from "classnames";
import type { FunctionComponent, ReactNode } from "react";

export interface ContainerProps {
  className?: string;
  children: ReactNode;
}

const Container: FunctionComponent<ContainerProps> = ({
  children,
  className,
}) => (
  <div
    className={classNames(
      "m-auto mx-auto w-[100%] max-w-[1400px] max-2xl:max-w-[1200px] max-xl:max-w-[90vw]",
      className
    )}
  >
    {children}
  </div>
);

export default Container;
