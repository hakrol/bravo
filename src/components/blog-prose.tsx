import type { ReactNode } from "react";

type BlogProseProps = {
  children: ReactNode;
};

export function BlogProse({ children }: BlogProseProps) {
  return <div className="blog-prose max-w-none">{children}</div>;
}
