import type { HTMLAttributes, ReactNode } from "react";

type BlogFAQProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

type BlogFAQItemProps = HTMLAttributes<HTMLDetailsElement> & {
  question: string;
  children: ReactNode;
};

export function BlogFAQ({ children, className, ...props }: BlogFAQProps) {
  const title = "Ofte stilte spørsmål";
  const ariaLabel = props["aria-label"] ?? title;
  const classes = ["blog-faq", className].filter(Boolean).join(" ");

  return (
    <section {...props} aria-label={ariaLabel} className={classes}>
      <div className="blog-faq-header">
        <h2 className="blog-faq-title">{title}</h2>
      </div>
      <div className="blog-faq-list">{children}</div>
    </section>
  );
}

export function BlogFAQItem({ question, children, className, ...props }: BlogFAQItemProps) {
  const classes = ["blog-faq-item", className].filter(Boolean).join(" ");

  return (
    <details {...props} className={classes}>
      <summary className="blog-faq-question">
        <span>{question}</span>
      </summary>
      <div className="blog-faq-answer">{children}</div>
    </details>
  );
}
