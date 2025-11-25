export interface Customer {
  id: string;
  name: string | null;
  phone: string;
  stampCount: number;
  tenantId: string;
  createdAt: string;
  updatedAt: string | null;

  couponCount: number;
  issuedCount: number;
  redeemedCount: number;
  expiredCount: number;
  revokedCount: number;
}

export type SortKey = "name" | "stampCount" | "couponCount" | "issuedCount" | "redeemedCount" | "expiredCount" | "revokedCount" | "createdAt";
