export function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
