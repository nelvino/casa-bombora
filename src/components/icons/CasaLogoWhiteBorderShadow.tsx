// Wrapper component for rendering the CasaLogoWhiteBorderShadow SVG as an <img>
// Works with Next.js setups where importing SVG yields a URL. You can also
// pass a public path via the `src` prop if needed.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import svgUrl from "./CasaLogoWhiteBorderShadow.svg";
import Image from "next/image";

export function CasaLogoWhiteBorderShadow({
  size = 120,
  className = "",
  src,
  alt = "Casa Bombora Logo (White with Border Shadow)",
}: {
  size?: number;
  className?: string;
  src?: string;
  alt?: string;
}) {
  const url = (src ?? (svgUrl as unknown as string)) as string;
  return (
    <Image
      src={url}
      alt={alt}
      width={size}
      height={size}
      className={className}
      draggable={false}
      unoptimized
    />
  );
}
