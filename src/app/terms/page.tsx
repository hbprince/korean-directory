import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 (Terms of Service)',
  description: '한인맵 이용약관입니다. HaninMap Terms of Service.',
  robots: 'noindex,follow',
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">이용약관 (Terms of Service)</h1>
      <p className="text-sm text-gray-500 mb-8">최종 수정일: 2026년 2월 13일</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">1. 서비스 개요 (Service Overview)</h2>
          <p>한인맵(HaninMap)은 미국, 캐나다, 호주의 한인 업소 정보를 제공하는 디렉토리 서비스입니다. 본 서비스를 이용함으로써 아래의 이용약관에 동의하는 것으로 간주됩니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">2. 정보의 정확성 (Accuracy of Information)</h2>
          <p>한인맵은 업체 정보의 정확성을 위해 노력하지만, 모든 정보의 정확성을 보증하지 않습니다. 업체 정보(영업시간, 연락처, 주소 등)는 변경될 수 있으며, 방문 전 업체에 직접 확인하시기 바랍니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">3. 사용자 콘텐츠 (User Content)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>리뷰 및 평가는 사용자 개인의 의견이며, 한인맵의 공식 입장이 아닙니다</li>
            <li>허위, 비방, 혐오 발언을 포함한 콘텐츠는 사전 통보 없이 삭제될 수 있습니다</li>
            <li>작성된 리뷰의 저작권은 작성자에게 있으나, 한인맵은 서비스 내 표시 권한을 가집니다</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">4. 업체 정보 관리 (Business Information)</h2>
          <p>업체 소유자는 자신의 업체 정보 수정 또는 삭제를 요청할 수 있습니다. 요청은 확인 절차를 거쳐 처리됩니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">5. 면책조항 (Disclaimer)</h2>
          <p>한인맵은 업체와 사용자 간의 거래, 서비스 이용에 대한 책임을 지지 않습니다. 한인맵은 정보 제공 목적의 플랫폼이며, 업체의 서비스 품질을 보증하지 않습니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">6. 약관 변경 (Changes to Terms)</h2>
          <p>본 약관은 사전 통보 없이 변경될 수 있으며, 변경된 약관은 사이트에 게시된 시점부터 효력이 발생합니다.</p>
        </section>
      </div>
    </main>
  );
}
