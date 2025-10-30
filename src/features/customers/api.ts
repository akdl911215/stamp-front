import axios from "@/shared/lib/axios";

export async function getCustomers() {
  const { data } = await axios.get("/admin/customers/tenant");
  console.log('getCustomers data : ', data);

  return data;
}

export async function createVisit(payload: { customerId: string; idempotencyKey: string }) {
  console.log('createVisit payload : ', payload);
  const { data } = await axios.post("/visits", payload);
  console.log('createVisit data : ', data);

  return data as { total: number };
}

export async function getCustomerDetail(id: string) {
  const { data } = await axios.get(`/customers?id=${id}`);

  const raw =
    (data && (data.customer || (Array.isArray(data.customers) ? data.customers[0] : null))) ?? null;

  if (!raw) throw new Error("Customer not found");

  const coupons = Array.isArray(raw.rewardCoupons)
    ? raw.rewardCoupons.map((rc: any) => ({
        id: rc.id,
        code: rc.code,
        status: rc.status as "ISSUED" | "REDEEMED" | "EXPIRED" | "REVOKED",
        issuedAt: rc.issuedAt ?? rc.createdAt ?? null,
        expiresAt: rc.expiresAt ?? null,
        usedAt: rc.usedAt ?? null,
      }))
    : [];

  
  const countBy = (s: string) => coupons.filter((c) => c.status === s).length;

  return {
    id: raw.id,
    tenantId: raw.tenantId,
    name: raw.name ?? null,
    phone: raw.phone,
    stampCount: raw.stampCount ?? 0,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt ?? null,

    couponCount: coupons.length,
    issuedCount: countBy("ISSUED"),
    redeemedCount: countBy("REDEEMED"),
    expiredCount: countBy("EXPIRED"),
    revokedCount: countBy("REVOKED"),

    coupons,
  };
}
