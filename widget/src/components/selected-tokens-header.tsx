type SelectedTokensHeaderProps = {
  label: string
  isExpanded: boolean
  onToggle: () => void
}

export function SelectedTokensHeader({ label, isExpanded, onToggle }: SelectedTokensHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-16px-normal">{label}</p>
      {/* <button
        className="text-grey-primary font-medium text-sm flex items-center gap-3"
        onClick={onToggle}
      >
        {isExpanded ? 'Hide' : 'Show'}
        {isExpanded ? <RiFullscreenExitLine size={16} /> : <RiFullscreenLine size={16} />}
      </button> */}
    </div>
  )
}
