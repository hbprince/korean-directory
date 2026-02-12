'use client';

import { useState, useEffect, useCallback } from 'react';

interface VoteData {
  upCount: number;
  downCount: number;
  userVote: 'up' | 'down' | null;
}

export function BusinessVote({ businessId }: { businessId: string }) {
  const [data, setData] = useState<VoteData>({ upCount: 0, downCount: 0, userVote: null });
  const [loading, setLoading] = useState(false);

  const fetchVotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/vote?businessId=${encodeURIComponent(businessId)}`);
      if (res.ok) {
        const json = await res.json();
        setData({
          upCount: json.upCount,
          downCount: json.downCount,
          userVote: json.userVote,
        });
      }
    } catch (err) {
      console.error('Failed to fetch votes', err);
    }
  }, [businessId]);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (loading) return;
    setLoading(true);

    // Optimistic update
    const prev = { ...data };
    setData((d) => {
      const newData = { ...d };
      if (d.userVote === voteType) {
        // Already voted same type - no change (API returns already_voted)
        return d;
      }
      if (d.userVote) {
        // Switching vote
        if (d.userVote === 'up') newData.upCount--;
        else newData.downCount--;
      }
      if (voteType === 'up') newData.upCount++;
      else newData.downCount++;
      newData.userVote = voteType;
      return newData;
    });

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, voteType }),
      });
      if (res.ok) {
        const json = await res.json();
        setData({
          upCount: json.upCount,
          downCount: json.downCount,
          userVote: json.already_voted ? json.current_vote : voteType,
        });
      } else {
        setData(prev); // Rollback
      }
    } catch {
      setData(prev); // Rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-1">
      <button
        onClick={() => handleVote('up')}
        disabled={loading}
        className={`inline-flex items-center gap-1 px-2.5 py-1 text-sm rounded-md border transition-colors ${
          data.userVote === 'up'
            ? 'bg-blue-50 border-blue-300 text-blue-700'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
        aria-label="추천"
      >
        <span>👍</span>
        <span className="font-medium">{data.upCount}</span>
      </button>
      <button
        onClick={() => handleVote('down')}
        disabled={loading}
        className={`inline-flex items-center gap-1 px-2.5 py-1 text-sm rounded-md border transition-colors ${
          data.userVote === 'down'
            ? 'bg-red-50 border-red-300 text-red-700'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
        aria-label="비추천"
      >
        <span>👎</span>
        <span className="font-medium">{data.downCount}</span>
      </button>
    </div>
  );
}
