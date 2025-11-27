export type CouponStatus = "ISSUED" | "REDEEMED" | "EXPIRED" | "REVOKED";

export interface Coupon {
  id: string;
  code: string;
  status: CouponStatus;
  issuedAt: string;
  expiresAt: string | null;
  usedAt: string | null;
}

export interface CustomerDetail {
  id: string;
  name: string | null;
  phone: string;
  stampCount: number;
  createdAt: string;

  couponCount: number;
  issuedCount: number;
  redeemedCount: number;
  expiredCount: number;
  revokedCount: number;

  coupons: Coupon[];
}
