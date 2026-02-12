import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db/prisma';

function generateFingerprint(req: NextRequest): string {
  const ua = req.headers.get('user-agent') || '';
  const lang = req.headers.get('accept-language') || '';
  const enc = req.headers.get('accept-encoding') || '';
  return crypto.createHash('sha256').update(`${ua}${lang}${enc}`).digest('hex');
}

function hashIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, voteType } = body;

    if (!businessId || !voteType || !['up', 'down'].includes(voteType)) {
      return NextResponse.json(
        { error: 'businessId and voteType ("up" or "down") are required' },
        { status: 400 }
      );
    }

    const fingerprint = generateFingerprint(req);
    const ipHash = hashIP(req);

    // Check if user already voted on this business
    const existing = await prisma.businessVote.findUnique({
      where: {
        businessId_fingerprint: { businessId, fingerprint },
      },
    });

    if (existing) {
      // Already voted same type
      if (existing.voteType === voteType) {
        const [upCount, downCount] = await Promise.all([
          prisma.businessVote.count({ where: { businessId, voteType: 'up' } }),
          prisma.businessVote.count({ where: { businessId, voteType: 'down' } }),
        ]);
        return NextResponse.json({
          already_voted: true,
          current_vote: existing.voteType,
          upCount,
          downCount,
        });
      }

      // Different type: update
      await prisma.businessVote.update({
        where: { id: existing.id },
        data: { voteType },
      });
    } else {
      // New vote
      await prisma.businessVote.create({
        data: { businessId, voteType, fingerprint, ipHash },
      });
    }

    const [upCount, downCount] = await Promise.all([
      prisma.businessVote.count({ where: { businessId, voteType: 'up' } }),
      prisma.businessVote.count({ where: { businessId, voteType: 'down' } }),
    ]);

    return NextResponse.json({ success: true, upCount, downCount });
  } catch (error) {
    console.error('[Vote POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId query parameter is required' },
        { status: 400 }
      );
    }

    const fingerprint = generateFingerprint(req);

    const [upCount, downCount, userVoteRecord] = await Promise.all([
      prisma.businessVote.count({ where: { businessId, voteType: 'up' } }),
      prisma.businessVote.count({ where: { businessId, voteType: 'down' } }),
      prisma.businessVote.findUnique({
        where: {
          businessId_fingerprint: { businessId, fingerprint },
        },
        select: { voteType: true },
      }),
    ]);

    return NextResponse.json({
      upCount,
      downCount,
      userVote: userVoteRecord?.voteType ?? null,
    });
  } catch (error) {
    console.error('[Vote GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
