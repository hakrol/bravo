import { RentesjekkAd } from "@/components/rentesjekk-ad";
import type { RentesjekkPlacement } from "@/lib/rentesjekk";

export function StickyLeftAdRail({ placement = "blog-left-sidebar" }: {
  placement?: Extract<RentesjekkPlacement, "blog-left-sidebar" | "occupation-left-sidebar">;
} = {}) {
  return (
    <div className="sticky-left-ad-rail">
      <RentesjekkAd placement={placement} />
    </div>
  );
}
