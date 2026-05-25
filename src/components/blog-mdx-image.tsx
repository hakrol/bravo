import type { ImgHTMLAttributes } from "react";

const aiCaptionText = "Illustrasjonen er AI-generert og brukes for visualisering av temaet.";

function buildCaption(alt: string) {
  const description = alt.trim();

  if (!description) {
    return `Illustrasjon til artikkeltemaet. ${aiCaptionText}`;
  }

  const normalizedDescription = /[.!?]$/.test(description) ? description : `${description}.`;

  return `${normalizedDescription} ${aiCaptionText}`;
}

export function BlogMdxImage({ alt = "", className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const imageClasses = ["blog-image", className].filter(Boolean).join(" ");

  return (
    <figure className="blog-image-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={alt} className={imageClasses} {...props} />
      <figcaption className="blog-image-caption">{buildCaption(alt)}</figcaption>
    </figure>
  );
}
