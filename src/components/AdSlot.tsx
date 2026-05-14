import { useEffect, useRef } from "react";

interface AdSlotProps {
  variant?: "horizontal" | "in-feed" | "sidebar";
  label?: string;
  /** AdSense ad slot ID (data-ad-slot). Falls back to a placeholder if omitted. */
  slot?: string;
}

const ADSENSE_CLIENT = "ca-pub-4446431956171104";

const sizes: Record<string, string> = {
  horizontal: "min-h-[96px] sm:min-h-[112px]",
  "in-feed": "min-h-[128px] sm:min-h-[144px]",
  sidebar: "min-h-[256px]",
};

const formats: Record<string, { format: string; responsive: string }> = {
  horizontal: { format: "auto", responsive: "true" },
  "in-feed": { format: "fluid", responsive: "true" },
  sidebar: { format: "auto", responsive: "true" },
};

export function AdSlot({ variant = "horizontal", label = "Publicidade", slot }: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    if (typeof window === "undefined") return;
    try {
      // @ts-expect-error - adsbygoogle is injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      // AdSense not yet loaded — will retry on next mount
    }
  }, []);

  const { format, responsive } = formats[variant];

  return (
    <aside
      aria-label="Espaço publicitário"
      className={`relative w-full overflow-hidden rounded-lg border border-dashed border-border/40 bg-surface/30 ${sizes[variant]}`}
    >
      <span className="absolute left-2 top-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/50">
        {label}
      </span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot ?? "0000000000"}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </aside>
  );
}
