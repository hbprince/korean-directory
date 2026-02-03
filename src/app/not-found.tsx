import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        페이지를 찾을 수 없습니다 (Page Not Found)
      </h1>
      <p className="text-gray-600 mb-8">
        요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        홈으로 (Go Home)
      </Link>
    </main>
  );
}
