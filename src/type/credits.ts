type creditsType = {
  objectId: string;
  Expiry: {
    __type: string;
    iso: string;
  };
  Bucket: 'Promote +' | 'Gold' | 'Platinum';
  User: {
    __type: string;
    className: string;
    objectId: string;
  };
  total_credits: number;
  avail_credit: number;
  used_credits: number;
  isExpired: boolean;
  createdAt: string;
  updatedAt: string;
  className: string;
};
