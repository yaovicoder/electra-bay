export default function(username: string): string {
  return username
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/^-|-$/g, '')
}
