import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

const VALID_EVENT_TYPES = ['view', 'phone_click', 'website_click', 'guide_click'] as const;
type EventType = (typeof VALID_EVENT_TYPES)[number];

// ─── In-memory rate limiter: IP -> { count, resetAt } ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per minute per IP

// Periodic cleanup to prevent memory leak (every 5 minutes)
let lastCleanup = Date.now();
function cleanupRateLimitMap() {
  const now = Date.now();
  if (now - lastCleanup < 300_000) return;
  lastCleanup = now;
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  });
}

function isRateLimited(ip: string): boolean {
  cleanupRateLimitMap();

  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const { businessId, eventType } = body;

    if (!businessId || typeof businessId !== 'string' || businessId.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid businessId' },
        { status: 400 }
      );
    }

    if (!VALID_EVENT_TYPES.includes(eventType as EventType)) {
      return NextResponse.json(
        { error: 'Invalid eventType' },
        { status: 400 }
      );
    }

    // Insert engagement record
    await prisma.businessEngagement.create({
      data: {
        businessId: businessId.trim(),
        eventType,
        sessionId: body.sessionId ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[track] Error recording engagement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
