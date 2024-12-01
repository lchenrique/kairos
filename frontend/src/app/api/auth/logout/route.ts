import { NextResponse } from 'next/server'

export async function POST() {
  // In production, handle token invalidation here
  return NextResponse.json({ success: true })
}