import type { HTMLAttributes } from "react";

export interface ScoreBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children" | "color"> {
  score: number;
  label?: string;
  color?: string;
  background?: string;
  trackColor?: string;
  size?: "sm" | "md";
}

/** A compact score gauge for dense recommendation cards. */
export function ScoreBadge({
  score,
  label = "match",
  color = "#2f7d5b",
  background = "#f2f7f3",
  trackColor = "rgba(47, 125, 91, 0.16)",
  size = "md",
  className,
  style,
  ...props
}: ScoreBadgeProps) {
  const safeScore = clamp(Number.isFinite(score) ? score : 0, 0, 100);
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const compact = size === "sm";

  return (
    <span
      {...props}
      aria-label={props["aria-label"] ?? `${Math.round(safeScore)} percent ${label}`}
      className={className}
      role={props.role ?? "img"}
      style={{
        alignItems: "center",
        background,
        border: `1px solid ${trackColor}`,
        borderRadius: 999,
        color,
        display: "inline-flex",
        fontFamily: '"Manrope", "Segoe UI", sans-serif',
        fontSize: compact ? 10 : 11,
        fontWeight: 800,
        gap: compact ? 5 : 6,
        letterSpacing: "0.015em",
        lineHeight: 1,
        padding: compact ? "4px 7px 4px 5px" : "5px 9px 5px 6px",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <svg aria-hidden="true" height={compact ? 18 : 20} viewBox="0 0 20 20" width={compact ? 18 : 20}>
        <circle cx="10" cy="10" fill="none" r={radius} stroke={trackColor} strokeWidth="2.4" />
        <circle
          cx="10"
          cy="10"
          fill="none"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - safeScore / 100)}
          strokeLinecap="round"
          strokeWidth="2.4"
          transform="rotate(-90 10 10)"
        />
      </svg>
      <span aria-hidden="true">{Math.round(safeScore)}% {label}</span>
    </span>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
