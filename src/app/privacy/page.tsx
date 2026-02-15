import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 (Privacy Policy)',
  description: '한인맵의 개인정보처리방침입니다. HaninMap Privacy Policy.',
  robots: 'noindex,follow',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보처리방침 (Privacy Policy)</h1>
      <p className="text-sm text-gray-500 mb-8">최종 수정일: 2026년 2월 13일</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">1. 수집하는 정보 (Information We Collect)</h2>
          <p>한인맵은 서비스 제공을 위해 최소한의 정보만 수집합니다.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Google Analytics를 통한 익명 사용 통계 (페이지 조회, 방문 기간)</li>
            <li>업체 리뷰 작성 시 제공하는 닉네임 및 리뷰 내용</li>
            <li>업체 투표 시 익명 투표 기록</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">2. 정보의 사용 목적 (How We Use Information)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>서비스 품질 개선 및 사용자 경험 향상</li>
            <li>업체 정보의 정확성 유지</li>
            <li>커뮤니티 리뷰 및 평가 기능 운영</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">3. 정보의 공유 (Information Sharing)</h2>
          <p>한인맵은 수집된 개인정보를 제3자에게 판매하거나 공유하지 않습니다. 단, 법적 요구가 있는 경우 관련 법률에 따라 정보를 제공할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">4. 쿠키 (Cookies)</h2>
          <p>본 사이트는 Google Analytics 쿠키를 사용하여 웹사이트 트래픽을 분석합니다. 브라우저 설정을 통해 쿠키를 거부할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">5. 데이터 출처 (Data Sources)</h2>
          <p>업체 정보는 공개적으로 이용 가능한 출처(Google Places API 등)에서 수집되며, 업체 소유자의 요청에 따라 수정 또는 삭제할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">6. 문의 (Contact)</h2>
          <p>개인정보처리방침에 대한 문의사항은 사이트 관리자에게 연락해 주세요.</p>
        </section>
      </div>
    </main>
  );
}
