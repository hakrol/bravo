import { UscoreAd } from "@/components/uscore-ad";
import type { UscorePlacement } from "@/lib/uscore";

export function StickyLeftAdRail({ placement = "blog-left-sidebar" }: {
  placement?: Extract<UscorePlacement, "blog-left-sidebar" | "occupation-left-sidebar">;
} = {}) {
  return (
    <div className="sticky-left-ad-rail">
      <UscoreAd placement={placement} />
    </div>
  );
}
