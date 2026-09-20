import { DemoUserAccount } from '../types';

export const DEMO_ACCOUNTS: DemoUserAccount[] = [
  {
    username: 'demo',
    password: 'demo123',
    fullName: 'Abebe Tadesse',
    role: 'Senior Exporter',
    roleAm: 'ዋና ቡና ላኪ',
    organization: 'Oromia Coffee Farmers Union & ECEA',
    organizationAm: 'የኦሮሚያ ቡና አርሶ አደሮች ህብረት ስራ ማህበር',
    badgeColor: 'amber',
    description: 'Lead commodity export desk, ECX price hedging, multi-exchange basis spread & contract builder.',
    descriptionAm: 'የቡና ወጪ ንግድ ዴስክ፣ የ ECX የዋጋ ጥበቃ እና ዓለም አቀፍ የውል ማመንጫ ሙሉ ቁጥጥር።',
  },
  {
    username: 'union',
    password: 'union123',
    fullName: 'Dawit Alemu',
    role: 'Coffee Union Manager',
    roleAm: 'የህብረት ስራ ማህበር ስራ አስኪያጅ',
    organization: 'Yirgacheffe Coffee Farmers Cooperative Union',
    organizationAm: 'የይርጋጨፌ ቡና አርሶ አደሮች የህብረት ስራ ማህበር',
    badgeColor: 'emerald',
    description: 'Origin cooperative aggregation, farmgate cherry pricing, and EUDR GPS polygon parcel tracking.',
    descriptionAm: 'የአርሶ አደሮች ቀይ ቼሪ መረከቢያ ዋጋ፣ የቡና ማሰባሰብ እና የ EUDR ጂፒኤስ ካርታ ክትትል።',
  },
  {
    username: 'analyst',
    password: 'analyst123',
    fullName: 'Dr. Meron Haile',
    role: 'Market Analyst',
    roleAm: 'የሸቀጦች ገበያ ተንታኝ',
    organization: 'ECTA Coffee Strategy & Advisory Desk',
    organizationAm: 'የቡና እና ሻይ ባለስልጣን ስትራቴጂክ አማካሪ',
    badgeColor: 'blue',
    description: 'ICE C-Markets quants, weather anomaly forecasts, and macro USD/ETB currency sensitivity models.',
    descriptionAm: 'የአለም አቀፍ ሲ-ገበያዎች ትንበያ፣ የአየር ሁኔታ ተፅዕኖ እና የውጭ ምንዛሪ ጥናት ሞዴሎች።',
  },
  {
    username: 'trader',
    password: 'trader123',
    fullName: 'Selamawit Bekele',
    role: 'Guest Trader',
    roleAm: 'የቡና ነጋዴ',
    organization: 'Sidama Specialty Green Coffee Desk',
    organizationAm: 'የሲዳማ ልዩ ቡና ንግድ ዴስክ',
    badgeColor: 'purple',
    description: 'Real-time grade differentials, FOB Djibouti parity check, and buyer intelligence dossiers.',
    descriptionAm: 'የልዩ ቡና የዋጋ ልዩነት፣ የጅቡቲ ኤፍኦቢ ማመዛዘኛ እና የገዢዎች የገበያ መረጃ።',
  },
];

export function findDemoAccount(username: string): DemoUserAccount | undefined {
  const clean = username.trim().toLowerCase();
  return DEMO_ACCOUNTS.find((a) => a.username.toLowerCase() === clean);
}
