import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "cookie-consent-v1";

export type ConsentValue = "accepted" | "rejected";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "accepted" || v === "rejected" ? v : null;
}

export function setConsent(value: ConsentValue) {
  window.localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: value }));
}

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4446431956171104";

function loadAdsense() {
  if (typeof document === "undefined") return;
  if (document.querySelector(`script[src="${ADSENSE_SRC}"]`)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = ADSENSE_SRC;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [decision, setDecision] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setMounted(true);
    const current = getConsent();
    setDecision(current);
    if (current === "accepted") loadAdsense();
  }, []);

  if (!mounted || decision !== null) return null;

  const accept = () => {
    setConsent("accepted");
    setDecision("accepted");
    loadAdsense();
  };
  const reject = () => {
    setConsent("rejected");
    setDecision("rejected");
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Usamos cookies para melhorar sua experiência e exibir anúncios personalizados.
          Veja nossa{" "}
          <Link to="/privacidade" className="underline underline-offset-2 hover:text-foreground">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={reject}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
