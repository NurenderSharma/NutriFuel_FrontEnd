export function MacroStat({ value, label, emphasis = false }: { value: string; label: string; emphasis?: boolean }) {
  return <div className={emphasis ? 'macro-stat emphasis' : 'macro-stat'}><b>{value}</b><span>{label}</span></div>
}
