import { Property_Type } from './property';

export type tourType = {
  objectId: string;
  Property: Property_Type;
  owner: {
    __type: string;
    className: string;
    objectId: string;
  };
  User: {
    __type: string;
    className: string;
    objectId: string;
  };
  first_name: string;
  last_name: string;
  listing_type: string;
  price: number;
  phone: string;
  tour_time: string;
  tour_type: string;
  tour_date: {
    __type: 'Date';
    iso: '2024-11-29T00:00:00.000Z';
  };
  message: string;
  email: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  className: 'Tours';
};
export type meassageType = {
  objectId: string;
  Property: Property_Type;

  owner: {
    __type: string;
    className: string;
    objectId: string;
  };
  User: {
    __type: string;
    className: string;
    objectId: string;
  };
  first_name: string;
  last_name: string;
  listing_type: string;
  phone: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  className: string;
};

export type offerType = {
  objectId: string;
  Property: Property_Type;
  owner: {
    __type: string;
    className: string;
    objectId: string;
  };
  User: {
    __type: string;
    className: string;
    objectId: string;
  };
  first_name: string;
  last_name: string;
  listing_type: string;
  actual_price: number;
  phone: string;
  email: string;
  bid_price: number;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  className: string;
};
