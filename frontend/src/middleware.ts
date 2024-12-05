import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas públicas que não precisam de autenticação
const publicPaths = ['/login', '/setup']
const ignoredPaths = ['/api', '/_next', '/favicon.ico']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Ignora rotas de sistema
  if (ignoredPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Se for rota pública, permite acesso
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Se estiver na raiz, redireciona para o dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Verifica se existe token
  const token = request.cookies.get('token')?.value

  // Se não tiver token, redireciona para login
  if (!token) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }

  return NextResponse.next()
}

// Configura o matcher para pegar todas as rotas exceto as ignoradas
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
