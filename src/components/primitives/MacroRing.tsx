import type { CSSProperties, HTMLAttributes } from "react";

type RingFormatter = (value: number, max: number) => string;

export interface MacroRingProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "color"> {
  value: number;
  max?: number;
  /** Optional target marker, expressed in the same unit as value. */
  target?: number;
  label?: string;
  unit?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  markerColor?: string;
  labelColor?: string;
  valueColor?: string;
  decimals?: number;
  showValue?: boolean;
  formatValue?: RingFormatter;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Compact, accessible macro gauge for calories, protein, carbs, fat, or fiber. */
export function MacroRing({
  value,
  max = 100,
  target,
  label = "Progress",
  unit = "",
  size = 112,
  strokeWidth = 9,
  color = "#2f7d5b",
  trackColor = "rgba(23, 63, 49, 0.11)",
  markerColor = "#f2a93b",
  labelColor = "#6f7d75",
  valueColor = "#173f31",
  decimals = 0,
  showValue = true,
  formatValue,
  className,
  style,
  ...props
}: MacroRingProps) {
  const safeSize = Number.isFinite(size) ? Math.max(48, size) : 112;
  const safeStroke = clamp(Number.isFinite(strokeWidth) ? strokeWidth : 9, 2, safeSize / 3);
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1;
  const safeValue = Number.isFinite(value) ? value : 0;
  const progress = clamp(safeValue / safeMax, 0, 1);
  const radius = (safeSize - safeStroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = safeSize / 2;
  const targetProgress = typeof target === "number" && Number.isFinite(target)
    ? clamp(target / safeMax, 0, 1)
    : null;
  // The whole SVG is rotated -90deg so zero progress starts at 12 o'clock.
  const markerAngle = targetProgress === null ? 0 : targetProgress * Math.PI * 2;
  const markerRadius = radius;
  const markerX = center + markerRadius * Math.cos(markerAngle);
  const markerY = center + markerRadius * Math.sin(markerAngle);
  const safeDecimals = clamp(Number.isFinite(decimals) ? Math.floor(decimals) : 0, 0, 6);
  const visibleValue = formatValue
    ? formatValue(safeValue, safeMax)
    : `${safeValue.toFixed(safeDecimals)}${unit}`;
  const accessibleText = `${label}: ${visibleValue} of ${safeMax}${unit}${
    targetProgress === null ? "" : `, target ${target}${unit}`
  }`;
  const resolvedRole = props.role ?? "meter";

  const rootStyle: CSSProperties = {
    alignItems: "center",
    display: "inline-grid",
    height: safeSize,
    justifyItems: "center",
    position: "relative",
    width: safeSize,
    ...style,
  };

  return (
    <div
      {...props}
      aria-label={props["aria-label"] ?? (resolvedRole === "meter" ? label : accessibleText)}
      aria-valuemax={props["aria-valuemax"] ?? (resolvedRole === "meter" ? safeMax : undefined)}
      aria-valuemin={props["aria-valuemin"] ?? (resolvedRole === "meter" ? 0 : undefined)}
      aria-valuenow={
        props["aria-valuenow"] ?? (resolvedRole === "meter" ? clamp(safeValue, 0, safeMax) : undefined)
      }
      aria-valuetext={props["aria-valuetext"] ?? (resolvedRole === "meter" ? accessibleText : undefined)}
      className={className}
      role={resolvedRole}
      style={rootStyle}
    >
      <svg
        aria-hidden="true"
        height={safeSize}
        style={{
          inset: 0,
          overflow: "visible",
          position: "absolute",
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
        }}
        viewBox={`0 0 ${safeSize} ${safeSize}`}
        width={safeSize}
      >
        <circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={trackColor}
          strokeWidth={safeStroke}
        />
        <circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          strokeWidth={safeStroke}
          style={{ transition: "stroke-dashoffset 500ms cubic-bezier(.2,.8,.2,1)" }}
        />
        {targetProgress !== null ? (
          <circle
            cx={markerX}
            cy={markerY}
            fill={markerColor}
            r={Math.max(2.5, safeStroke * 0.31)}
            stroke="white"
            strokeWidth={Math.max(1.5, safeStroke * 0.18)}
          />
        ) : null}
      </svg>

      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          fontFamily: '"Manrope", "Segoe UI", sans-serif',
          lineHeight: 1,
          maxWidth: safeSize - safeStroke * 2.4,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {showValue ? (
          <span
            style={{
              color: valueColor,
              fontSize: Math.max(14, safeSize * 0.205),
              fontVariantNumeric: "tabular-nums",
              fontWeight: 800,
              letterSpacing: "-0.045em",
            }}
          >
            {visibleValue}
          </span>
        ) : null}
        <span
          style={{
            color: labelColor,
            fontSize: Math.max(8, safeSize * 0.09),
            fontWeight: 700,
            letterSpacing: "0.04em",
            marginTop: showValue ? Math.max(4, safeSize * 0.045) : 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          {label}
        </span>
      </span>
    </div>
  );
}
