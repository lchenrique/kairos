import { NextResponse } from 'next/server'

// Temporary mock data for development
const MOCK_USER = {
  id: '1',
  name: 'Admin',
  email: 'admin@example.com',
  role: 'admin' as const,
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // In production, validate credentials against your database
      return NextResponse.json({
        user: MOCK_USER,
        token: 'mock-jwt-token',
      })


  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}