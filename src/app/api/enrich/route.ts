import { NextRequest, NextResponse } from 'next/server';
import { enqueueForEnrichment } from '@/lib/enrichment/queue';

/**
 * POST /api/enrich
 * Enqueue a business for Google Places enrichment
 * Called when user clicks "Show details" or similar action
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, reason = 'user_click' } = body;

    if (!businessId || typeof businessId !== 'number') {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      );
    }

    const validReasons = ['seed', 'traffic', 'user_click'];
    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { error: 'Invalid reason' },
        { status: 400 }
      );
    }

    const enqueued = await enqueueForEnrichment(businessId, reason, reason === 'user_click' ? 50 : 0);

    return NextResponse.json({
      success: true,
      enqueued,
    });
  } catch (error) {
    console.error('Enrich API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
