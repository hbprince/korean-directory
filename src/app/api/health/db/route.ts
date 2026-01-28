/**
 * Database health check endpoint
 * GET /api/health/db
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  const startTime = Date.now();

  // Log masked DATABASE_URL
  const dbUrl = process.env.DATABASE_URL || '';
  let maskedUrl = 'NOT SET';

  if (dbUrl) {
    try {
      const url = new URL(dbUrl);
      maskedUrl = `${url.protocol}//${url.username}:***@${url.host}${url.pathname}`;
    } catch {
      maskedUrl = 'INVALID URL FORMAT';
    }
  }

  console.log(`[db-health] DATABASE_URL: ${maskedUrl}`);

  try {
    // Run simple query
    const result = await prisma.$queryRaw<[{ result: number }]>`SELECT 1 as result`;

    const duration = Date.now() - startTime;

    if (result[0]?.result === 1) {
      console.log(`[db-health] Connection OK (${duration}ms)`);
      return NextResponse.json({
        ok: true,
        duration_ms: duration,
        database_host: maskedUrl,
        timestamp: new Date().toISOString(),
      });
    } else {
      throw new Error('Unexpected query result');
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error(`[db-health] Connection FAILED (${duration}ms):`, errorMessage);

    return NextResponse.json({
      ok: false,
      error: errorMessage,
      duration_ms: duration,
      database_host: maskedUrl,
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}
