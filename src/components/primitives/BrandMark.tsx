import { useId, type CSSProperties, type HTMLAttributes, type SVGProps } from "react";

export interface BrandMarkProps
  extends Omit<SVGProps<SVGSVGElement>, "children" | "height" | "width"> {
  /** Width and height of the square mark. */
  size?: number | string;
  /** Main brand color used by the tile. */
  primary?: string;
  /** Bright highlight used by the monogram and sprout. */
  accent?: string;
  /** Soft inset color that gives the tile depth. */
  surface?: string;
  /** Accessible name. Ignored when `decorative` is true. */
  title?: string;
  /** Hides the mark from assistive technology when adjacent text names the brand. */
  decorative?: boolean;
}

/**
 * NutriFuel's original mark: an energetic N, a fork tine, and a fresh sprout
 * combined in a soft food-label tile.
 */
export function BrandMark({
  size = 44,
  primary = "#173f31",
  accent = "#c8f36a",
  surface = "#f4f8ec",
  title = "NutriFuel",
  decorative = false,
  className,
  style,
  ...props
}: BrandMarkProps) {
  const rawId = useId();
  const gradientId = `nutrifuel-mark-${rawId.replace(/:/g, "")}`;
  const titleId = `${gradientId}-title`;
  const callerLabel = props["aria-label"];
  const callerLabelledBy = props["aria-labelledby"];
  const useGeneratedTitle = !decorative && !callerLabel && !callerLabelledBy;

  return (
    <svg
      {...props}
      aria-hidden={decorative ? true : undefined}
      aria-labelledby={decorative ? undefined : callerLabelledBy ?? (useGeneratedTitle ? titleId : undefined)}
      className={className}
      height={size}
      role={decorative ? undefined : props.role ?? "img"}
      style={{ display: "block", flex: "none", ...style }}
      viewBox="0 0 48 48"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {useGeneratedTitle && <title id={titleId}>{title}</title>}
      <defs>
        <linearGradient id={gradientId} x1="7" x2="41" y1="5" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor={primary} />
          <stop offset="1" stopColor={primary} stopOpacity="0.82" />
        </linearGradient>
      </defs>

      <rect width="44" height="44" x="2" y="2" rx="14" fill={`url(#${gradientId})`} />
      <path
        d="M7.75 25.2c0-9.84 6.18-17.45 15.96-17.45 8.91 0 16.54 6.49 16.54 16.5 0 9.89-6.38 16-16.18 16-9.97 0-16.32-5.61-16.32-15.05Z"
        fill={surface}
        opacity="0.08"
      />

      {/* The diagonal reads as both an N and an upward nutrition trend. */}
      <path
        d="M14.5 33V17.5L32.6 33V19.2"
        fill="none"
        stroke={surface}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4.15"
      />
      <path
        d="M14.5 32.9 14.5 17.5 32.6 33"
        fill="none"
        stroke={accent}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.05"
      />

      {/* Fork tines turn the right stem into a subtle food cue. */}
      <path
        d="M28.5 13.2v7.15M32.6 12.5v7.85M36.7 13.2v4.2c0 2.05-1.62 3.7-3.62 3.7h-.48"
        fill="none"
        stroke={surface}
        strokeLinecap="round"
        strokeWidth="2.15"
      />

      {/* A leaf keeps the identity rooted in fresh, goal-led food. */}
      <path
        d="M20.45 13.7c2.22-3.54 5.32-4.68 9.08-3.28-1.45 3.77-4.31 5.23-8.58 4.39"
        fill={accent}
      />
      <path d="m20.25 16.15 5.47-3.27" fill="none" stroke={surface} strokeLinecap="round" strokeWidth="1.25" />
    </svg>
  );
}

export interface BrandLockupProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color"> {
  markSize?: number;
  primary?: string;
  accent?: string;
  surface?: string;
  wordColor?: string;
  wordAccent?: string;
  /** Optional line below the wordmark. Omit in compact navigation. */
  tagline?: string;
  /** Accessible name for the full lockup. */
  title?: string;
}

/** A responsive HTML wordmark paired with the inline SVG brand mark. */
export function BrandLockup({
  markSize = 42,
  primary = "#173f31",
  accent = "#c8f36a",
  surface = "#f4f8ec",
  wordColor = "#173f31",
  wordAccent,
  tagline,
  title = "NutriFuel",
  className,
  style,
  ...props
}: BrandLockupProps) {
  const lockupStyle: CSSProperties = {
    alignItems: "center",
    display: "inline-flex",
    gap: Math.max(9, Math.round(markSize * 0.24)),
    minWidth: 0,
    ...style,
  };

  return (
    <span {...props} aria-label={title} className={className} role="img" style={lockupStyle}>
      <BrandMark
        accent={accent}
        decorative
        primary={primary}
        size={markSize}
        surface={surface}
      />
      <span aria-hidden="true" style={{ display: "grid", lineHeight: 1 }}>
        <span
          style={{
            color: wordColor,
            fontFamily: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
            fontSize: Math.max(18, Math.round(markSize * 0.53)),
            fontWeight: 800,
            letterSpacing: "-0.055em",
            whiteSpace: "nowrap",
          }}
        >
          Nutri<span style={{ color: wordAccent ?? wordColor }}>Fuel</span>
        </span>
        {tagline ? (
          <span
            style={{
              color: wordColor,
              fontFamily: '"Manrope", "Segoe UI", sans-serif',
              fontSize: Math.max(7, Math.round(markSize * 0.2)),
              fontWeight: 700,
              letterSpacing: "0.105em",
              marginTop: 4,
              opacity: 0.64,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
