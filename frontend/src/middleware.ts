import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas públicas que não precisam de autenticação
const publicPaths = ['/login', '/setup']
const ignoredPaths = ['/api', '/_next', '/favicon.ico']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('Middleware executando em:', pathname)

  // Ignora rotas de sistema
  if (ignoredPaths.some(path => pathname.startsWith(path))) {
    console.log('Rota ignorada:', pathname)
    return NextResponse.next()
  }

  // Se for rota pública, permite acesso
  if (publicPaths.some(path => pathname.startsWith(path))) {
    console.log('Rota pública:', pathname)
    return NextResponse.next()
  }

  // Se estiver na raiz, redireciona para o dashboard
  if (pathname === '/') {
    console.log('Redirecionando raiz para dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Verifica se existe token
  const token = request.cookies.get('token')?.value
  console.log('Token encontrado:', !!token)

  // Se não tiver token, redireciona para login
  if (!token) {
    console.log('Sem token, redirecionando para login')
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }

  console.log('Acesso permitido:', pathname)
  return NextResponse.next()
}

// Configura o matcher para pegar todas as rotas exceto as ignoradas
export const config = {
  matcher: [
    /*
     * Pega todas as rotas exceto as que começam com:
     * - api (rotas de API)
     * - _next (arquivos do Next.js)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/(dashboard|members|groups|settings)/:path*'
  ],
}
