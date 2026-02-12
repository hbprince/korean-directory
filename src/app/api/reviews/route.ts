import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

// Allowed tags by category
const ALLOWED_TAGS: Record<string, string[]> = {
  common: ['한국어가능', '친절', '가격적당', '전문적', '주차편리', '청결'],
  food: ['맛있음', '양많음', '분위기좋음', '웨이팅있음'],
  medical: ['설명잘해줌', '대기짧음', '보험처리잘됨'],
  legal: ['꼼꼼함', '응답빠름', '합리적수임료'],
};

const ALL_ALLOWED_TAGS = Object.values(ALLOWED_TAGS).flat();

/** Strip HTML tags to prevent XSS */
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 });
    }

    const body = await req.json();
    const { businessId, rating, content, tags } = body;

    // Validate businessId
    if (!businessId || typeof businessId !== 'string') {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }

    // Validate rating: integer 1-5
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '별점은 1~5 사이 정수여야 합니다' },
        { status: 400 }
      );
    }

    // Validate content: strip HTML, check length
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: '리뷰 내용을 입력해주세요' }, { status: 400 });
    }
    const cleanContent = stripHtml(content).trim();
    if (cleanContent.length < 1 || cleanContent.length > 200) {
      return NextResponse.json(
        { error: '리뷰는 1~200자 이내로 작성해주세요' },
        { status: 400 }
      );
    }

    // Validate tags
    const validTags: string[] = [];
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (typeof tag === 'string' && ALL_ALLOWED_TAGS.includes(tag)) {
          validTags.push(tag);
        }
      }
    }

    // Check unique constraint (businessId, userId)
    const existing = await prisma.review.findUnique({
      where: {
        businessId_userId: { businessId, userId: session.user.id },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: '이미 리뷰를 작성했습니다. 업체당 1개의 리뷰만 가능합니다.' },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        businessId,
        userId: session.user.id,
        rating,
        content: cleanContent,
        tags: validTags,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error('[Reviews POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId query parameter is required' },
        { status: 400 }
      );
    }

    const [reviews, totalCount, ratingAgg] = await Promise.all([
      prisma.review.findMany({
        where: { businessId, status: 'active' },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { businessId, status: 'active' },
      }),
      prisma.review.aggregate({
        where: { businessId, status: 'active' },
        _avg: { rating: true },
      }),
    ]);

    // Compute tag frequency from all active reviews for this business
    const allReviews = await prisma.review.findMany({
      where: { businessId, status: 'active' },
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    for (const r of allReviews) {
      const reviewTags = r.tags as string[];
      if (Array.isArray(reviewTags)) {
        for (const tag of reviewTags) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      }
    }

    return NextResponse.json({
      reviews,
      stats: {
        avgRating: ratingAgg._avg.rating ? Math.round(ratingAgg._avg.rating * 10) / 10 : 0,
        totalCount,
        tags: tagCounts,
      },
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('[Reviews GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
