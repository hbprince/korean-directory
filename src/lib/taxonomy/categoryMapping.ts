// Mapping from RadioKorea and KoreaDaily category codes to our taxonomy
// Updated for RadioKorea v2 crawl (2024)

// RadioKorea category code to our primary/subcategory mapping
export const RADIOKOREA_MAPPING: Record<string, { primary: string; sub?: string }> = {
  // Medical - 병원
  'B08': { primary: 'medical', sub: 'internal-medicine' }, // 가정주치의
  'B09': { primary: 'medical' }, // 간호서비스/양로병원
  'B10': { primary: 'medical', sub: 'ophthalmology' }, // 검안의
  'B11': { primary: 'medical', sub: 'internal-medicine' }, // 내과/위장내과/심장내과/류마티즘내과
  'B12': { primary: 'medical', sub: 'rehabilitation' }, // 물리치료
  'B13': { primary: 'medical', sub: 'podiatry' }, // 발전문의
  'B14': { primary: 'medical', sub: 'diagnostics' }, // 방사선과/초음파/CT촬영
  'B15': { primary: 'medical' }, // 보청기
  'B16': { primary: 'medical', sub: 'urology' }, // 비뇨기과
  'B17': { primary: 'medical', sub: 'obgyn' }, // 산부인과/여성병원/산후조리원
  'B18': { primary: 'medical', sub: 'plastic-surgery' }, // 성형외과
  'B19': { primary: 'medical', sub: 'pediatrics' }, // 소아과
  'B20': { primary: 'medical', sub: 'psychiatry' }, // 신경내과/정신과
  'B21': { primary: 'medical', sub: 'ophthalmology' }, // 안과
  'B22': { primary: 'medical', sub: 'allergy' }, // 알러지과
  'B23': { primary: 'medical', sub: 'oncology' }, // 암전문
  'B24': { primary: 'medical', sub: 'general-surgery' }, // 외과
  'B25': { primary: 'medical' }, // 의료기구
  'B26': { primary: 'medical', sub: 'ent' }, // 이비인후과
  'B27': { primary: 'medical' }, // 임상심리과
  'B28': { primary: 'medical', sub: 'pain-management' }, // 재활의학과/통증치료
  'B29': { primary: 'medical', sub: 'orthopedics' }, // 정형외과
  'B30': { primary: 'medical' }, // 종합병원
  'B31': { primary: 'medical', sub: 'pain-management' }, // 척추신경과
  'B32': { primary: 'medical', sub: 'dermatology' }, // 피부과
  'B33': { primary: 'medical', sub: 'pulmonology' }, // 호흡기과
  'H09': { primary: 'medical', sub: 'korean-medicine' }, // 한의원/건재상
  'A07': { primary: 'medical', sub: 'pharmacy' }, // 약국

  // Dental - 치과
  'B34': { primary: 'dental' }, // 일반치과
  'B35': { primary: 'dental', sub: 'orthodontist' }, // 교정치과
  'B36': { primary: 'dental', sub: 'prosthodontist' }, // 보철치과
  'B37': { primary: 'dental', sub: 'pediatric-dentist' }, // 소아치과
  'B38': { primary: 'dental', sub: 'dental-implants' }, // 치아이식
  'B39': { primary: 'dental', sub: 'periodontist' }, // 치주치과
  'B40': { primary: 'dental', sub: 'dental-lab' }, // 치과기공소

  // Legal - 법률
  'B07': { primary: 'legal' }, // 변호사
  'D02': { primary: 'legal', sub: 'notary' }, // 대서/공증/번역/통역/이민상담/유학원

  // Insurance - 보험
  'B41': { primary: 'insurance' }, // 보험

  // Real Estate - 부동산
  'B04': { primary: 'real-estate' }, // 부동산(매매/감정/인스펙션)
  'A14': { primary: 'real-estate', sub: 'escrow' }, // 에스크로

  // Financial - 금융
  'K11': { primary: 'financial', sub: 'tax-preparer' }, // 공인세무사/회계사무소/북키핑
  'K12': { primary: 'financial', sub: 'cpa' }, // 공인회계사
  'A25': { primary: 'financial', sub: 'mortgage-broker' }, // 융자/대출/증권/뮤츄얼펀드
  'A26': { primary: 'financial', sub: 'bank' }, // 은행/송금서비스

  // Food & Dining - 음식
  'S12': { primary: 'food', sub: 'japanese-restaurant' }, // 식당(일식)
  'S13': { primary: 'food', sub: 'chinese-restaurant' }, // 식당(중식)
  'S14': { primary: 'food', sub: 'western-restaurant' }, // 식당(양식/카페/커피샵)
  'S15': { primary: 'food', sub: 'korean-restaurant' }, // 식당(한식/부페/캐더링/분식)
  'S21': { primary: 'food' }, // 식당(동남아식)
  'J19': { primary: 'food', sub: 'bakery' }, // 제과점/베이커리
  'D05': { primary: 'food', sub: 'bakery' }, // 떡집/방앗간
  'M01': { primary: 'food', sub: 'grocery' }, // 마켓/식품점
  'S18': { primary: 'food', sub: 'grocery' }, // 식품도매
  'N01': { primary: 'food' }, // 나이트클럽/캬바레/룸싸롱
  'N03': { primary: 'food' }, // 노래방/가라오케

  // Beauty - 뷰티
  'M06': { primary: 'beauty', sub: 'hair-salon' }, // 미용실/메이크업
  'A29': { primary: 'beauty', sub: 'barbershop' }, // 이발관
  'S11': { primary: 'beauty', sub: 'skin-care' }, // 스킨케어/피부미용/영구화장
  'S03': { primary: 'beauty', sub: 'spa' }, // 사우나/스파/헬스/지압/스포츠센터
  'H08': { primary: 'beauty', sub: 'cosmetics' }, // 화장품
  'K03': { primary: 'beauty' }, // 가발/모발관리
  'M07': { primary: 'beauty' }, // 미용재료상

  // Auto Services - 자동차
  'J01': { primary: 'auto', sub: 'car-rental' }, // 자동차(렌터카)
  'J02': { primary: 'auto', sub: 'car-dealer' }, // 자동차(매매/리스)
  'J03': { primary: 'auto', sub: 'auto-repair' }, // 자동차(바디/페인트/수리정비)
  'J04': { primary: 'auto', sub: 'car-wash' }, // 자동차(세차장)
  'J05': { primary: 'auto' }, // 자동차(스테레오/실내장식/알람/틴트)
  'J06': { primary: 'auto' }, // 자동차(유리)
  'J07': { primary: 'auto', sub: 'tires' }, // 자동차(타이어)
  'J08': { primary: 'auto', sub: 'towing' }, // 자동차(토잉서비스)
  'J09': { primary: 'auto' }, // 자동차(폐차장)
  'T02': { primary: 'auto' }, // 택시/리무진/버스

  // Home Services - 홈서비스
  'A16': { primary: 'home-services', sub: 'locksmith' }, // 열쇠/금고/락스미스 ★ KEY FIX
  'A33': { primary: 'home-services', sub: 'moving' }, // 운송/이삿짐/통관/창고
  'P05': { primary: 'home-services', sub: 'plumbing' }, // 플러밍/보일러
  'N02': { primary: 'home-services', sub: 'hvac' }, // 냉동/에어컨/보일러
  'L01': { primary: 'home-services', sub: 'roofing' }, // 루핑/지붕수리/루핑재료상
  'C06': { primary: 'home-services', sub: 'cleaning' }, // 청소/쓰레기수거
  'J14': { primary: 'home-services', sub: 'electrical' }, // 전기공사(시설,수리)
  'K02': { primary: 'home-services', sub: 'landscaping' }, // 가드닝서비스/정원공사/조경공사
  'K07': { primary: 'home-services', sub: 'construction' }, // 건축/설계/시공/실내장식/인테리어
  'P02': { primary: 'home-services', sub: 'painting' }, // 페인트/도배/페스트재료상
  'Q02': { primary: 'home-services', sub: 'carpet' }, // 카펫/카텐/블라인드/마루/타일
  'Q03': { primary: 'home-services', sub: 'cleaning' }, // 카펫크리닝
  'P01': { primary: 'home-services', sub: 'pest-control' }, // 페스트콘트롤/터마이트/소독
  'M04': { primary: 'home-services', sub: 'construction' }, // 목수/집수리/핸디맨/주방케비넷/욕조재생
  'C01': { primary: 'home-services' }, // 차고문
  'C04': { primary: 'home-services' }, // 철공소/용접
  'S09': { primary: 'home-services' }, // 수영장(공사/관리/청소)

  // Education - 교육
  'H01': { primary: 'education', sub: 'preschool' }, // 학교(어린이-정규/패밀리)
  'H02': { primary: 'education', sub: 'music-school' }, // 학교/학원(예능)
  'H03': { primary: 'education', sub: 'tutoring' }, // 학교/학원(일반)
  'H04': { primary: 'education' }, // 학교/학원(직업/취업)
  'A21': { primary: 'education', sub: 'driving-school' }, // 운전학교/교통위반자학교
  'C08': { primary: 'education', sub: 'martial-arts' }, // 체육관/태권도/단센터/검도
  'D03': { primary: 'education', sub: 'dance-school' }, // 댄스/사교장
  'D04': { primary: 'education', sub: 'martial-arts' }, // 도장/무술
  'A01': { primary: 'education', sub: 'music-school' }, // 악기점/피아노/조율

  // Travel - 여행
  'A15': { primary: 'travel', sub: 'travel-agency' }, // 여행사/관광 ★ KEY FIX
  'H06': { primary: 'travel', sub: 'airline' }, // 항공사
  'H07': { primary: 'travel', sub: 'hotel' }, // 호텔/모텔
  'A18': { primary: 'travel' }, // 온천장/핫스프링
  'A24': { primary: 'travel' }, // 유원지/놀이공원/동물원/스테디움

  // Professional Services - 전문서비스
  'A31': { primary: 'professional', sub: 'printing' }, // 인쇄소/달력/라벨/사진식자
  'S04': { primary: 'professional', sub: 'photography' }, // 사진(촬영/현상재료/비디오촬영)
  'K13': { primary: 'professional', sub: 'advertising' }, // 광고/디자인/기획/대행/판촉물/우편광고
  'K05': { primary: 'professional', sub: 'signage' }, // 간판/네온싸인
  'A22': { primary: 'professional', sub: 'wedding' }, // 웨딩센터/예식장/혼수용품
  'J11': { primary: 'professional', sub: 'funeral' }, // 장의사/묘지
  'A32': { primary: 'professional' }, // 인터넷/웹사이트제작(관리)
  'S02': { primary: 'professional' }, // 사설탐정/흥신소
  'K09': { primary: 'professional' }, // 결혼상담소

  // Shopping - 쇼핑
  'J16': { primary: 'shopping', sub: 'electronics' }, // 전자제품/가전제품(판매/수리)
  'Q04': { primary: 'shopping', sub: 'electronics' }, // 컴퓨터(판매/수리)/네트워크
  'K01': { primary: 'shopping', sub: 'furniture' }, // 가구점/어린이가구점/가구수리/만물상
  'A28': { primary: 'shopping', sub: 'clothing' }, // 의류도매/유니폼/자바의류
  'B03': { primary: 'shopping', sub: 'jewelry' }, // 보석상/시계/귀금속
  'A02': { primary: 'shopping', sub: 'optical' }, // 안경원/콘텍트렌즈
  'S06': { primary: 'shopping', sub: 'bookstore' }, // 서점/시청각교재
  'K15': { primary: 'shopping', sub: 'florist' }, // 꽃집/식물원
  'B01': { primary: 'shopping' }, // 백화점/생활용품/선물센터
  'K06': { primary: 'shopping' }, // 건강식약품/건강기구/자연식품
  'A12': { primary: 'shopping' }, // 어린이용품/장난감
  'S10': { primary: 'shopping' }, // 수입도매/무역/양말도매/잡화도매
  'A34': { primary: 'shopping' }, // 악세사리
  'H05': { primary: 'shopping' }, // 한복점/고전의상
  'K04': { primary: 'shopping' }, // 가방/핸드백
  'A11': { primary: 'shopping' }, // 양화점/구두/신발
  'A09': { primary: 'shopping' }, // 양복점(맞춤/기성복)
  'A10': { primary: 'shopping' }, // 양장점/여성맞춤

  // Community - 커뮤니티
  'G04': { primary: 'community', sub: 'church' }, // 종교단체(교회)
  'G05': { primary: 'community', sub: 'church' }, // 종교단체(선교회)
  'G06': { primary: 'community', sub: 'church' }, // 종교단체(신학교)
  'G07': { primary: 'community', sub: 'church' }, // 종교단체(기도원)
  'G08': { primary: 'community', sub: 'church' }, // 종교단체(천주교)
  'G10': { primary: 'community', sub: 'temple' }, // 종교단체(불교사원)
  'G11': { primary: 'community', sub: 'temple' }, // 종교단체(원불교)
  'G01': { primary: 'community', sub: 'organization' }, // 공공기관/도서관/단체
  'G02': { primary: 'community', sub: 'organization' }, // 봉사기관
  'G03': { primary: 'community', sub: 'organization' }, // 일반단체
  'G12': { primary: 'community', sub: 'organization' }, // 동창회(학교)
  'A08': { primary: 'community', sub: 'senior-center' }, // 양로센타/노인복지시설
  'A13': { primary: 'community', sub: 'media' }, // 언론기관(신문/TV/라디오/케이블TV/위성방송)

  // Other Services
  'A03': { primary: 'shopping' }, // 알람/도난방지시스템/감시-보안카메라
  'A04': { primary: 'community' }, // 애완동물/수족관/가축병원
  'A05': { primary: 'professional' }, // 액자/표구
  'A06': { primary: 'professional' }, // 앤서링서비스/전화교환
  'A17': { primary: 'community' }, // 오토바이/자전거(판매/수리)
  'A19': { primary: 'professional' }, // 우체국/사서함
  'A20': { primary: 'shopping' }, // 운동구점/골프용품/낚시/캠핑
  'A23': { primary: 'home-services' }, // 유리점/거울/틴트/창문시공
  'A27': { primary: 'shopping' }, // 음향시스템/오디오장비/CD/녹음/레코드
  'A30': { primary: 'shopping' }, // 이불/자수
  'B02': { primary: 'financial' }, // 보석금(베일본드)
  'B05': { primary: 'shopping' }, // 비디오(대여/수리)
  'B06': { primary: 'community' }, // 비디오게임/컴퓨터게임/게임방
  'C02': { primary: 'professional' }, // 천막/텐트
  'C03': { primary: 'shopping' }, // 철강재료
  'C05': { primary: 'community' }, // 철학원/운명/사주/궁합
  'C07': { primary: 'shopping' }, // 청소기구상/청소재료상
  'D01': { primary: 'community' }, // 당구장/기원/볼링장
  'J10': { primary: 'professional' }, // 자동판매기/밴딩머신
  'J12': { primary: 'professional' }, // 재고조사
  'J13': { primary: 'shopping' }, // 재봉틀/봉제부품/실
  'J15': { primary: 'financial' }, // 전당포/책케싱/머니오더
  'J17': { primary: 'shopping' }, // 전화시설/셀룰라폰/비퍼/무전기
  'J18': { primary: 'shopping' }, // 정수기
  'J20': { primary: 'shopping' }, // 조명기구
  'J21': { primary: 'professional' }, // 지사/상사
  'J22': { primary: 'professional' }, // 직업소개서/가정부/파출부
  'K08': { primary: 'shopping' }, // 건축자재/공구
  'K10': { primary: 'professional' }, // 경비회사/방범
  'K14': { primary: 'community' }, // 극장/공연장/화랑
  'M02': { primary: 'community' }, // 만화방
  'M03': { primary: 'shopping' }, // 모자
  'M05': { primary: 'shopping' }, // 문방구/미술재료/사무용품
  'N04': { primary: 'community' }, // 농장/과수원/목장
  'P03': { primary: 'professional' }, // 포장/마켓봉투/플라스틱/비닐봉투
  'P04': { primary: 'professional' }, // 풍선장식/풍선판매
  'P06': { primary: 'shopping' }, // 플러밍재료상
  'Q01': { primary: 'shopping' }, // 카메라(판매/수리/필름)
  'Q05': { primary: 'financial' }, // 크레딧교정
  'Q06': { primary: 'financial' }, // 크레딧카드서비스
  'S01': { primary: 'professional' }, // 사무기기/복사기/계산기
  'S05': { primary: 'professional' }, // 상점장비/상점설비/플라스틱제품/컨벤션전시
  'S07': { primary: 'professional' }, // 세탁소/세탁장비/옷수선
  'S08': { primary: 'professional' }, // 소방기구(판매/설비)/소화기
  'S16': { primary: 'shopping' }, // 식당용품
  'S17': { primary: 'shopping' }, // 식당장비/식당설비
  'S19': { primary: 'professional' }, // 실크스크린/티셔츠인쇄
  'S20': { primary: 'professional' }, // 심부름센터/메신저
  'T01': { primary: 'home-services', sub: 'moving' }, // 택배/통신판매/우편속달
  'T03': { primary: 'professional' }, // 트로피/감사패/상패/패넌트
};

// KoreaDaily category_id to our primary category mapping
// Based on actual source data category_names
export const KOREADAILY_PRIMARY_MAPPING: Record<number, string> = {
  5: 'food',            // 식당
  6: 'medical',         // 병원/약국
  7: 'shopping',        // 쇼핑
  8: 'dental',          // 치과
  9: 'medical',         // 성형외과 -> medical (plastic surgery)
  10: 'beauty',         // 미용/뷰티
  11: 'travel',         // 여행/관광
  12: 'insurance',      // 보험
  13: 'medical',        // 건강
  14: 'legal',          // 변호사
  15: 'real-estate',    // 부동산
  16: 'auto',           // 자동차
  17: 'financial',      // 은행/금융
  18: 'food',           // 마켓 -> food (grocery)
  19: 'auto',           // 택시/대리 -> auto
  20: 'education',      // 학교/학원
  21: 'community',      // 운동/오락 -> community
  22: 'home-services',  // 이사/택배 -> home-services (moving)
  23: 'financial',      // 회계사 -> financial (CPA)
  24: 'food',           // 노래/주점 -> food (entertainment dining)
  25: 'home-services',  // 건축/설계 -> home-services (construction)
  26: 'shopping',       // 컴퓨터 -> shopping
  27: 'community',      // 종교
  28: 'community',      // 단체/기관
};

// KoreaDaily sub_idx to our subcategory mapping (by primary category)
export const KOREADAILY_SUB_MAPPING: Record<string, string> = {
  // Food (category_id: 5)
  '5-13': 'korean-bbq',      // BBQ
  '5-14': 'korean-restaurant', // 한식
  '5-15': 'japanese-restaurant', // 일식
  '5-16': 'chinese-restaurant', // 중식
  '5-17': 'snack-bar',       // 분식
  '5-18': 'bakery',          // 베이커리
  '5-19': 'cafe',            // 카페

  // Medical (category_id: 7)
  '7-1': 'internal-medicine',
  '7-2': 'obgyn',
  '7-3': 'pediatrics',
  '7-4': 'dermatology',
  '7-5': 'ophthalmology',
  '7-6': 'ent',
  '7-7': 'orthopedics',
  '7-8': 'korean-medicine',
  '7-9': 'pharmacy',

  // Dental (category_id: 8)
  '8-1': 'general-dentist',
  '8-2': 'orthodontist',
  '8-3': 'pediatric-dentist',
  '8-4': 'dental-implants',

  // Add more mappings as needed based on actual data
};

// Get our category mapping from RadioKorea category code
export function mapRadioKoreaCategory(categoryCode: string): { primary: string; sub?: string } {
  return RADIOKOREA_MAPPING[categoryCode] || { primary: 'community', sub: 'organization' };
}

// Get our category mapping from KoreaDaily category
export function mapKoreaDailyCategory(categoryId: number, subIdx?: number): { primary: string; sub?: string } {
  const primary = KOREADAILY_PRIMARY_MAPPING[categoryId] || 'community';

  if (subIdx) {
    const subKey = `${categoryId}-${subIdx}`;
    const sub = KOREADAILY_SUB_MAPPING[subKey];
    if (sub) {
      return { primary, sub };
    }
  }

  return { primary };
}
