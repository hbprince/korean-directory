# 카테고리 매핑 리포트

## 현재 카테고리 체계

### 대분류 (Primary Categories): 15개

| Slug | 한글명 | 영문명 |
|------|--------|--------|
| auto | 자동차 | Auto Services |
| beauty | 뷰티 | Beauty |
| community | 커뮤니티 | Community |
| dental | 치과 | Dental |
| education | 교육 | Education |
| financial | 금융 | Financial |
| food | 식당 | Food & Dining |
| home-services | 주택서비스 | Home Services |
| insurance | 보험 | Insurance |
| legal | 법률 | Legal |
| medical | 병원 | Medical |
| professional | 전문서비스 | Professional Services |
| real-estate | 부동산 | Real Estate |
| shopping | 쇼핑 | Shopping |
| travel | 여행 | Travel |

---

## RadioKorea 매핑 (원본 코드 → 신규 분류)

### Medical (병원)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| B08 | 가정주치의 | medical | internal-medicine |
| B09 | 간호서비스/양로병원 | medical | - |
| B10 | 검안의 | medical | ophthalmology |
| B11 | 내과/위장내과/심장내과/류마티즘내과 | medical | internal-medicine |
| B12 | 물리치료 | medical | rehabilitation |
| B13 | 발전문의 | medical | podiatry |
| B14 | 방사선과/초음파/CT촬영 | medical | diagnostics |
| B15 | 보청기 | medical | - |
| B16 | 비뇨기과 | medical | urology |
| B17 | 산부인과/여성병원/산후조리원 | medical | obgyn |
| B18 | 성형외과 | medical | plastic-surgery |
| B19 | 소아과 | medical | pediatrics |
| B20 | 신경내과/정신과 | medical | psychiatry |
| B21 | 안과 | medical | ophthalmology |
| B22 | 알러지과 | medical | allergy |
| B23 | 암전문 | medical | oncology |
| B24 | 외과 | medical | general-surgery |
| B25 | 의료기구 | medical | - |
| B26 | 이비인후과 | medical | ent |
| B27 | 임상심리과 | medical | - |
| B28 | 재활의학과/통증치료 | medical | pain-management |
| B29 | 정형외과 | medical | orthopedics |
| B30 | 종합병원 | medical | - |
| B31 | 척추신경과 | medical | pain-management |
| B32 | 피부과 | medical | dermatology |
| B33 | 호흡기과 | medical | pulmonology |
| H09 | 한의원/건재상 | medical | korean-medicine |
| A07 | 약국 | medical | pharmacy |

### Dental (치과)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| B34 | 일반치과 | dental | - |
| B35 | 교정치과 | dental | orthodontist |
| B36 | 보철치과 | dental | prosthodontist |
| B37 | 소아치과 | dental | pediatric-dentist |
| B38 | 치아이식 | dental | dental-implants |
| B39 | 치주치과 | dental | periodontist |
| B40 | 치과기공소 | dental | dental-lab |

### Legal (법률)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| B07 | 변호사 | legal | - |
| D02 | 대서/공증/번역/통역/이민상담/유학원 | legal | notary |

### Insurance (보험)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| B41 | 보험 | insurance | - |

### Real Estate (부동산)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| B04 | 부동산(매매/감정/인스펙션) | real-estate | - |
| A14 | 에스크로 | real-estate | escrow |

### Financial (금융)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| K11 | 공인세무사/회계사무소/북키핑 | financial | tax-preparer |
| K12 | 공인회계사 | financial | cpa |
| A25 | 융자/대출/증권/뮤츄얼펀드 | financial | mortgage-broker |
| A26 | 은행/송금서비스 | financial | bank |
| B02 | 보석금(베일본드) | financial | - |
| J15 | 전당포/책케싱/머니오더 | financial | - |
| Q05 | 크레딧교정 | financial | - |
| Q06 | 크레딧카드서비스 | financial | - |

### Food & Dining (식당)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| S12 | 식당(일식) | food | japanese-restaurant |
| S13 | 식당(중식) | food | chinese-restaurant |
| S14 | 식당(양식/카페/커피샵) | food | western-restaurant |
| S15 | 식당(한식/부페/캐더링/분식) | food | korean-restaurant |
| S21 | 식당(동남아식) | food | - |
| J19 | 제과점/베이커리 | food | bakery |
| D05 | 떡집/방앗간 | food | bakery |
| M01 | 마켓/식품점 | food | grocery |
| S18 | 식품도매 | food | grocery |
| N01 | 나이트클럽/캬바레/룸싸롱 | food | - |
| N03 | 노래방/가라오케 | food | - |

### Beauty (뷰티)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| M06 | 미용실/메이크업 | beauty | hair-salon |
| A29 | 이발관 | beauty | barbershop |
| S11 | 스킨케어/피부미용/영구화장 | beauty | skin-care |
| S03 | 사우나/스파/헬스/지압/스포츠센터 | beauty | spa |
| H08 | 화장품 | beauty | cosmetics |
| K03 | 가발/모발관리 | beauty | - |
| M07 | 미용재료상 | beauty | - |

### Auto Services (자동차)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| J01 | 자동차(렌터카) | auto | car-rental |
| J02 | 자동차(매매/리스) | auto | car-dealer |
| J03 | 자동차(바디/페인트/수리정비) | auto | auto-repair |
| J04 | 자동차(세차장) | auto | car-wash |
| J05 | 자동차(스테레오/실내장식/알람/틴트) | auto | - |
| J06 | 자동차(유리) | auto | - |
| J07 | 자동차(타이어) | auto | tires |
| J08 | 자동차(토잉서비스) | auto | towing |
| J09 | 자동차(폐차장) | auto | - |
| T02 | 택시/리무진/버스 | auto | - |

### Home Services (주택서비스)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| A16 | 열쇠/금고/락스미스 | home-services | locksmith |
| A33 | 운송/이삿짐/통관/창고 | home-services | moving |
| P05 | 플러밍/보일러 | home-services | plumbing |
| N02 | 냉동/에어컨/보일러 | home-services | hvac |
| L01 | 루핑/지붕수리/루핑재료상 | home-services | roofing |
| C06 | 청소/쓰레기수거 | home-services | cleaning |
| J14 | 전기공사(시설,수리) | home-services | electrical |
| K02 | 가드닝서비스/정원공사/조경공사 | home-services | landscaping |
| K07 | 건축/설계/시공/실내장식/인테리어 | home-services | construction |
| P02 | 페인트/도배/페스트재료상 | home-services | painting |
| Q02 | 카펫/카텐/블라인드/마루/타일 | home-services | carpet |
| Q03 | 카펫크리닝 | home-services | cleaning |
| P01 | 페스트콘트롤/터마이트/소독 | home-services | pest-control |
| M04 | 목수/집수리/핸디맨/주방케비넷/욕조재생 | home-services | construction |
| T01 | 택배/통신판매/우편속달 | home-services | moving |
| C01 | 차고문 | home-services | - |
| C04 | 철공소/용접 | home-services | - |
| S09 | 수영장(공사/관리/청소) | home-services | - |
| A23 | 유리점/거울/틴트/창문시공 | home-services | - |

### Education (교육)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| H01 | 학교(어린이-정규/패밀리) | education | preschool |
| H02 | 학교/학원(예능) | education | music-school |
| H03 | 학교/학원(일반) | education | tutoring |
| H04 | 학교/학원(직업/취업) | education | - |
| A21 | 운전학교/교통위반자학교 | education | driving-school |
| C08 | 체육관/태권도/단센터/검도 | education | martial-arts |
| D03 | 댄스/사교장 | education | dance-school |
| D04 | 도장/무술 | education | martial-arts |
| A01 | 악기점/피아노/조율 | education | music-school |

### Travel (여행)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| A15 | 여행사/관광 | travel | travel-agency |
| H06 | 항공사 | travel | airline |
| H07 | 호텔/모텔 | travel | hotel |
| A18 | 온천장/핫스프링 | travel | - |
| A24 | 유원지/놀이공원/동물원/스테디움 | travel | - |

### Professional Services (전문서비스)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| A31 | 인쇄소/달력/라벨/사진식자 | professional | printing |
| S04 | 사진(촬영/현상재료/비디오촬영) | professional | photography |
| K13 | 광고/디자인/기획/대행/판촉물/우편광고 | professional | advertising |
| K05 | 간판/네온싸인 | professional | signage |
| A22 | 웨딩센터/예식장/혼수용품 | professional | wedding |
| J11 | 장의사/묘지 | professional | funeral |
| A32 | 인터넷/웹사이트제작(관리) | professional | - |
| S02 | 사설탐정/흥신소 | professional | - |
| K09 | 결혼상담소 | professional | - |
| S07 | 세탁소/세탁장비/옷수선 | professional | - |

### Shopping (쇼핑)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| J16 | 전자제품/가전제품(판매/수리) | shopping | electronics |
| Q04 | 컴퓨터(판매/수리)/네트워크 | shopping | electronics |
| K01 | 가구점/어린이가구점/가구수리/만물상 | shopping | furniture |
| A28 | 의류도매/유니폼/자바의류 | shopping | clothing |
| B03 | 보석상/시계/귀금속 | shopping | jewelry |
| A02 | 안경원/콘텍트렌즈 | shopping | optical |
| S06 | 서점/시청각교재 | shopping | bookstore |
| K15 | 꽃집/식물원 | shopping | florist |
| B01 | 백화점/생활용품/선물센터 | shopping | - |
| K06 | 건강식약품/건강기구/자연식품 | shopping | - |
| A12 | 어린이용품/장난감 | shopping | - |
| S10 | 수입도매/무역/양말도매/잡화도매 | shopping | - |
| H05 | 한복점/고전의상 | shopping | - |

### Community (커뮤니티)
| 원본 코드 | 원본 카테고리명 | 대분류 | 중분류 |
|-----------|----------------|--------|--------|
| G04 | 종교단체(교회) | community | church |
| G05 | 종교단체(선교회) | community | church |
| G06 | 종교단체(신학교) | community | church |
| G07 | 종교단체(기도원) | community | church |
| G08 | 종교단체(천주교) | community | church |
| G10 | 종교단체(불교사원) | community | temple |
| G11 | 종교단체(원불교) | community | temple |
| G01 | 공공기관/도서관/단체 | community | organization |
| G02 | 봉사기관 | community | organization |
| G03 | 일반단체 | community | organization |
| G12 | 동창회(학교) | community | organization |
| A08 | 양로센타/노인복지시설 | community | senior-center |
| A13 | 언론기관(신문/TV/라디오/케이블TV/위성방송) | community | media |

---

## KoreaDaily 매핑 (category_id → 신규 분류)

### 대분류 매핑
| category_id | 원본 카테고리명 | 신규 대분류 |
|-------------|----------------|-------------|
| 5 | 식당 | food |
| 6 | 병원/약국 | medical |
| 7 | 쇼핑 | shopping |
| 8 | 치과 | dental |
| 9 | 성형외과 | medical |
| 10 | 미용/뷰티 | beauty |
| 11 | 여행/관광 | travel |
| 12 | 보험 | insurance |
| **13** | **건강식품/한방** | **shopping** ⚠️ |
| 14 | 변호사 | legal |
| 15 | 부동산 | real-estate |
| 16 | 자동차 | auto |
| 17 | 은행/금융 | financial |
| 18 | 마켓 | food |
| 19 | 택시/대리 | auto |
| 20 | 학교/학원 | education |
| 21 | 운동/오락 | community |
| 22 | 이사/택배 | home-services |
| 23 | 회계사 | financial |
| 24 | 노래/주점 | food |
| 25 | 건축/설계 | home-services |
| 26 | 컴퓨터 | shopping |
| 27 | 종교 | community |
| 28 | 단체/기관 | community |

⚠️ **주의:** Category 13 (건강식품/한방)은 원래 `medical`로 매핑되어 있었으나, 흑염소농축 등 건강보조식품 업체가 병원으로 잘못 분류되어 `shopping`으로 수정됨 (2026-01-28)

### 중분류 매핑 (일부)
| 키 | 원본 | 신규 중분류 |
|----|------|-------------|
| 5-13 | BBQ | korean-bbq |
| 5-14 | 한식 | korean-restaurant |
| 5-15 | 일식 | japanese-restaurant |
| 5-16 | 중식 | chinese-restaurant |
| 5-17 | 분식 | snack-bar |
| 5-18 | 베이커리 | bakery |
| 5-19 | 카페 | cafe |
| 8-1 | 일반치과 | general-dentist |
| 8-2 | 교정 | orthodontist |
| 8-3 | 소아치과 | pediatric-dentist |
| 8-4 | 임플란트 | dental-implants |

---

## 통계

| 항목 | 수량 |
|------|------|
| 대분류 (Primary) | 15개 |
| 중분류 (Sub) | 118개 |
| RadioKorea 매핑 코드 | 132개 |
| KoreaDaily 매핑 코드 | 24개 |

---

## 검토 필요 항목

1. **검안의 (B10)** - 현재 `medical > ophthalmology`로 매핑됨
   - 검안사(Optometrist)는 의료 vs 쇼핑(안경점) 구분 필요할 수 있음

2. **사우나/스파 (S03)** - 현재 `beauty > spa`로 매핑됨
   - 목욕탕/찜질방은 커뮤니티로 분류가 더 적절할 수 있음

3. **세탁소 (S07)** - 현재 `professional`로 매핑됨
   - `home-services`가 더 적절할 수 있음

4. **건강식품 (K06)** - 현재 `shopping`으로 매핑됨
   - 한약재/건강원 등은 별도 분류 고려 가능
