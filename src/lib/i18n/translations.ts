export type Locale = 'ko' | 'en';

const translations = {
  ko: {
    nav: {
      about: '회사소개',
      products: '제품소개',
      projects: '프로젝트',
      resources: '자료실',
      support: '고객지원',
    },
    navSub: {
      greeting: '인사말',
      history: '연혁',
      certificates: '인증서',
      location: '오시는 길',
      notices: '공지사항',
      inquiry: '문의하기',
    },
    hero: {
      subtitle: 'Bathroom Accessories',
      description: '1999년부터 이어온 욕실 악세서리의 신뢰,\n국산 품질을 고집하는 B2B 전문 카탈로그',
      cta: '제품 보기',
    },
    home: {
      newArrivals: '신제품',
      newArrivalsLabel: 'New Arrivals',
      viewAll: '전체 보기',
      notice: '공지사항',
      noticeLabel: 'Notice',
      pinned: '공지',
    },
    stats: {
      years: '1999년 설립',
      yearsLabel: 'Years of History',
      korea: '나사 하나까지 국산',
      koreaLabel: 'Made in Korea',
      rd: '창의적 디자인 연구',
      rdLabel: 'Creative Design',
      b2b: '신뢰 기반 납품',
      b2bLabel: 'Trust & Service',
    },
    products: {
      title: '제품소개',
      label: 'Products',
      category: '제품 카테고리',
      backToList: '목록으로',
      productInfo: '제품 정보',
      drawingDownload: '도면 다운로드',
      relatedDocs: '관련 자료',
      download: '다운로드',
    },
    about: {
      title: '회사소개',
    },
    footer: {
      companyDesc: 'B2B 전문 위생도기 및\n욕실 악세서리 제조·납품',
      productsResources: '제품·자료',
      copyright: 'BANO. All rights reserved.',
    },
    common: {
      noImage: 'No Image',
      siteOpenNotice: '사이트 오픈 안내',
      catalogUpdate: '2026년 상반기 카탈로그 업데이트',
      holidayNotice: '설 연휴 배송 일정 안내',
    },
  },
  en: {
    nav: {
      about: 'About',
      products: 'Products',
      projects: 'Projects',
      resources: 'Resources',
      support: 'Support',
    },
    navSub: {
      greeting: 'Greeting',
      history: 'History',
      certificates: 'Certificates',
      location: 'Location',
      notices: 'Notices',
      inquiry: 'Contact Us',
    },
    hero: {
      subtitle: 'Bathroom Accessories',
      description: 'Trusted bathroom accessories since 1999,\nB2B professional catalog committed to Korean quality',
      cta: 'View Products',
    },
    home: {
      newArrivals: 'New Products',
      newArrivalsLabel: 'New Arrivals',
      viewAll: 'View All',
      notice: 'Notices',
      noticeLabel: 'Notice',
      pinned: 'PIN',
    },
    stats: {
      years: 'Est. 1999',
      yearsLabel: 'Years of History',
      korea: 'Every single screw',
      koreaLabel: 'Made in Korea',
      rd: 'Creative design R&D',
      rdLabel: 'Creative Design',
      b2b: 'Trust-based supply',
      b2bLabel: 'Trust & Service',
    },
    products: {
      title: 'Products',
      label: 'Products',
      category: 'Categories',
      backToList: 'Back',
      productInfo: 'Specifications',
      drawingDownload: 'Drawing Download',
      relatedDocs: 'Related Documents',
      download: 'Download',
    },
    about: {
      title: 'About Us',
    },
    footer: {
      companyDesc: 'B2B professional sanitary ware\n& bathroom accessories manufacturer',
      productsResources: 'Products & Resources',
      copyright: 'BANO. All rights reserved.',
    },
    common: {
      noImage: 'No Image',
      siteOpenNotice: 'Site Launch Notice',
      catalogUpdate: '2026 H1 Catalog Update',
      holidayNotice: 'Holiday Shipping Schedule',
    },
  },
};

export type Translations = typeof translations['ko'];

export function getTranslations(locale: Locale): Translations {
  return translations[locale] as Translations;
}

export default translations;
