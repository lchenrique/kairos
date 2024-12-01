export function setAuthCookie(token: string) {
  document.cookie = `token=${token}; path=/; max-age=2592000; SameSite=Lax` // 30 dias
}

export function removeAuthCookie() {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}
