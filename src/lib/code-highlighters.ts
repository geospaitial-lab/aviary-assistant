export type Language = "yaml" | "cli" | string

export function highlightCode(code: string, language: Language): string {
  if (language === "yaml") {
    return highlightYaml(code)
  }

  return code
}

export function highlightYaml(code: string): string {
  return code.split("\n").map(highlightYamlLine).join("\n")
}

function highlightYamlLine(line: string): string {
  if (line.trim().startsWith("#")) {
    return `<span class="text-yaml-comment font-bold">${line}</span>`
  }

  const commentIndex = findCommentStart(line)
  const mainContent =
    commentIndex !== -1 ? line.substring(0, commentIndex) : line
  const comment = commentIndex !== -1 ? line.substring(commentIndex) : ""

  const processedContent = highlightKeys(mainContent)

  return comment
    ? `${processedContent}<span class="text-yaml-comment font-bold">${comment}</span>`
    : processedContent
}

function findCommentStart(line: string): number {
  let inSingleQuote = false
  let inDoubleQuote = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const prevChar = i > 0 ? line[i - 1] : ""

    if (char === "'" && prevChar !== "\\") {
      inSingleQuote = !inSingleQuote
    } else if (char === '"' && prevChar !== "\\") {
      inDoubleQuote = !inDoubleQuote
    }

    if (char === "#" && !inSingleQuote && !inDoubleQuote) {
      return i
    }
  }

  return -1
}

function highlightKeys(content: string): string {
  const listKeyValueMatch = content.match(/^(\s*-\s*)([^:\s]+)(\s*:\s*)(.*)$/)
  if (listKeyValueMatch) {
    const [, indent, key, separator, value] = listKeyValueMatch
    return `${indent}<span class="text-yaml-key font-bold">${key}</span>${separator}${value}`
  }

  const keyValueMatch = content.match(/^(\s*)([^:\s]+)(\s*:\s*)(.*)$/)
  if (keyValueMatch) {
    const [, indent, key, separator, value] = keyValueMatch
    return `${indent}<span class="text-yaml-key font-bold">${key}</span>${separator}${value}`
  }

  return content
}
