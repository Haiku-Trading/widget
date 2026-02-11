export const getInitials = (name: string) => {
  const trimmed = name.trim()

  if (trimmed === '') {
    return '??'
  }

  const graphemes = Array.from(trimmed)
  if (graphemes.length === 1) {
    return graphemes[0].toUpperCase()
  }

  if (!/\s/.test(trimmed)) {
    return graphemes.join('').substring(0, 2).toUpperCase()
  }

  const parts = trimmed.split(/\s+/).filter(Boolean)

  if (parts.length === 1) {
    const wordGraphemes = Array.from(parts[0])

    if (wordGraphemes.length >= 2) {
      return wordGraphemes.join('').substring(0, 2).toUpperCase()
    }

    return wordGraphemes[0].concat(wordGraphemes[0]).toUpperCase()
  }

  const firstInitial = Array.from(parts[0])[0]?.toUpperCase() ?? ''
  const lastInitial = Array.from(parts[parts.length - 1])[0]?.toUpperCase() ?? ''

  return firstInitial + lastInitial
}
