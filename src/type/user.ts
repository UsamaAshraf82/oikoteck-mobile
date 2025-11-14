export type User_Type = {
  country_code: number;
  country_iso: string;
  phone: string;
  email?: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  first_name: string;
  last_name: string;
  sessionToken: string;
  username: string;
  objectId: string;
  logo: string;
  user_type: 'regular' | 'agent';
  total_credits: number;
  gold_credits: number;
  promote_credits: number;
  plat_credits: number;
  social_signup?: boolean;
  rsPass?: string;

  vat: string;
  company_name: string;
  terms: boolean;
  privacy: boolean;
  share_consent: boolean;
  activated: boolean;
};
