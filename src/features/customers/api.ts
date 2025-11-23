import axios from "@/shared/lib/axios";

export async function createCustomer(payload: { name?: string; phone: string }) {
  console.log("createCustomer payload:", payload);

  const { data } = await axios.post("/admin/customers", payload, {
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

export async function createVisit(payload: { customerId: string; idempotencyKey: string }) {
  console.log('createVisit payload : ', payload);
  const { data } = await axios.post("/visits", payload);
  console.log('createVisit data : ', data);

  return data as { total: number };
}

export async function getCustomerDetail(id: string) {
  console.log('id : ', id)
  const URL = `/customers?id=${(id)}`
  console.log('URL : ', URL)

  const { data } = await axios.get(URL);
  console.log('data : ', data)

  // 실제 응답이 { customers: [...] } 라면 이렇게 안전하게 파싱
  const arr = Array.isArray(data?.customers) ? data.customers : Array.isArray(data) ? data : [];
  console.log('arr : ', arr)
  const item = arr[0];
  console.log('item : ', item)

  // 없으면 null을 반환(404 수준의 "데이터 없음"은 에러로 던지지 않음)
  if (!item) return null;

  // 타입/필드 정규화(프런트 기대 스키마로 매핑)
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
