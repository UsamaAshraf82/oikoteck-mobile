import ParseGeoPoint from 'parse/types/ParseGeoPoint';
import { User_Type } from './user';
export type statusEnum = 'Approved' | 'Pending Approval' | 'Expired' | 'Rejected' | 'Deleted';
export type planEnum = 'Free' | 'Promote' | 'Promote +' | 'Gold' | 'Platinum';

export type Property_Type = {
  images: string[];
  special_feature: string[];
  marker: ParseGeoPoint | { __type: 'GeoPoint'; latitude: number; longitude: number };
  listing_for: string;
  title: string;
  reject_reason: string;
  description: string;
  heating:
    | 'Central heating'
    | 'Air Condition'
    | 'Underfloor Heating'
    | 'None'
    | 'Autonomous Heating';
  property_oriantation: string;
  heating_expense: number | string;
  energy_class:
    | 'A+'
    | 'A'
    | 'B+'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'Exempt from EPC'
    | 'EPC is under issuance';
  contact_method: string;

  visible: boolean;
  status: statusEnum;
  price: number;
  property_type: 'Residential' | 'Commercial' | 'Land';
  property_category: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  plot_size: number;
  furnished: boolean;
  deposit: number;
  payment_frequency: number;
  agent_icon: boolean;
  construction_year: number;
  floor: number;
  level_of_finish: number;
  reference_number: string;
  district: string;
  area_1: string;
  area_2: string;
  address: string;
  owner: Parse.User<User_Type> | User_Type;
  plan: planEnum;
  futurePromote: boolean;
  promote_bosted: boolean;
  createdAt: string;
  updatedAt: string;
  objectId: string;
  exact_location?: boolean;
  real_status?: boolean;

  flag: 'NEW' | 'EDIT' | 'RENEW' | 'CHANGE_PLAN' | 'ACTIVATE_PRE' | 'ACTIVATE_POST';

  flag_time: Date | { __type: 'Date'; iso: string };
  move_in_date: Date | { __type: 'Date'; iso: string };
  approved_on: Date | { __type: 'Date'; iso: string };
  expires_on: Date | { __type: 'Date'; iso: string };
  rejected_on: Date | { __type: 'Date'; iso: string };
  deleted_on: Date | { __type: 'Date'; iso: string };
  deleted_permanent_one: Date | { __type: 'Date'; iso: string };

  applied_point: number;
  start_date: Date | { __type: 'Date'; iso: string } | null;
  new_refresh_date: Date | { __type: 'Date'; iso: string } | null;
  market_date: Date | { __type: 'Date'; iso: string } | null;
  plan_valid: Date | { __type: 'Date'; iso: string } | null;
  future_promote: boolean;

  future_promote_applied_point: number;
  future_promote_on: Date | { __type: 'Date'; iso: string } | null;
  future_promote_to: Date | { __type: 'Date'; iso: string } | null;
  future_promote_ExpiresOn: Date | { __type: 'Date'; iso: string } | null;
  future_promote_plan_valid: Date | { __type: 'Date'; iso: string } | null;
};
