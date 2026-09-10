type TokenGetter = () => Promise<string | null>

let tokenGetter: TokenGetter | null = null

export function registerClerkTokenGetter(getToken: TokenGetter) {
  tokenGetter = getToken
}

export function clearClerkTokenGetter(getToken?: TokenGetter) {
  if (!getToken || tokenGetter === getToken) tokenGetter = null
}

export async function getClerkAccessToken() {
  return tokenGetter ? tokenGetter() : null
}
