import { siteConfig } from "@/config/site";

/**
 * Logo da marca, controlada pela configuração central (src/config/site.ts).
 * Troque o arquivo em /public e o caminho em siteConfig.logo para rebrandar.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={siteConfig.logo.src}
      alt={siteConfig.logo.alt}
      className={className}
      draggable={false}
    />
  );
}
