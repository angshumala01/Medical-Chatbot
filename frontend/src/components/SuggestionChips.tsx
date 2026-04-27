interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (text: string) => void
  disabled: boolean
}

export default function SuggestionChips({ suggestions, onSelect, disabled }: SuggestionChipsProps) {
  return (
    <div className="border-t border-slate-100 px-5 py-3">
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Suggested questions
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            disabled={disabled}
            className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-700 transition-all hover:border-blue-400 hover:bg-blue-100 hover:shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
