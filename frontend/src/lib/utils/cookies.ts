export function setAuthCookie(token: string) {
  console.log('Setando cookie de autenticação')
  document.cookie = `token=${token}; path=/; max-age=2592000; SameSite=Strict` // 30 dias
}

export function removeAuthCookie() {
  console.log('Removendo cookie de autenticação')
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
}

export function getAuthCookie(): string | null {
  try {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1] || null
  } catch {
    return null
  }
}
