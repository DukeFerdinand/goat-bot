export const removeCommand = (
  content: string,
  returnArray = false,
): string | string[] => {
  const split = content.split(/!.*?(\ |$)/)
  if (returnArray) {
    return split.filter((item) => item !== '' && item !== ' ')
  } else {
    return split.join('').trim()
  }
}
