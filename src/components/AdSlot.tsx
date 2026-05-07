interface AdSlotProps {
  variant?: "horizontal" | "in-feed" | "sidebar";
  label?: string;
}

const sizes: Record<string, string> = {
  horizontal: "h-24 sm:h-28",
  "in-feed": "h-32 sm:h-36",
  sidebar: "h-64",
};

export function AdSlot({ variant = "horizontal", label = "Publicidade" }: AdSlotProps) {
  return (
    <aside
      aria-label="Espaço publicitário"
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border/60 bg-surface/40 ${sizes[variant]}`}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
          {label}
        </span>
        <span className="text-xs text-muted-foreground/50">
          Espaço reservado para Google AdSense
        </span>
      </div>
      {/*
        Para ativar o AdSense, substitua o conteúdo deste componente por:
        <ins className="adsbygoogle" data-ad-client="ca-pub-XXXX" data-ad-slot="YYYY" ... />
      */}
    </aside>
  );
}
