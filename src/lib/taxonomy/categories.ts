// Primary Categories with SEO-friendly slugs
export interface PrimaryCategory {
  slug: string;
  nameKo: string;
  nameEn: string;
  descriptionKo?: string;
  descriptionEn?: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  slug: string;
  nameKo: string;
  nameEn: string;
  descriptionKo?: string;
  descriptionEn?: string;
}

export const PRIMARY_CATEGORIES: PrimaryCategory[] = [
  {
    slug: 'medical',
    nameKo: '병원',
    nameEn: 'Medical',
    descriptionKo: '한국어 진료 가능한 내과, 정형외과, 피부과, 한의원, 약국 등 한인 의료기관을 찾아보세요. 증상 설명부터 치료 상담까지 모국어로 정확하게 소통할 수 있습니다. 전화번호, 주소, 진료시간, 환자 평점을 확인하고 가까운 한인 병원을 예약하세요.',
    descriptionEn: 'Find Korean-speaking doctors including internal medicine, orthopedics, dermatology, Korean medicine clinics, and pharmacies. Communicate clearly about symptoms and treatment in your native language. View phone numbers, addresses, office hours, and patient ratings to book an appointment.',
    subcategories: [
      { slug: 'internal-medicine', nameKo: '내과', nameEn: 'Internal Medicine', descriptionKo: '한국어 상담 가능한 내과·가정의학과 전문의를 찾아보세요. 감기, 고혈압, 당뇨, 건강검진 등 일반 진료부터 만성질환 관리까지 모국어로 상담할 수 있습니다.', descriptionEn: 'Find Korean-speaking internists and family medicine doctors. Get checkups, manage chronic conditions like hypertension and diabetes, and discuss symptoms clearly in your language.' },
      { slug: 'obgyn', nameKo: '산부인과', nameEn: 'OBGYN', descriptionKo: '한국어 진료 가능한 산부인과 전문의를 찾아보세요. 임신·출산 관리, 부인과 검진, 산전검사, 산후조리 상담까지 편안하게 모국어로 진행할 수 있습니다.', descriptionEn: 'Find Korean-speaking OB/GYN specialists for prenatal care, pregnancy management, gynecological exams, and postpartum consultations in a comfortable language environment.' },
      { slug: 'pediatrics', nameKo: '소아과', nameEn: 'Pediatrics', descriptionKo: '한국어 상담 가능한 소아과 전문의 목록입니다. 영유아 건강검진, 예방접종, 아이 성장 발달 상담을 모국어로 받을 수 있어 부모님의 걱정을 덜어드립니다.', descriptionEn: 'Find Korean-speaking pediatricians for well-child checkups, vaccinations, and developmental consultations. Communicate your child\'s symptoms clearly in Korean.' },
      { slug: 'dermatology', nameKo: '피부과', nameEn: 'Dermatology', descriptionKo: '한국어 진료 가능한 피부과 전문의를 찾아보세요. 여드름, 습진, 피부암 검진, 레이저 시술, 미용 피부 관리까지 정확한 피부 상태 설명이 가능합니다.', descriptionEn: 'Find Korean-speaking dermatologists for acne, eczema, skin cancer screening, laser treatments, and cosmetic skin care. Describe your skin concerns precisely in Korean.' },
      { slug: 'ophthalmology', nameKo: '안과', nameEn: 'Ophthalmology', descriptionKo: '한국어 상담 가능한 안과 전문의를 찾아보세요. 시력검사, 백내장·녹내장 치료, 라식·라섹 수술 상담을 모국어로 정확하게 진행할 수 있습니다.', descriptionEn: 'Find Korean-speaking ophthalmologists for eye exams, cataract and glaucoma treatment, and LASIK consultations. Discuss your vision concerns clearly in Korean.' },
      { slug: 'ent', nameKo: '이비인후과', nameEn: 'ENT', descriptionKo: '한국어 진료 가능한 이비인후과 전문의를 찾아보세요. 비염, 축농증, 중이염, 편도선, 수면무호흡증 등 귀·코·목 질환을 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking ENT doctors for sinus problems, ear infections, tonsillitis, sleep apnea, and hearing issues. Explain your ear, nose, and throat symptoms in Korean.' },
      { slug: 'orthopedics', nameKo: '정형외과', nameEn: 'Orthopedics', descriptionKo: '한국어 상담 가능한 정형외과 전문의입니다. 관절통, 골절, 디스크, 스포츠 부상, 무릎·어깨 수술 상담을 모국어로 정확하게 받으세요.', descriptionEn: 'Find Korean-speaking orthopedic surgeons for joint pain, fractures, disc problems, sports injuries, and knee or shoulder surgery consultations.' },
      { slug: 'neurosurgery', nameKo: '신경외과', nameEn: 'Neurosurgery', descriptionKo: '한국어 진료 가능한 신경외과 전문의를 찾아보세요. 뇌·척추 수술, 디스크 질환, 뇌종양 등 복잡한 신경계 질환 상담을 모국어로 진행합니다.', descriptionEn: 'Find Korean-speaking neurosurgeons for brain and spine surgery, disc disease, and complex neurological conditions. Understand your treatment plan clearly in Korean.' },
      { slug: 'urology', nameKo: '비뇨기과', nameEn: 'Urology', descriptionKo: '한국어 상담 가능한 비뇨기과 전문의입니다. 전립선, 방광, 신장 질환, 비뇨기 감염 등 민감한 증상을 모국어로 편안하게 상담할 수 있습니다.', descriptionEn: 'Find Korean-speaking urologists for prostate, bladder, and kidney issues. Discuss sensitive urological symptoms comfortably in your native language.' },
      { slug: 'cardiology', nameKo: '심장내과', nameEn: 'Cardiology', descriptionKo: '한국어 진료 가능한 심장내과 전문의를 찾아보세요. 부정맥, 고혈압, 심부전, 심장초음파 검사 등 심혈관 질환을 모국어로 정확하게 상담하세요.', descriptionEn: 'Find Korean-speaking cardiologists for arrhythmia, hypertension, heart failure, and cardiac diagnostics. Understand your heart health clearly in Korean.' },
      { slug: 'gastroenterology', nameKo: '소화기내과', nameEn: 'Gastroenterology', descriptionKo: '한국어 상담 가능한 소화기내과 전문의입니다. 위장질환, 대장내시경, 간질환, 소화불량 등을 모국어로 상담하고 정확한 진단을 받으세요.', descriptionEn: 'Find Korean-speaking gastroenterologists for digestive issues, colonoscopy, liver disease, and stomach problems. Discuss your GI symptoms precisely in Korean.' },
      { slug: 'psychiatry', nameKo: '정신과', nameEn: 'Psychiatry', descriptionKo: '한국어 상담 가능한 정신건강의학과 전문의를 찾아보세요. 우울증, 불안장애, 수면장애, 스트레스 관리 등 마음 건강을 모국어로 편안하게 상담하세요.', descriptionEn: 'Find Korean-speaking psychiatrists for depression, anxiety, insomnia, and stress management. Mental health care is more effective when you can express yourself in your native language.' },
      { slug: 'plastic-surgery', nameKo: '성형외과', nameEn: 'Plastic Surgery', descriptionKo: '한국어 상담 가능한 성형외과 전문의입니다. 쌍꺼풀, 코성형, 리프팅, 지방흡입 등 미용 수술 상담을 모국어로 세밀하게 진행하세요.', descriptionEn: 'Find Korean-speaking plastic surgeons for cosmetic procedures including eyelid surgery, rhinoplasty, facelifts, and liposuction. Discuss your goals precisely in Korean.' },
      { slug: 'pain-management', nameKo: '통증의학과', nameEn: 'Pain Management', descriptionKo: '한국어 진료 가능한 통증의학과·카이로프랙틱 전문의를 찾아보세요. 만성통증, 허리·목 디스크, 관절통, 척추교정 치료를 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking pain management specialists and chiropractors for chronic pain, disc herniation, joint pain, and spinal alignment treatment.' },
      { slug: 'rehabilitation', nameKo: '재활의학과', nameEn: 'Rehabilitation', descriptionKo: '한국어 상담 가능한 재활의학과·물리치료 전문 의료기관입니다. 수술 후 재활, 스포츠 재활, 물리치료 과정을 모국어로 정확하게 소통하세요.', descriptionEn: 'Find Korean-speaking rehabilitation medicine doctors and physical therapists. Get post-surgical rehab, sports recovery, and physical therapy with clear communication.' },
      { slug: 'general-surgery', nameKo: '외과', nameEn: 'General Surgery', descriptionKo: '한국어 진료 가능한 외과 전문의를 찾아보세요. 일반 외과 수술, 탈장, 담낭, 갑상선 수술 등 수술 과정과 회복 과정을 모국어로 상담할 수 있습니다.', descriptionEn: 'Find Korean-speaking general surgeons for hernia repair, gallbladder surgery, thyroid surgery, and other surgical procedures. Understand pre-op and post-op care in Korean.' },
      { slug: 'oncology', nameKo: '종양내과', nameEn: 'Oncology', descriptionKo: '한국어 상담 가능한 종양내과 전문의를 찾아보세요. 암 진단, 항암치료, 면역치료 과정에서 모국어로 소통하면 치료 계획을 정확하게 이해할 수 있습니다.', descriptionEn: 'Find Korean-speaking oncologists for cancer diagnosis, chemotherapy, and immunotherapy. Understanding your treatment plan in your native language is crucial during cancer care.' },
      { slug: 'nephrology', nameKo: '신장내과', nameEn: 'Nephrology', descriptionKo: '한국어 진료 가능한 신장내과 전문의입니다. 만성 신장질환, 투석, 신장이식 상담 등 복잡한 치료 과정을 모국어로 이해하고 관리하세요.', descriptionEn: 'Find Korean-speaking nephrologists for chronic kidney disease, dialysis, and transplant consultations. Understand complex kidney care clearly in Korean.' },
      { slug: 'pulmonology', nameKo: '호흡기내과', nameEn: 'Pulmonology', descriptionKo: '한국어 상담 가능한 호흡기내과 전문의를 찾아보세요. 천식, 폐렴, 만성폐질환(COPD), 수면무호흡증 등 호흡기 질환을 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking pulmonologists for asthma, pneumonia, COPD, and sleep apnea. Explain your breathing symptoms and understand treatment options in Korean.' },
      { slug: 'endocrinology', nameKo: '내분비내과', nameEn: 'Endocrinology', descriptionKo: '한국어 진료 가능한 내분비내과 전문의입니다. 당뇨병, 갑상선, 호르몬 이상, 골다공증 등 내분비 질환을 모국어로 관리하세요.', descriptionEn: 'Find Korean-speaking endocrinologists for diabetes, thyroid disorders, hormonal imbalances, and osteoporosis management. Manage chronic conditions in your language.' },
      { slug: 'rheumatology', nameKo: '류마티스내과', nameEn: 'Rheumatology', descriptionKo: '한국어 상담 가능한 류마티스내과 전문의를 찾아보세요. 류마티스 관절염, 루푸스, 통풍 등 자가면역 질환을 모국어로 상담하고 치료받으세요.', descriptionEn: 'Find Korean-speaking rheumatologists for rheumatoid arthritis, lupus, gout, and other autoimmune diseases. Discuss complex treatment plans clearly in Korean.' },
      { slug: 'allergy', nameKo: '알레르기내과', nameEn: 'Allergy', descriptionKo: '한국어 진료 가능한 알레르기 전문의입니다. 알레르기 검사, 비염, 천식, 아토피, 식품 알레르기 치료를 모국어로 정확하게 상담하세요.', descriptionEn: 'Find Korean-speaking allergists for allergy testing, hay fever, asthma, eczema, and food allergy treatment. Describe your allergic reactions precisely in Korean.' },
      { slug: 'podiatry', nameKo: '족부의학', nameEn: 'Podiatry', descriptionKo: '한국어 상담 가능한 족부 전문의를 찾아보세요. 발 통증, 무지외반증, 족저근막염, 당뇨발 관리 등 발 관련 질환을 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking podiatrists for foot pain, bunions, plantar fasciitis, and diabetic foot care. Discuss your foot and ankle concerns in Korean.' },
      { slug: 'diagnostics', nameKo: '진단/검진', nameEn: 'Diagnostics', descriptionKo: '한국어 상담 가능한 진단·검진 센터를 찾아보세요. 건강검진, 초음파, CT, MRI, 혈액검사 결과를 모국어로 설명받고 정확하게 이해하세요.', descriptionEn: 'Find Korean-speaking diagnostic centers for health screenings, ultrasound, CT, MRI, and lab tests. Receive clear explanations of your test results in Korean.' },
      { slug: 'korean-medicine', nameKo: '한의원', nameEn: 'Korean Medicine', descriptionKo: '한의원에서 침, 한약, 부항, 추나요법 등 전통 한방 치료를 받아보세요. 한국어로 체질 상담과 맞춤 치료 계획을 세울 수 있습니다.', descriptionEn: 'Find Korean medicine clinics offering acupuncture, herbal medicine, cupping, and chuna therapy. Get personalized traditional Korean medical treatment and consultations.' },
      { slug: 'pharmacy', nameKo: '약국', nameEn: 'Pharmacy', descriptionKo: '한국어 상담 가능한 한인 약국을 찾아보세요. 처방약 조제, 일반의약품 안내, 건강보조식품 상담을 모국어로 받을 수 있어 복약 지도가 정확합니다.', descriptionEn: 'Find Korean-speaking pharmacies for prescription filling, OTC medication guidance, and supplement consultations. Get accurate medication instructions in Korean.' },
      { slug: 'general-hospital', nameKo: '종합병원', nameEn: 'General Hospital', descriptionKo: '한국어 통역 또는 한인 의료진이 있는 종합병원을 찾아보세요. 여러 진료과를 한 곳에서 이용할 수 있어 복합 질환 치료에 편리합니다.', descriptionEn: 'Find general hospitals with Korean-speaking staff or interpreters. Access multiple medical departments under one roof for comprehensive care.' },
      { slug: 'optometrist', nameKo: '검안의', nameEn: 'Optometrist', descriptionKo: '한국어 상담 가능한 검안의를 찾아보세요. 시력검사, 안경·콘택트렌즈 처방, 눈 건강 검진을 모국어로 편안하게 받으세요.', descriptionEn: 'Find Korean-speaking optometrists for eye exams, glasses and contact lens prescriptions, and routine vision care in your native language.' },
    ],
  },
  {
    slug: 'dental',
    nameKo: '치과',
    nameEn: 'Dental',
    descriptionKo: '한국어 상담 가능한 일반치과, 교정치과, 임플란트, 소아치과 등 한인 치과 목록입니다. 치료 과정, 비용, 보험 적용 여부를 모국어로 명확하게 소통하고, 평점과 리뷰를 확인하여 믿을 수 있는 치과를 선택하세요.',
    descriptionEn: 'Find Korean-speaking dentists including general dentistry, orthodontics, implants, and pediatric dental care. Discuss treatment plans, costs, and insurance coverage clearly in Korean. Check ratings and reviews to choose a trusted dental provider.',
    subcategories: [
      { slug: 'general-dentist', nameKo: '일반치과', nameEn: 'General Dentist', descriptionKo: '한국어 상담 가능한 일반 치과를 찾아보세요. 정기검진, 충치치료, 스케일링, 크라운, 신경치료 등 기본 치과 진료를 모국어로 편안하게 받으세요.', descriptionEn: 'Find Korean-speaking general dentists for checkups, cavity fillings, cleanings, crowns, and root canals. Get routine dental care with clear communication.' },
      { slug: 'orthodontist', nameKo: '교정치과', nameEn: 'Orthodontist', descriptionKo: '한국어 상담 가능한 교정 전문 치과입니다. 치아교정, 투명교정(인비절라인), 소아교정 등 교정 치료 계획과 비용을 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking orthodontists for braces, Invisalign, and pediatric orthodontics. Discuss treatment timelines and costs clearly in Korean.' },
      { slug: 'pediatric-dentist', nameKo: '소아치과', nameEn: 'Pediatric Dentist', descriptionKo: '한국어 진료 가능한 소아치과 전문의입니다. 아이들의 치아 발달, 충치 예방, 실란트, 불소 도포 등을 모국어로 상담하고 아이가 편안하게 치료받도록 하세요.', descriptionEn: 'Find Korean-speaking pediatric dentists for children\'s dental development, cavity prevention, sealants, and fluoride treatments in a child-friendly environment.' },
      { slug: 'dental-implants', nameKo: '임플란트', nameEn: 'Dental Implants', descriptionKo: '한국어 상담 가능한 임플란트 전문 치과를 찾아보세요. 수술 과정, 뼈이식, 회복 기간, 비용을 모국어로 상세하게 설명받고 치료 계획을 세우세요.', descriptionEn: 'Find Korean-speaking dental implant specialists. Get detailed explanations of the procedure, bone grafting, recovery time, and costs in your native language.' },
      { slug: 'prosthodontist', nameKo: '보철치과', nameEn: 'Prosthodontist', descriptionKo: '한국어 진료 가능한 보철 전문 치과입니다. 크라운, 브릿지, 틀니, 보철 수복 등 복잡한 치과 보철 치료를 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking prosthodontists for crowns, bridges, dentures, and complex dental restorations. Discuss your restoration options clearly in Korean.' },
      { slug: 'periodontist', nameKo: '치주과', nameEn: 'Periodontist', descriptionKo: '한국어 상담 가능한 치주과 전문의를 찾아보세요. 잇몸질환, 치주수술, 잇몸이식, 임플란트 주위 관리를 모국어로 정확하게 상담하세요.', descriptionEn: 'Find Korean-speaking periodontists for gum disease treatment, periodontal surgery, gum grafting, and implant maintenance with clear communication.' },
      { slug: 'dental-lab', nameKo: '치과기공소', nameEn: 'Dental Lab', descriptionKo: '한국어 소통 가능한 치과기공소입니다. 크라운, 브릿지, 틀니, 교정장치 등 정밀 치과 보철물을 한인 기공사에게 맡기세요.', descriptionEn: 'Find Korean-speaking dental labs for custom crowns, bridges, dentures, and orthodontic appliances made with precision by Korean dental technicians.' },
    ],
  },
  {
    slug: 'legal',
    nameKo: '법률',
    nameEn: 'Legal',
    descriptionKo: '한국어 상담 가능한 이민법, 가정법, 형사법, 비즈니스법, 상해법 전문 한인 변호사를 찾아보세요. 복잡한 법률 용어와 절차를 모국어로 정확하게 이해하고, 본인의 권리를 보호하세요. 무료 상담 여부와 전문 분야를 확인하세요.',
    descriptionEn: 'Find Korean-speaking lawyers specializing in immigration, family, criminal, business, and personal injury law. Understand complex legal terminology and protect your rights with an attorney who speaks your language. Check free consultation availability.',
    subcategories: [
      { slug: 'immigration-lawyer', nameKo: '이민법', nameEn: 'Immigration Lawyer', descriptionKo: '한국어 상담 가능한 이민 전문 변호사를 찾아보세요. 영주권, 시민권, 취업비자(H-1B), 학생비자, 망명 등 이민 관련 법률 문제를 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking immigration lawyers for green cards, citizenship, H-1B visas, student visas, and asylum cases. Navigate the immigration process in your language.' },
      { slug: 'family-lawyer', nameKo: '가정법', nameEn: 'Family Lawyer', descriptionKo: '한국어 상담 가능한 가정법 전문 변호사입니다. 이혼, 양육권, 재산분할, 입양, 가정 보호명령 등 민감한 가정 문제를 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking family lawyers for divorce, child custody, property division, adoption, and restraining orders. Handle sensitive family matters in your language.' },
      { slug: 'business-lawyer', nameKo: '비즈니스법', nameEn: 'Business Lawyer', descriptionKo: '한국어 상담 가능한 비즈니스 전문 변호사를 찾아보세요. 법인 설립, 계약서 검토, 사업 분쟁, 지적재산, 고용법 등을 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking business lawyers for incorporation, contract review, business disputes, intellectual property, and employment law consultations.' },
      { slug: 'criminal-lawyer', nameKo: '형사법', nameEn: 'Criminal Lawyer', descriptionKo: '한국어 상담 가능한 형사법 전문 변호사입니다. 음주운전(DUI), 폭행, 절도, 사기 등 형사 사건에서 본인의 권리를 모국어로 정확하게 보호하세요.', descriptionEn: 'Find Korean-speaking criminal defense lawyers for DUI, assault, theft, fraud, and other criminal charges. Protect your rights with clear communication in Korean.' },
      { slug: 'personal-injury-lawyer', nameKo: '상해법', nameEn: 'Personal Injury Lawyer', descriptionKo: '한국어 상담 가능한 상해 전문 변호사를 찾아보세요. 교통사고, 산업재해, 의료과실 등으로 인한 부상 보상 청구를 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking personal injury lawyers for car accidents, workplace injuries, and medical malpractice claims. Get compensation guidance in your language.' },
      { slug: 'real-estate-lawyer', nameKo: '부동산법', nameEn: 'Real Estate Lawyer', descriptionKo: '한국어 상담 가능한 부동산 전문 변호사입니다. 주택·상가 매매 계약, 임대차 분쟁, 에스크로, 타이틀 검토를 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking real estate attorneys for property purchase contracts, lease disputes, escrow, and title review. Understand every clause in Korean.' },
      { slug: 'notary', nameKo: '공증', nameEn: 'Notary', descriptionKo: '한국어 서비스 가능한 공증 사무소를 찾아보세요. 서류 공증, 번역, 대서 업무를 모국어로 처리하여 정확하고 빠르게 법적 서류를 준비하세요.', descriptionEn: 'Find Korean-speaking notary services for document notarization, translation, and legal document preparation. Process your paperwork accurately in Korean.' },
    ],
  },
  {
    slug: 'insurance',
    nameKo: '보험',
    nameEn: 'Insurance',
    descriptionKo: '한국어 상담 가능한 건강보험, 자동차보험, 생명보험, 비즈니스보험 전문 에이전트를 찾아보세요. 복잡한 보험 약관과 보장 범위를 모국어로 명확하게 이해하고, 본인에게 맞는 최적의 보험 플랜을 비교·선택하세요.',
    descriptionEn: 'Find Korean-speaking insurance agents for health, auto, life, and business insurance. Understand complex policy terms and coverage in your language. Compare plans and choose the best coverage for your needs.',
    subcategories: [
      { slug: 'health-insurance', nameKo: '건강보험', nameEn: 'Health Insurance', descriptionKo: '한국어 상담 가능한 건강보험 에이전트를 찾아보세요. 개인·가족 건강보험, 메디케어, 오바마케어 등 보장 내용과 보험료를 모국어로 비교·상담하세요.', descriptionEn: 'Find Korean-speaking health insurance agents for individual, family, Medicare, and ACA marketplace plans. Compare coverage and premiums in your language.' },
      { slug: 'auto-insurance', nameKo: '자동차보험', nameEn: 'Auto Insurance', descriptionKo: '한국어 상담 가능한 자동차보험 에이전트입니다. 자동차보험 가입, 사고 처리, 보험료 비교, 보장 범위를 모국어로 명확하게 이해하세요.', descriptionEn: 'Find Korean-speaking auto insurance agents for coverage quotes, accident claims, and policy comparisons. Understand your coverage details clearly in Korean.' },
      { slug: 'life-insurance', nameKo: '생명보험', nameEn: 'Life Insurance', descriptionKo: '한국어 상담 가능한 생명보험 전문 에이전트를 찾아보세요. 종신보험, 정기보험, 교육보험, 연금보험 등 가족의 미래를 모국어로 설계하세요.', descriptionEn: 'Find Korean-speaking life insurance agents for whole life, term life, education savings, and annuity plans. Plan your family\'s future in your language.' },
      { slug: 'business-insurance', nameKo: '비즈니스보험', nameEn: 'Business Insurance', descriptionKo: '한국어 상담 가능한 비즈니스보험 에이전트입니다. 사업자 배상책임보험, 재산보험, 근로자보상보험 등 사업체 맞춤 보험을 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking business insurance agents for general liability, property, workers\' comp, and commercial insurance tailored to your business needs.' },
      { slug: 'home-insurance', nameKo: '주택보험', nameEn: 'Home Insurance', descriptionKo: '한국어 상담 가능한 주택보험 에이전트를 찾아보세요. 주택화재보험, 지진보험, 홍수보험, 세입자보험 등 주택 보장을 모국어로 비교하세요.', descriptionEn: 'Find Korean-speaking home insurance agents for homeowners, earthquake, flood, and renters insurance. Compare home protection options in your language.' },
    ],
  },
  {
    slug: 'real-estate',
    nameKo: '부동산',
    nameEn: 'Real Estate',
    descriptionKo: '한국어 상담 가능한 주거용·상업용 부동산 에이전트, 에스크로, 부동산 관리 전문가를 찾아보세요. 매매 계약, 가격 협상, 모기지, 클로징 절차를 모국어로 소통하고, 한인 커뮤니티 선호 지역 정보를 얻으세요.',
    descriptionEn: 'Find Korean-speaking real estate agents, escrow officers, and property managers. Communicate about contracts, negotiations, and closing procedures in Korean. Get local market insights for Korean community neighborhoods.',
    subcategories: [
      { slug: 'residential-realtor', nameKo: '주거용부동산', nameEn: 'Residential Realtor', descriptionKo: '한국어 상담 가능한 주거용 부동산 에이전트를 찾아보세요. 주택 매매, 렌트, 학군 정보, 한인 밀집 지역 안내를 모국어로 받으세요.', descriptionEn: 'Find Korean-speaking residential real estate agents for home buying, selling, and renting. Get school district info and Korean neighborhood recommendations.' },
      { slug: 'commercial-realtor', nameKo: '상업용부동산', nameEn: 'Commercial Realtor', descriptionKo: '한국어 상담 가능한 상업용 부동산 에이전트입니다. 사업장 임대, 상가 매매, 투자용 부동산 등 비즈니스 부동산을 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking commercial real estate agents for business leases, retail property sales, and investment properties. Negotiate commercial deals in Korean.' },
      { slug: 'property-management', nameKo: '부동산관리', nameEn: 'Property Management', descriptionKo: '한국어 소통 가능한 부동산 관리 업체를 찾아보세요. 임대관리, 세입자 관리, 건물 유지보수 등 부동산 관리를 모국어로 맡기세요.', descriptionEn: 'Find Korean-speaking property management companies for rental management, tenant relations, and building maintenance. Manage your properties in Korean.' },
      { slug: 'escrow', nameKo: '에스크로', nameEn: 'Escrow', descriptionKo: '한국어 서비스 가능한 에스크로 업체를 찾아보세요. 부동산 거래의 중간 정산, 서류 처리, 클로징 절차를 모국어로 정확하게 이해하세요.', descriptionEn: 'Find Korean-speaking escrow services for real estate transactions. Understand settlement, document processing, and closing procedures clearly in Korean.' },
    ],
  },
  {
    slug: 'financial',
    nameKo: '금융',
    nameEn: 'Financial',
    descriptionKo: '한국어 상담 가능한 공인회계사(CPA), 세무사, 모기지 브로커, 은행, 재정 상담사를 찾아보세요. 세금 신고, 사업 회계, 주택 융자, 투자 전략 등 전문 재정 서비스를 모국어로 정확하게 이해하고 관리하세요.',
    descriptionEn: 'Find Korean-speaking CPAs, tax preparers, mortgage brokers, banks, and financial advisors. Manage tax filing, business accounting, home loans, and investments with clear communication in your language.',
    subcategories: [
      { slug: 'cpa', nameKo: '공인회계사', nameEn: 'CPA', descriptionKo: '한국어 상담 가능한 공인회계사(CPA)를 찾아보세요. 개인·법인 세금 신고, 사업 회계, 감사, 재무제표 작성을 모국어로 정확하게 처리하세요.', descriptionEn: 'Find Korean-speaking CPAs for individual and business tax filing, accounting, auditing, and financial statement preparation with accurate communication.' },
      { slug: 'tax-preparer', nameKo: '세무사', nameEn: 'Tax Preparer', descriptionKo: '한국어 상담 가능한 세무사를 찾아보세요. 개인 소득세, 사업세, 급여세 신고와 세금 절약 전략을 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking tax preparers for personal income tax, business tax, payroll tax filing, and tax-saving strategies in your native language.' },
      { slug: 'mortgage-broker', nameKo: '모기지', nameEn: 'Mortgage Broker', descriptionKo: '한국어 상담 가능한 모기지 브로커를 찾아보세요. 주택 구매 융자, 재융자, 이자율 비교, 대출 심사 과정을 모국어로 명확하게 이해하세요.', descriptionEn: 'Find Korean-speaking mortgage brokers for home purchase loans, refinancing, rate comparison, and loan approval guidance in your language.' },
      { slug: 'bank', nameKo: '은행', nameEn: 'Bank', descriptionKo: '한국어 서비스 가능한 은행과 금융기관을 찾아보세요. 계좌 개설, 송금, 환전, 사업자 대출, 저축 상품을 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking banks and financial institutions for account opening, wire transfers, currency exchange, business loans, and savings products.' },
      { slug: 'financial-advisor', nameKo: '재정상담', nameEn: 'Financial Advisor', descriptionKo: '한국어 상담 가능한 재정 상담사를 찾아보세요. 은퇴 계획, 투자 전략, 자산 관리, 보험 설계를 모국어로 종합적으로 상담하세요.', descriptionEn: 'Find Korean-speaking financial advisors for retirement planning, investment strategies, wealth management, and comprehensive financial planning.' },
    ],
  },
  {
    slug: 'food',
    nameKo: '식당',
    nameEn: 'Food & Dining',
    descriptionKo: '한인 식당, 카페, 베이커리, 마켓 등 한인 음식점 정보를 찾아보세요. 정통 한식부터 일식, 중식, 분식, 치킨까지 다양한 한인 맛집을 평점, 리뷰, 메뉴와 함께 확인하세요. 한국 식재료를 구매할 수 있는 마켓 정보도 함께 제공합니다.',
    descriptionEn: 'Discover Korean restaurants, cafes, bakeries, and grocery stores. From authentic Korean BBQ to Japanese, Chinese, and fusion cuisine — find the best Korean dining spots with ratings, reviews, and menus. Also browse Korean grocery stores for specialty ingredients.',
    subcategories: [
      { slug: 'korean-bbq', nameKo: '한식BBQ', nameEn: 'Korean BBQ', descriptionKo: '갈비, 삼겹살, 불고기 등 숯불 한식 BBQ 전문점을 찾아보세요. 직화구이의 풍미를 즐기고 평점과 리뷰로 인기 맛집을 확인하세요.', descriptionEn: 'Find Korean BBQ restaurants serving galbi, samgyeopsal, and bulgogi grilled over charcoal. Check ratings and reviews to discover popular spots.' },
      { slug: 'korean-restaurant', nameKo: '한식', nameEn: 'Korean Restaurant', descriptionKo: '국밥, 찌개, 비빔밥, 냉면, 한정식 등 정통 한식 전문점을 찾아보세요. 집밥 같은 한국 가정식부터 고급 한정식까지 다양한 한식을 즐기세요.', descriptionEn: 'Find Korean restaurants serving authentic dishes like bibimbap, stew, noodles, and traditional Korean course meals. From home-style cooking to fine dining.' },
      { slug: 'japanese-restaurant', nameKo: '일식', nameEn: 'Japanese Restaurant', descriptionKo: '한인이 운영하는 일식 전문점을 찾아보세요. 스시, 사시미, 라멘, 우동, 이자카야 등 신선한 일식을 한국어로 주문할 수 있습니다.', descriptionEn: 'Find Korean-run Japanese restaurants serving sushi, sashimi, ramen, udon, and izakaya-style dishes. Order in Korean for a comfortable dining experience.' },
      { slug: 'chinese-restaurant', nameKo: '중식', nameEn: 'Chinese Restaurant', descriptionKo: '한인이 운영하는 중식 전문점을 찾아보세요. 짜장면, 짬뽕, 탕수육, 딤섬 등 한국식 중화요리를 한국어로 편하게 주문하세요.', descriptionEn: 'Find Korean-run Chinese restaurants serving jajangmyeon, jjamppong, sweet and sour pork, and dim sum. Korean-style Chinese cuisine with Korean-speaking service.' },
      { slug: 'western-restaurant', nameKo: '양식', nameEn: 'Western Restaurant', descriptionKo: '한인이 운영하는 양식 전문점을 찾아보세요. 스테이크, 파스타, 피자, 버거, 브런치 등 서양 요리를 한국적 감각으로 즐기세요.', descriptionEn: 'Find Korean-run Western restaurants serving steak, pasta, pizza, burgers, and brunch. Enjoy Western cuisine with a Korean touch and Korean-speaking staff.' },
      { slug: 'snack-bar', nameKo: '분식', nameEn: 'Snack Bar', descriptionKo: '떡볶이, 김밥, 튀김, 라면 등 한국 분식 전문점을 찾아보세요. 간편하고 맛있는 한국 길거리 음식을 가까운 곳에서 즐기세요.', descriptionEn: 'Find Korean snack bars serving tteokbokki, kimbap, fried foods, and ramyeon. Enjoy quick and delicious Korean street food near you.' },
      { slug: 'bakery', nameKo: '베이커리', nameEn: 'Bakery', descriptionKo: '한인 베이커리, 떡집, 제과점을 찾아보세요. 한국식 빵, 케이크, 떡, 과자를 구매하고 생일·잔치 주문도 한국어로 편하게 하세요.', descriptionEn: 'Find Korean bakeries and rice cake shops. Buy Korean-style bread, cakes, rice cakes, and pastries. Place custom orders for birthdays and celebrations.' },
      { slug: 'cafe', nameKo: '카페', nameEn: 'Cafe', descriptionKo: '한인 카페와 디저트 전문점을 찾아보세요. 한국식 커피, 빙수, 버블티, 디저트를 즐기며 아늑한 분위기에서 휴식하세요.', descriptionEn: 'Find Korean cafes and dessert shops. Enjoy Korean-style coffee, bingsu, bubble tea, and desserts in a cozy atmosphere.' },
      { slug: 'grocery', nameKo: '마켓', nameEn: 'Grocery', descriptionKo: '한인 마켓과 식품점을 찾아보세요. 한국 식재료, 라면, 김치, 반찬, 한국 과자, 음료를 구매할 수 있는 가까운 한인 마켓 정보를 확인하세요.', descriptionEn: 'Find Korean grocery stores and markets. Buy Korean ingredients, ramen, kimchi, side dishes, snacks, and beverages at a Korean market near you.' },
      { slug: 'nightlife', nameKo: '나이트라이프', nameEn: 'Nightlife', descriptionKo: '한인 노래방, 바, 주점, 라운지를 찾아보세요. 한국 노래를 부를 수 있는 노래방과 한국식 안주를 즐길 수 있는 한인 바를 확인하세요.', descriptionEn: 'Find Korean karaoke rooms, bars, lounges, and pubs. Sing K-pop hits at noraebang or enjoy Korean bar snacks and drinks at a Korean nightlife spot.' },
      { slug: 'chicken-pizza', nameKo: '치킨/피자', nameEn: 'Chicken & Pizza', descriptionKo: '한국식 치킨과 피자 전문점을 찾아보세요. 양념치킨, 후라이드치킨, 한국식 피자 등 배달·포장 가능한 한인 치킨 전문점을 확인하세요.', descriptionEn: 'Find Korean-style fried chicken and pizza shops. Order yangnyeom chicken, fried chicken, and Korean pizza for delivery or pickup.' },
    ],
  },
  {
    slug: 'beauty',
    nameKo: '뷰티',
    nameEn: 'Beauty',
    descriptionKo: '한국어 상담 가능한 미용실, 네일샵, 스킨케어, 스파, 화장품 전문점을 찾아보세요. 원하는 스타일을 모국어로 정확하게 전달하고, 한국 뷰티 트렌드에 정통한 전문가의 서비스를 받으세요. 평점과 리뷰로 믿을 수 있는 뷰티샵을 선택하세요.',
    descriptionEn: 'Find Korean-speaking hair salons, nail shops, skin care clinics, spas, and cosmetics stores. Communicate your desired look precisely in Korean and get services from professionals who know Korean beauty trends.',
    subcategories: [
      { slug: 'hair-salon', nameKo: '미용실', nameEn: 'Hair Salon', descriptionKo: '한국어 상담 가능한 미용실을 찾아보세요. 커트, 펌, 염색, 스타일링 등 원하는 헤어스타일을 모국어로 정확하게 전달하고 한국 트렌드 시술을 받으세요.', descriptionEn: 'Find Korean-speaking hair salons for cuts, perms, coloring, and styling. Describe your desired look precisely in Korean and get trendy Korean hairstyles.' },
      { slug: 'barbershop', nameKo: '이발소', nameEn: 'Barbershop', descriptionKo: '한국어 소통 가능한 이발소를 찾아보세요. 남성 헤어컷, 면도, 스타일링 서비스를 모국어로 편안하게 받으세요.', descriptionEn: 'Find Korean-speaking barbershops for men\'s haircuts, shaves, and styling. Get your preferred look with comfortable communication in Korean.' },
      { slug: 'skin-care', nameKo: '스킨케어', nameEn: 'Skin Care', descriptionKo: '한국어 상담 가능한 스킨케어·피부관리 전문점입니다. 얼굴 관리, 피부 트러블 케어, 안티에이징, 영구화장 등 한국식 피부 관리를 받으세요.', descriptionEn: 'Find Korean-speaking skin care clinics for facials, acne treatment, anti-aging care, and Korean beauty treatments from trained estheticians.' },
      { slug: 'spa', nameKo: '스파', nameEn: 'Spa', descriptionKo: '한인 스파, 사우나, 찜질방, 마사지 전문점을 찾아보세요. 한국식 때밀이, 찜질방 체험, 아로마 마사지 등 힐링 서비스를 이용하세요.', descriptionEn: 'Find Korean spas, saunas, jjimjilbangs, and massage parlors. Experience Korean scrub baths, sauna rooms, and relaxation treatments.' },
      { slug: 'nail-salon', nameKo: '네일샵', nameEn: 'Nail Salon', descriptionKo: '한국어 소통 가능한 네일샵을 찾아보세요. 매니큐어, 페디큐어, 젤네일, 네일아트 등 원하는 디자인을 모국어로 정확하게 전달하세요.', descriptionEn: 'Find Korean-speaking nail salons for manicures, pedicures, gel nails, and nail art. Describe your desired design precisely in Korean.' },
      { slug: 'cosmetics', nameKo: '화장품', nameEn: 'Cosmetics', descriptionKo: '한국 화장품과 뷰티 제품을 판매하는 한인 매장을 찾아보세요. K-뷰티 스킨케어, 메이크업, 마스크팩 등 한국 인기 제품을 구매하세요.', descriptionEn: 'Find Korean cosmetics stores selling K-beauty skincare, makeup, sheet masks, and trending Korean beauty products near you.' },
    ],
  },
  {
    slug: 'auto',
    nameKo: '자동차',
    nameEn: 'Auto Services',
    descriptionKo: '한국어 상담 가능한 자동차 수리, 매매, 렌탈, 세차, 타이어, 토잉 전문 업소를 찾아보세요. 수리 내용과 비용을 모국어로 정확하게 이해하고, 신뢰할 수 있는 한인 정비소를 평점과 리뷰로 선택하세요.',
    descriptionEn: 'Find Korean-speaking auto repair shops, car dealers, rentals, car washes, tire shops, and towing services. Understand repair details and costs clearly in Korean. Choose trusted shops by checking ratings and reviews.',
    subcategories: [
      { slug: 'auto-repair', nameKo: '자동차수리', nameEn: 'Auto Repair', descriptionKo: '한국어 상담 가능한 자동차 정비소를 찾아보세요. 엔진, 브레이크, 오일교환, 종합검사 등 수리 내용과 비용을 모국어로 정확하게 확인하세요.', descriptionEn: 'Find Korean-speaking auto repair shops for engine, brakes, oil changes, and inspections. Understand repair details and costs clearly in Korean.' },
      { slug: 'body-shop', nameKo: '바디샵', nameEn: 'Body Shop', descriptionKo: '한국어 상담 가능한 자동차 바디샵입니다. 사고 수리, 판금, 도색, 범퍼 교체 등 외관 수리를 모국어로 상담하고 보험 처리를 도와받으세요.', descriptionEn: 'Find Korean-speaking auto body shops for collision repair, dent removal, painting, and bumper replacement. Get help with insurance claims in Korean.' },
      { slug: 'car-dealer', nameKo: '자동차매매', nameEn: 'Car Dealer', descriptionKo: '한국어 상담 가능한 자동차 딜러를 찾아보세요. 신차·중고차 구매, 리스, 할부 조건을 모국어로 비교하고 최적의 차량을 선택하세요.', descriptionEn: 'Find Korean-speaking car dealers for new and used vehicle purchases, leases, and financing. Compare deals and negotiate in your native language.' },
      { slug: 'car-wash', nameKo: '세차', nameEn: 'Car Wash', descriptionKo: '한인 세차장을 찾아보세요. 외부 세차, 실내 클리닝, 왁싱, 디테일링 서비스를 이용하고 가까운 세차장 위치와 가격을 확인하세요.', descriptionEn: 'Find Korean car wash services for exterior washing, interior cleaning, waxing, and detailing. Check nearby locations and pricing.' },
      { slug: 'tires', nameKo: '타이어', nameEn: 'Tires', descriptionKo: '한국어 상담 가능한 타이어 전문점입니다. 타이어 교체, 수리, 휠 얼라인먼트, 밸런싱 서비스를 모국어로 상담하고 적합한 타이어를 추천받으세요.', descriptionEn: 'Find Korean-speaking tire shops for tire replacement, repair, wheel alignment, and balancing. Get tire recommendations in your language.' },
      { slug: 'towing', nameKo: '토잉', nameEn: 'Towing', descriptionKo: '한국어 소통 가능한 토잉(견인) 서비스를 찾아보세요. 차량 고장, 사고, 잠금 등 긴급 상황에서 모국어로 빠르게 도움을 요청하세요.', descriptionEn: 'Find Korean-speaking towing services for breakdowns, accidents, and lockouts. Request emergency roadside assistance quickly in Korean.' },
      { slug: 'car-rental', nameKo: '렌터카', nameEn: 'Car Rental', descriptionKo: '한국어 서비스 가능한 렌터카 업체를 찾아보세요. 단기·장기 렌트, 공항 픽업, 보험 옵션을 모국어로 상담하고 예약하세요.', descriptionEn: 'Find Korean-speaking car rental companies for short-term and long-term rentals, airport pickup, and insurance options. Book in Korean.' },
      { slug: 'taxi', nameKo: '택시', nameEn: 'Taxi', descriptionKo: '한국어 소통 가능한 택시·리무진·셔틀 서비스를 찾아보세요. 공항 이동, 장거리 운행, 관광 투어를 한국어로 편하게 예약하세요.', descriptionEn: 'Find Korean-speaking taxi, limousine, and shuttle services for airport transfers, long-distance rides, and sightseeing tours. Book comfortably in Korean.' },
    ],
  },
  {
    slug: 'home-services',
    nameKo: '주택서비스',
    nameEn: 'Home Services',
    descriptionKo: '한국어 상담 가능한 배관, 전기, 지붕, 청소, 이사, 건축, 페인트 등 주택 서비스 업체를 찾아보세요. 작업 범위와 비용을 모국어로 명확하게 합의하고, 신뢰할 수 있는 한인 전문가에게 집수리를 맡기세요.',
    descriptionEn: 'Find Korean-speaking plumbers, electricians, roofers, cleaners, movers, contractors, and painters. Agree on scope and pricing clearly in Korean. Trust Korean home service professionals with your property.',
    subcategories: [
      { slug: 'plumbing', nameKo: '배관', nameEn: 'Plumbing', descriptionKo: '한국어 상담 가능한 배관 전문 업체입니다. 수도 수리, 배수관 청소, 온수기 교체, 보일러 수리를 모국어로 상담하고 견적받으세요.', descriptionEn: 'Find Korean-speaking plumbers for pipe repair, drain cleaning, water heater replacement, and boiler service. Get estimates in Korean.' },
      { slug: 'hvac', nameKo: '냉난방', nameEn: 'HVAC', descriptionKo: '한국어 상담 가능한 냉난방 전문 업체를 찾아보세요. 에어컨 설치·수리, 히터, 보일러, 환기 시스템 관리를 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking HVAC technicians for AC installation and repair, heating, boiler, and ventilation system maintenance.' },
      { slug: 'roofing', nameKo: '지붕', nameEn: 'Roofing', descriptionKo: '한국어 상담 가능한 지붕 공사 전문 업체입니다. 지붕 수리, 교체, 누수 점검, 루핑 재료 설치를 모국어로 상담하고 견적받으세요.', descriptionEn: 'Find Korean-speaking roofing contractors for roof repair, replacement, leak inspection, and material installation. Get free estimates in Korean.' },
      { slug: 'cleaning', nameKo: '청소', nameEn: 'Cleaning', descriptionKo: '한국어 소통 가능한 청소 서비스 업체를 찾아보세요. 가정집 청소, 이사 전후 청소, 사무실 청소, 정기 청소를 모국어로 예약하세요.', descriptionEn: 'Find Korean-speaking cleaning services for home cleaning, move-in/move-out cleaning, office cleaning, and regular maintenance. Book in Korean.' },
      { slug: 'electrical', nameKo: '전기', nameEn: 'Electrical', descriptionKo: '한국어 상담 가능한 전기 공사 전문 업체입니다. 전기 배선, 조명 설치, 전기 수리, 패널 업그레이드를 모국어로 안전하게 상담하세요.', descriptionEn: 'Find Korean-speaking electricians for wiring, lighting installation, electrical repairs, and panel upgrades. Discuss safety requirements in Korean.' },
      { slug: 'landscaping', nameKo: '조경', nameEn: 'Landscaping', descriptionKo: '한국어 상담 가능한 조경·정원 관리 업체를 찾아보세요. 잔디 관리, 나무 심기, 정원 설계, 스프링클러 설치를 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking landscapers for lawn care, tree planting, garden design, and sprinkler installation. Plan your outdoor space in Korean.' },
      { slug: 'moving', nameKo: '이삿짐', nameEn: 'Moving', descriptionKo: '한국어 소통 가능한 이삿짐·이사 업체를 찾아보세요. 가정·사무실 이사, 포장, 보관, 장거리 이사를 모국어로 견적받고 예약하세요.', descriptionEn: 'Find Korean-speaking moving companies for residential and office moves, packing, storage, and long-distance relocation. Get quotes in Korean.' },
      { slug: 'construction', nameKo: '건축', nameEn: 'Construction', descriptionKo: '한국어 상담 가능한 건축·인테리어 전문 업체입니다. 신축, 리모델링, 인테리어, 주방·욕실 공사를 모국어로 설계·상담하세요.', descriptionEn: 'Find Korean-speaking contractors for new construction, remodeling, interior design, and kitchen/bathroom renovations. Plan projects in Korean.' },
      { slug: 'painting', nameKo: '페인트', nameEn: 'Painting', descriptionKo: '한국어 상담 가능한 페인트·도배 전문 업체를 찾아보세요. 실내외 페인팅, 도배, 벽지 시공, 색상 상담을 모국어로 받으세요.', descriptionEn: 'Find Korean-speaking painters for interior and exterior painting, wallpaper installation, and color consultations. Get estimates in Korean.' },
      { slug: 'carpet', nameKo: '카펫', nameEn: 'Carpet', descriptionKo: '한국어 상담 가능한 카펫·바닥재 전문 업체입니다. 카펫 설치, 마루·타일 공사, 블라인드 설치를 모국어로 상담하고 견적받으세요.', descriptionEn: 'Find Korean-speaking flooring specialists for carpet, hardwood, tile installation, and window blinds. Get estimates and consultations in Korean.' },
      { slug: 'locksmith', nameKo: '열쇠', nameEn: 'Locksmith', descriptionKo: '한국어 소통 가능한 열쇠·잠금장치 전문 업체입니다. 잠금 해제, 열쇠 복사, 도어락 설치, 금고 서비스를 모국어로 요청하세요.', descriptionEn: 'Find Korean-speaking locksmiths for lockouts, key duplication, smart lock installation, and safe services. Request help quickly in Korean.' },
      { slug: 'pest-control', nameKo: '해충방제', nameEn: 'Pest Control', descriptionKo: '한국어 상담 가능한 해충 방제 업체를 찾아보세요. 바퀴벌레, 개미, 쥐, 터마이트 방제를 모국어로 상담하고 정기 관리를 예약하세요.', descriptionEn: 'Find Korean-speaking pest control companies for roach, ant, rodent, and termite treatment. Schedule regular maintenance in Korean.' },
      { slug: 'laundry', nameKo: '세탁', nameEn: 'Laundry', descriptionKo: '한인 세탁소와 드라이클리닝 전문점을 찾아보세요. 일반 세탁, 드라이클리닝, 옷수선, 고급 의류 관리를 한국어로 편하게 맡기세요.', descriptionEn: 'Find Korean dry cleaners and laundry services for everyday laundry, dry cleaning, alterations, and garment care with Korean-speaking staff.' },
      { slug: 'shipping', nameKo: '택배', nameEn: 'Shipping', descriptionKo: '한국어 서비스 가능한 택배·화물 운송 업체입니다. 한국행 택배, 국제 배송, 이사 화물, 우편 서비스를 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking shipping and courier services for packages to Korea, international shipping, moving freight, and postal services.' },
      { slug: 'handyman', nameKo: '핸디맨', nameEn: 'Handyman', descriptionKo: '한국어 소통 가능한 핸디맨·집수리 전문가를 찾아보세요. 소규모 수리, 가구 조립, 선반 설치 등 다양한 집수리를 모국어로 요청하세요.', descriptionEn: 'Find Korean-speaking handymen for small repairs, furniture assembly, shelf mounting, and various home maintenance tasks. Request help in Korean.' },
    ],
  },
  {
    slug: 'education',
    nameKo: '교육',
    nameEn: 'Education',
    descriptionKo: '한국어 교육 가능한 학원, 어학원, SAT, 유치원, 운전학원, 음악학원, 태권도장을 찾아보세요. 학부모와의 원활한 소통은 물론 한국식 교육 방법과 커리큘럼을 제공하는 한인 교육기관 정보를 확인하세요.',
    descriptionEn: 'Find Korean-speaking academies, language schools, SAT prep, preschools, driving schools, music schools, and martial arts studios. Korean educational institutions provide strong parent communication and Korean teaching methods.',
    subcategories: [
      { slug: 'tutoring', nameKo: '학원', nameEn: 'Tutoring', descriptionKo: '한국어 수업 가능한 학원과 과외 선생님을 찾아보세요. 수학, 영어, 과학, 한국어, 입시 준비 등 맞춤형 학습을 한국어로 지도받으세요.', descriptionEn: 'Find Korean-speaking tutoring academies for math, English, science, Korean language, and college prep. Get personalized instruction in Korean.' },
      { slug: 'language-school', nameKo: '어학원', nameEn: 'Language School', descriptionKo: '한국어·영어 교육 전문 어학원을 찾아보세요. 한글학교, ESL, TOEFL, 어린이 영어, 성인 영어 프로그램을 한국어로 상담하세요.', descriptionEn: 'Find Korean and English language schools including Korean heritage schools, ESL, TOEFL prep, and children\'s and adult English programs.' },
      { slug: 'sat-prep', nameKo: 'SAT학원', nameEn: 'SAT Prep', descriptionKo: '한국어 지도 가능한 SAT·ACT·AP 전문 학원입니다. 한국식 체계적 입시 전략과 맞춤 커리큘럼으로 목표 점수를 달성하세요.', descriptionEn: 'Find Korean-speaking SAT, ACT, and AP prep academies. Achieve target scores with systematic Korean-style test preparation and customized curricula.' },
      { slug: 'preschool', nameKo: '유치원', nameEn: 'Preschool', descriptionKo: '한국어 교육 가능한 유치원·어린이집을 찾아보세요. 이중언어 교육, 한국 문화 프로그램, 안전한 보육 환경을 한국어로 상담하세요.', descriptionEn: 'Find Korean-speaking preschools and daycares offering bilingual education, Korean cultural programs, and safe childcare environments.' },
      { slug: 'driving-school', nameKo: '운전학원', nameEn: 'Driving School', descriptionKo: '한국어 수업 가능한 운전학원을 찾아보세요. 초보 운전, 면허 시험 준비, 교통법규를 모국어로 배워 안전하게 운전을 시작하세요.', descriptionEn: 'Find Korean-speaking driving schools for beginner lessons, license test prep, and traffic law education. Learn to drive with instruction in Korean.' },
      { slug: 'music-school', nameKo: '음악학원', nameEn: 'Music School', descriptionKo: '한국어 레슨 가능한 음악학원과 악기 교습소를 찾아보세요. 피아노, 바이올린, 기타, 성악, 작곡 등 음악 교육을 모국어로 받으세요.', descriptionEn: 'Find Korean-speaking music schools for piano, violin, guitar, voice, and composition lessons. Learn music with instruction in Korean.' },
      { slug: 'martial-arts', nameKo: '태권도', nameEn: 'Martial Arts', descriptionKo: '한국어 지도 가능한 태권도장·무술 학원을 찾아보세요. 태권도, 합기도, 검도 등 한국 전통 무예를 배우고 심신을 단련하세요.', descriptionEn: 'Find Korean-speaking martial arts studios for Taekwondo, Hapkido, and Kumdo. Train body and mind with authentic Korean martial arts instruction.' },
      { slug: 'dance-school', nameKo: '댄스', nameEn: 'Dance School', descriptionKo: '한국어 레슨 가능한 댄스 학원을 찾아보세요. K-pop 댄스, 발레, 현대무용, 사교댄스 등 다양한 댄스 프로그램을 모국어로 수강하세요.', descriptionEn: 'Find Korean-speaking dance studios for K-pop dance, ballet, contemporary, and social dance classes. Learn to dance with instruction in Korean.' },
    ],
  },
  {
    slug: 'travel',
    nameKo: '여행',
    nameEn: 'Travel',
    descriptionKo: '한국어 상담 가능한 여행사, 항공사, 호텔 예약 서비스를 찾아보세요. 한국행 항공권, 패키지 여행, 비자 대행, 현지 투어를 모국어로 상담하고 예약하세요. 복잡한 일정 조율과 비용 비교도 한국어로 편하게 하세요.',
    descriptionEn: 'Find Korean-speaking travel agencies, airlines, and hotel booking services. Book flights to Korea, package tours, and visa assistance in your language. Compare itineraries and prices with easy communication in Korean.',
    subcategories: [
      { slug: 'travel-agency', nameKo: '여행사', nameEn: 'Travel Agency', descriptionKo: '한국어 상담 가능한 여행사를 찾아보세요. 한국행 항공권, 패키지 투어, 허니문, 크루즈, 비자 대행 등 여행 계획을 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking travel agencies for flights to Korea, package tours, honeymoons, cruises, and visa services. Plan your trip in Korean.' },
      { slug: 'airline', nameKo: '항공사', nameEn: 'Airline', descriptionKo: '한국어 서비스 가능한 항공사 예약 대리점을 찾아보세요. 한국행·국제선 항공권 예약, 좌석 변경, 마일리지 관리를 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking airline booking agents for flights to Korea and international destinations. Manage reservations, seat changes, and mileage in Korean.' },
      { slug: 'hotel', nameKo: '호텔', nameEn: 'Hotel', descriptionKo: '한국어 서비스 가능한 호텔·숙박 예약 서비스입니다. 호텔, 모텔, 민박, 리조트 예약을 모국어로 상담하고 특가 요금을 확인하세요.', descriptionEn: 'Find Korean-speaking hotel and accommodation booking services. Reserve hotels, motels, B&Bs, and resorts with special rates through Korean agents.' },
    ],
  },
  {
    slug: 'professional',
    nameKo: '전문서비스',
    nameEn: 'Professional Services',
    descriptionKo: '한국어 상담 가능한 사진관, 인쇄소, 번역, 광고, 간판, 웨딩, 장례 등 전문 서비스 업체를 찾아보세요. 세부 요구사항을 모국어로 정확하게 전달하고, 한인 전문가의 맞춤 서비스를 받으세요.',
    descriptionEn: 'Find Korean-speaking photography studios, printers, translators, ad agencies, signage makers, wedding planners, and funeral services. Communicate your needs precisely in Korean for customized professional services.',
    subcategories: [
      { slug: 'printing', nameKo: '인쇄', nameEn: 'Printing', descriptionKo: '한국어 서비스 가능한 인쇄소를 찾아보세요. 명함, 전단지, 브로셔, 현수막, 한국어 인쇄물을 모국어로 주문하고 디자인 상담을 받으세요.', descriptionEn: 'Find Korean-speaking print shops for business cards, flyers, brochures, banners, and Korean-language print materials. Consult on design in Korean.' },
      { slug: 'photography', nameKo: '사진', nameEn: 'Photography', descriptionKo: '한국어 소통 가능한 사진관·스튜디오를 찾아보세요. 가족사진, 졸업사진, 여권사진, 돌잔치, 이벤트 촬영을 모국어로 예약하세요.', descriptionEn: 'Find Korean-speaking photography studios for family portraits, graduation photos, passport photos, first birthday (doljanchi), and event photography.' },
      { slug: 'translation', nameKo: '번역', nameEn: 'Translation', descriptionKo: '한국어-영어 전문 번역·통역 서비스를 찾아보세요. 문서 번역, 공증 번역, 법정 통역, 비즈니스 통역 등 정확한 번역 서비스를 이용하세요.', descriptionEn: 'Find Korean-English translation and interpretation services for documents, certified translations, court interpreting, and business interpreting.' },
      { slug: 'advertising', nameKo: '광고', nameEn: 'Advertising', descriptionKo: '한국어 서비스 가능한 광고·마케팅 대행사를 찾아보세요. 한인 타겟 광고, 웹사이트 제작, SNS 마케팅, 홈페이지 디자인을 상담하세요.', descriptionEn: 'Find Korean-speaking ad agencies for Korean community marketing, website design, social media marketing, and digital advertising services.' },
      { slug: 'signage', nameKo: '간판', nameEn: 'Signage', descriptionKo: '한국어 서비스 가능한 간판 제작 업체입니다. 한글 간판, LED 사인, 네온사인, 배너, 실내외 간판을 디자인하고 설치하세요.', descriptionEn: 'Find Korean-speaking sign makers for Korean signage, LED signs, neon signs, banners, and indoor/outdoor business signs.' },
      { slug: 'wedding', nameKo: '웨딩', nameEn: 'Wedding', descriptionKo: '한국어 상담 가능한 웨딩 서비스 업체를 찾아보세요. 웨딩 플래닝, 예식장, 한복 대여, 혼수용품 등 결혼 준비를 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking wedding services for planning, venues, hanbok rental, and wedding supplies. Prepare for your special day in Korean.' },
      { slug: 'funeral', nameKo: '장례', nameEn: 'Funeral', descriptionKo: '한국어 서비스 가능한 장례 서비스 업체입니다. 한국식 장례 절차, 묘지, 화장, 추모 서비스를 모국어로 편안하게 상담하세요.', descriptionEn: 'Find Korean-speaking funeral services for Korean-style ceremonies, burial, cremation, and memorial services. Handle arrangements comfortably in Korean.' },
    ],
  },
  {
    slug: 'shopping',
    nameKo: '쇼핑',
    nameEn: 'Shopping',
    descriptionKo: '한인 전자제품, 가구, 의류, 보석, 안경, 서점, 꽃집 등 한인 상점을 찾아보세요. 한국 제품을 구매하고, 한국어로 상품 문의, 교환, 환불을 편하게 처리하세요. 가까운 한인 쇼핑 매장 정보를 확인하세요.',
    descriptionEn: 'Find Korean electronics stores, furniture shops, clothing stores, jewelers, optical shops, bookstores, and florists. Shop for Korean products and handle inquiries, exchanges, and returns in Korean.',
    subcategories: [
      { slug: 'electronics', nameKo: '전자제품', nameEn: 'Electronics', descriptionKo: '한국어 서비스 가능한 전자제품·컴퓨터 매장을 찾아보세요. 컴퓨터 수리, 휴대폰, 가전제품 구매와 기술 상담을 모국어로 받으세요.', descriptionEn: 'Find Korean-speaking electronics and computer stores for PC repair, mobile phones, appliances, and tech support in your native language.' },
      { slug: 'furniture', nameKo: '가구', nameEn: 'Furniture', descriptionKo: '한인 가구점을 찾아보세요. 거실, 침실, 주방, 사무실 가구와 인테리어 소품을 한국어로 상담하고 배송·설치 서비스를 이용하세요.', descriptionEn: 'Find Korean furniture stores for living room, bedroom, kitchen, and office furniture. Get delivery, installation, and interior design advice in Korean.' },
      { slug: 'clothing', nameKo: '의류', nameEn: 'Clothing', descriptionKo: '한인 의류 매장을 찾아보세요. 한국 패션, 한복, 양복 맞춤, 유니폼 등 한국 스타일 의류를 구매하고 사이즈 상담을 받으세요.', descriptionEn: 'Find Korean clothing stores for Korean fashion, hanbok, custom suits, and uniforms. Get styling and sizing advice from Korean-speaking staff.' },
      { slug: 'jewelry', nameKo: '보석', nameEn: 'Jewelry', descriptionKo: '한인 보석상과 귀금속 전문점을 찾아보세요. 반지, 목걸이, 시계, 금매입, 보석 수리를 한국어로 상담하고 맞춤 제작을 의뢰하세요.', descriptionEn: 'Find Korean jewelers for rings, necklaces, watches, gold buying, and jewelry repair. Get custom jewelry made with consultations in Korean.' },
      { slug: 'optical', nameKo: '안경', nameEn: 'Optical', descriptionKo: '한국어 서비스 가능한 안경원을 찾아보세요. 안경, 선글라스, 콘택트렌즈 구매와 시력 검사를 모국어로 편안하게 상담하세요.', descriptionEn: 'Find Korean-speaking optical shops for eyeglasses, sunglasses, contact lenses, and eye exams with comfortable communication in Korean.' },
      { slug: 'bookstore', nameKo: '서점', nameEn: 'Bookstore', descriptionKo: '한국 서적과 교재를 판매하는 한인 서점을 찾아보세요. 한국어 도서, 학습 교재, 어린이 책, 잡지를 구매하세요.', descriptionEn: 'Find Korean bookstores selling Korean-language books, textbooks, children\'s books, and magazines for the Korean-speaking community.' },
      { slug: 'florist', nameKo: '꽃집', nameEn: 'Florist', descriptionKo: '한인 꽃집을 찾아보세요. 축하 화환, 근조 화환, 생일 꽃다발, 이벤트 장식을 한국어로 주문하고 배달 서비스를 이용하세요.', descriptionEn: 'Find Korean florists for celebration wreaths, sympathy arrangements, birthday bouquets, and event decorations. Order and deliver flowers in Korean.' },
    ],
  },
  {
    slug: 'community',
    nameKo: '커뮤니티',
    nameEn: 'Community',
    descriptionKo: '한인 교회, 사찰, 커뮤니티 단체, 양로원, 언론사, 피트니스 센터 등 한인 커뮤니티 기관을 찾아보세요. 미국 한인 사회의 네트워크와 지원 서비스를 활용하고, 한인 행사와 모임 정보를 확인하세요.',
    descriptionEn: 'Find Korean churches, temples, community organizations, senior centers, media outlets, and fitness centers. Connect with the Korean-American community network, access support services, and find events and gatherings.',
    subcategories: [
      { slug: 'church', nameKo: '교회', nameEn: 'Church', descriptionKo: '한인 교회와 성당을 찾아보세요. 한국어 예배, 성경공부, 청년부, 교육부 등 한인 교회의 다양한 프로그램과 주소·예배시간을 확인하세요.', descriptionEn: 'Find Korean churches and Catholic parishes with Korean-language services, Bible study, youth groups, and educational programs. Check service times.' },
      { slug: 'temple', nameKo: '사찰', nameEn: 'Temple', descriptionKo: '한인 사찰과 불교 사원을 찾아보세요. 한국어 법회, 명상, 템플스테이, 불교 행사 일정과 주소를 확인하세요.', descriptionEn: 'Find Korean Buddhist temples for Korean-language dharma talks, meditation, temple stays, and Buddhist events. Check schedules and locations.' },
      { slug: 'organization', nameKo: '단체', nameEn: 'Organization', descriptionKo: '한인 단체, 동창회, 동호회, 봉사기관, 공공기관을 찾아보세요. 한인 커뮤니티 네트워크에 참여하고 다양한 지원 서비스를 이용하세요.', descriptionEn: 'Find Korean community organizations, alumni associations, clubs, volunteer groups, and public institutions. Join the Korean-American community network.' },
      { slug: 'senior-center', nameKo: '양로원', nameEn: 'Senior Center', descriptionKo: '한인 양로원과 노인복지 시설을 찾아보세요. 한국어 소통 가능한 시설에서 어르신들이 편안하게 생활하고 다양한 복지 서비스를 받으세요.', descriptionEn: 'Find Korean-speaking senior centers and elder care facilities where Korean seniors can live comfortably and access welfare services in their language.' },
      { slug: 'media', nameKo: '언론', nameEn: 'Media', descriptionKo: '한인 신문사, 방송국, TV, 라디오, 온라인 미디어를 찾아보세요. 한인 커뮤니티 뉴스와 정보를 한국어로 접하세요.', descriptionEn: 'Find Korean newspapers, TV stations, radio stations, and online media outlets serving the Korean-American community with news in Korean.' },
      { slug: 'fitness', nameKo: '헬스/피트니스', nameEn: 'Fitness', descriptionKo: '한국어 소통 가능한 헬스장·피트니스 센터를 찾아보세요. 헬스, 요가, 필라테스, 크로스핏 등 운동 프로그램을 모국어로 상담하세요.', descriptionEn: 'Find Korean-speaking fitness centers and gyms for weight training, yoga, Pilates, and CrossFit. Discuss fitness programs and goals in Korean.' },
    ],
  },
];

// Get all categories as flat list
export function getAllCategories(): { slug: string; nameKo: string; nameEn: string; level: string; parentSlug?: string }[] {
  const result: { slug: string; nameKo: string; nameEn: string; level: string; parentSlug?: string }[] = [];

  for (const primary of PRIMARY_CATEGORIES) {
    result.push({
      slug: primary.slug,
      nameKo: primary.nameKo,
      nameEn: primary.nameEn,
      level: 'primary',
    });

    for (const sub of primary.subcategories) {
      result.push({
        slug: sub.slug,
        nameKo: sub.nameKo,
        nameEn: sub.nameEn,
        level: 'sub',
        parentSlug: primary.slug,
      });
    }
  }

  return result;
}

// Get primary category by slug
export function getPrimaryCategory(slug: string): PrimaryCategory | undefined {
  return PRIMARY_CATEGORIES.find(c => c.slug === slug);
}

// Get subcategory by slug
export function getSubcategory(slug: string): { subcategory: SubCategory; primary: PrimaryCategory } | undefined {
  for (const primary of PRIMARY_CATEGORIES) {
    const sub = primary.subcategories.find(s => s.slug === slug);
    if (sub) {
      return { subcategory: sub, primary };
    }
  }
  return undefined;
}

// Check if a slug is a primary category
export function isPrimaryCategory(slug: string): boolean {
  return PRIMARY_CATEGORIES.some(c => c.slug === slug);
}

// Check if a slug is a subcategory
export function isSubcategory(slug: string): boolean {
  return PRIMARY_CATEGORIES.some(p => p.subcategories.some(s => s.slug === slug));
}
