export function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  color,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  color: string
  onChange: (value: number) => void
}) {
  const progress = ((value - min) / (max - min)) * 100
  return (
    <label className="range-control">
      <span><b>{label}</b><strong>{value}{unit}</strong></span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ '--range-progress': `${progress}%`, '--range-color': color } as React.CSSProperties}
      />
      <small><span>{min}{unit}</span><span>{max}{unit}</span></small>
    </label>
  )
}
