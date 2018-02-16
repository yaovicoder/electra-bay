export default function(text: string): string {
  return text
    .toLocaleLowerCase()
    .replace(/[\W_]+/g, '-')
    .replace(/^-|-$/g, '')
}
