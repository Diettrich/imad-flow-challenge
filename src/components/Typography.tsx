import type { FunctionComponent, ReactNode } from "react";

export const Title: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <h1 className="mb-10 text-2xl font-bold text-gray-900 lg:text-3xl xl:text-4xl">
    {children}
  </h1>
);
