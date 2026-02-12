'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { AuthButton } from './AuthButton';

// --- Tag definitions ---
const TAG_GROUPS: Record<string, string[]> = {
  공통: ['한국어가능', '친절', '가격적당', '전문적', '주차편리', '청결'],
  음식: ['맛있음', '양많음', '분위기좋음', '웨이팅있음'],
  의료: ['설명잘해줌', '대기짧음', '보험처리잘됨'],
  법률: ['꼼꼼함', '응답빠름', '합리적수임료'],
};

const ALL_TAGS = Object.values(TAG_GROUPS).flat();

// --- Relative time formatting ---
function relativeTime(dateStr: string): string {
  const now = Date.now();
  const past = new Date(dateStr).getTime();
  const diff = now - past;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}주 전`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;

  const years = Math.floor(days / 365);
  return `${years}년 전`;
}

// --- Star display ---
function Stars({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const textSize = size === 'sm' ? 'text-sm' : 'text-lg';
  return (
    <span className={`${textSize} tracking-wide`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </span>
  );
}

// --- Star select for form ---
function StarSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className={`text-2xl transition-colors ${
            i <= (hover || value) ? 'text-yellow-500' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// --- Types ---
interface ReviewUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface ReviewItem {
  id: number;
  businessId: string;
  userId: string;
  rating: number;
  content: string;
  tags: string[];
  helpfulCount: number;
  createdAt: string;
  user: ReviewUser;
}

interface ReviewStats {
  avgRating: number;
  totalCount: number;
  tags: Record<string, number>;
}

interface ReviewSectionProps {
  businessId: string;
}

export function ReviewSection({ businessId }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ avgRating: 0, totalCount: 0, tags: {} });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [hasUserReview, setHasUserReview] = useState(false);

  const fetchReviews = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?businessId=${encodeURIComponent(businessId)}&page=${p}&limit=10`);
      if (res.ok) {
        const json = await res.json();
        setReviews(json.reviews);
        setStats(json.stats);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchReviews(page);
  }, [fetchReviews, page]);

  // Check if current user already wrote a review
  useEffect(() => {
    if (session?.user?.id && reviews.length > 0) {
      setHasUserReview(reviews.some((r) => r.userId === session.user!.id));
    }
  }, [session, reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (formRating === 0) {
      setFormError('별점을 선택해주세요');
      return;
    }
    if (formContent.trim().length === 0) {
      setFormError('리뷰 내용을 입력해주세요');
      return;
    }
    if (formContent.trim().length > 200) {
      setFormError('리뷰는 200자 이내로 작성해주세요');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          rating: formRating,
          content: formContent.trim(),
          tags: formTags,
        }),
      });

      if (res.ok) {
        // Reset form and refresh
        setFormRating(0);
        setFormContent('');
        setFormTags([]);
        setShowForm(false);
        setPage(1);
        fetchReviews(1);
      } else {
        const json = await res.json();
        setFormError(json.error || '리뷰 등록에 실패했습니다');
      }
    } catch {
      setFormError('네트워크 오류가 발생했습니다');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchReviews(page);
      } else {
        const json = await res.json();
        alert(json.error || '삭제에 실패했습니다');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다');
    }
  };

  const toggleTag = (tag: string) => {
    setFormTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Top tags sorted by frequency
  const sortedTags = Object.entries(stats.tags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <section className="mt-8 border-t border-gray-200 pt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        한줄 리뷰
      </h2>

      {/* Stats bar */}
      {stats.totalCount > 0 ? (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(stats.avgRating)} />
            <span className="text-lg font-semibold text-gray-900">{stats.avgRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({stats.totalCount}개)</span>
          </div>

          {sortedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {sortedTags.map(([tag, count]) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                  <span className="text-gray-400">{count}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-6">
          첫 번째 리뷰를 남겨주세요!
        </p>
      )}

      {/* Write review button / form */}
      {session?.user ? (
        !hasUserReview && (
          <>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="mb-6 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                리뷰 작성하기
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                {/* Star select */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">별점</label>
                  <StarSelect value={formRating} onChange={setFormRating} />
                </div>

                {/* Tag pills */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">태그 (선택)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                          formTags.includes(tag)
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">리뷰</label>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    maxLength={200}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="200자 이내로 작성해주세요"
                  />
                  <p className="text-xs text-gray-400 text-right mt-0.5">
                    {formContent.length}/200
                  </p>
                </div>

                {formError && (
                  <p className="text-sm text-red-600 mb-3">{formError}</p>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? '등록 중...' : '리뷰 등록'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormError('');
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            )}
          </>
        )
      ) : (
        <div className="mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600">로그인하고 리뷰 남기기</span>
            <AuthButton />
          </div>
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {review.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.user.image}
                      alt={review.user.name || '사용자'}
                      className="w-7 h-7 rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      {(review.user.name || '?')[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {review.user.name || '익명'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {relativeTime(review.createdAt)}
                  </span>
                </div>

                {session?.user?.id === review.userId && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    삭제
                  </button>
                )}
              </div>

              <div className="mt-1">
                <Stars rating={review.rating} size="sm" />
              </div>

              <p className="text-sm text-gray-700 mt-2">{review.content}</p>

              {Array.isArray(review.tags) && review.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {review.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {review.helpfulCount > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  도움이 됐어요 {review.helpfulCount}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            이전
          </button>
          <span className="text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
}
