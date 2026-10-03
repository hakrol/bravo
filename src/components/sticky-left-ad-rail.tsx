import { BookbeatAd } from "@/components/bookbeat-ad";
import type { BookbeatPlacement } from "@/lib/bookbeat";

export function StickyLeftAdRail({ placement = "blog-left-sidebar" }: {
  placement?: Extract<BookbeatPlacement, "blog-left-sidebar" | "occupation-left-sidebar">;
} = {}) {
  return (
    <div className="sticky-left-ad-rail">
      <BookbeatAd placement={placement} />
    </div>
  );
}
