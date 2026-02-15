import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# 한인맵 HaninMap
> Korean Business Directory for the United States, Canada, and Australia

## About
HaninMap (한인맵) is the most comprehensive directory of Korean-speaking businesses.
We help Korean Americans find doctors, dentists, lawyers, restaurants, and other professionals
who speak Korean. Our database includes 78,000+ verified business listings with contact
information, Google ratings, business hours, and user reviews.

## Coverage
- United States: ~69,887 businesses across all 50 states
- Canada: ~4,956 businesses (Ontario, British Columbia, Alberta)
- Australia: ~1,735 businesses (NSW, VIC, QLD)

## Categories (15 primary)
- Medical (병원): Korean-speaking doctors, clinics, specialists
- Dental (치과): Korean-speaking dentists
- Legal (법률): Korean-speaking lawyers, immigration attorneys
- Insurance (보험): Korean insurance agents
- Real Estate (부동산): Korean real estate agents
- Financial (금융): Korean financial advisors, accountants, CPAs
- Food & Dining (식당): Korean restaurants, cafes, bakeries
- Beauty (뷰티): Korean beauty salons, spas, skincare
- Auto Services (자동차): Korean auto repair, body shops
- Home Services (주택서비스): Korean contractors, plumbers, electricians
- Education (교육): Korean tutoring, language schools, academies
- Travel (여행): Korean travel agencies
- Professional Services (전문서비스): Korean translation, consulting
- Shopping (쇼핑): Korean grocery stores, retail shops
- Community (커뮤니티): Korean churches, community organizations

## URL Structure
- Homepage: https://www.haninmap.com
- US Categories: https://www.haninmap.com/{state}/{city}/{category}
- Business Detail: https://www.haninmap.com/biz/{slug}
- Canada: https://www.haninmap.com/canada/{region}/{city}/{category}
- Australia: https://www.haninmap.com/australia/{region}/{city}/{category}
- Guides: https://www.haninmap.com/guides/{slug}
- Regions: https://www.haninmap.com/regions
- Alerts: https://www.haninmap.com/alerts

## Popular Cities
- Los Angeles, CA (22,869 businesses)
- Buena Park, CA (2,529 businesses)
- Vancouver, BC (1,879 businesses)
- Flushing, NY (1,818 businesses)
- Garden Grove, CA (1,743 businesses)
- Toronto, ON (1,356 businesses)
- Sydney, NSW (1,153 businesses)

## Content
- Business listings with NAP (Name, Address, Phone), Google ratings, hours
- Life guides for Korean Americans (taxes, immigration, insurance, housing)
- IRS/government alerts in Korean
- Bilingual content (Korean + English) on all pages

## Data Sources
- Google Places API (ratings, hours, photos)
- Community-submitted reviews and trust scores
- Government data feeds (IRS alerts)

## Sitemap
https://www.haninmap.com/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
