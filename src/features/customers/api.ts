import axios from "@/shared/lib/axios";

type RedeemCouponRequest = {
  readonly couponId: string;
};

type RedeemCouponResponse = {
  readonly id: string;
  readonly code: string;
  readonly status: "ISSUED" | "REDEEMED" | "EXPIRED" | "REVOKED";
  readonly issuedAt: string | null;
  readonly expiresAt: string | null;
  readonly usedAt: string | null;
}

export async function redeemCoupon(payload: RedeemCouponRequest) {
  console.log("redeemCoupon payload:", payload);

  const { couponId } = payload;

  const { data } = await axios.post(`/coupons/${couponId}/redeem`);

  console.log("redeemCoupon data:", data);
  return data as RedeemCouponResponse;
}

export async function createCustomer(payload: { readonly name?: string; readonly phone: string }) {
  console.log("createCustomer payload:", payload);

  const { data } = await axios.post("/customers", payload, {
    withCredentials: false, 
  });

  console.log("createCustomer data:", data);
  return data;
}


export async function getCustomers() {
  const { data } = await axios.get("/admin/customers/tenant");
  console.log('getCustomers data : ', data);

  return data;
}

export async function createVisit(payload: { readonly customerId: string; readonly idempotencyKey: string }) {
  console.log('createVisit payload : ', payload);
  const { data } = await axios.post("/visits", payload);
  console.log('createVisit data : ', data);

  return data as { readonly total: number };
}

export async function getCustomerDetail(id: string) {
  console.log('id : ', id)
  const URL = `/customers?id=${(id)}`
  console.log('URL : ', URL)

  const { data } = await axios.get(URL);
  console.log('data : ', data)

  const arr = Array.isArray(data?.customers) ? data.customers : Array.isArray(data) ? data : [];
  console.log('arr : ', arr)
  const item = arr[0];
  console.log('item : ', item)

  if (!item) return null;

  return {
    id: item.id,
    tenantId: item.tenantId,
    name: item.name ?? null,
    phone: item.phone,
    stampCount: Number(item.stampCount ?? 0),
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null,

    couponCount: Number(item.couponCount ?? 0),
    issuedCount: Number(item.issuedCount ?? 0),
    redeemedCount: Number(item.redeemedCount ?? 0),
    expiredCount: Number(item.expiredCount ?? 0),
    revokedCount: Number(item.revokedCount ?? 0),

    coupons: Array.isArray(item.coupons) ? item.coupons.map((c: any) => ({
      id: c.id,
      code: c.code,
      status: c.status, // "ISSUED"|"REDEEMED"|"EXPIRED"|"REVOKED"
      issuedAt: c.issuedAt ?? c.issued_at ?? null,
      expiresAt: c.expiresAt ?? c.expires_at ?? null,
      usedAt: c.usedAt ?? c.used_at ?? null,
    })) : [],
  } as {
    id: string; tenantId: string; name: string | null; phone: string;
    stampCount: number; createdAt: string | null; updatedAt: string | null;
    couponCount: number; issuedCount: number; redeemedCount: number; expiredCount: number; revokedCount: number;
    coupons: Array<{
      id: string; code: string; status: "ISSUED"|"REDEEMED"|"EXPIRED"|"REVOKED";
      issuedAt: string | null; expiresAt: string | null; usedAt: string | null;
    }>;
  };
}
