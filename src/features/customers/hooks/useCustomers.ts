import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../api";
import type { Customer, SortKey } from "../types";

function getValue(c: Customer, k: SortKey) {
  return c[k];
}
function isIsoDate(v: unknown) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v);
}

export function useCustomers() {
  const { data, isLoading, isError, error } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
      if (!data) return [];
      const kw = q.trim().toLowerCase();
      const base = kw
        ? data.filter((c) =>
            `${c.name ?? ""} ${c.phone}`.toLowerCase().includes(kw)
          )
        : data;
  
      const sorted = [...base].sort((a, b) => {
        const va = getValue(a, sortKey);
        const vb = getValue(b, sortKey);
  
        // 문자열/날짜/숫자 안전 비교
        if (va === vb) return 0;
        if (va == null) return sortDir === "asc" ? -1 : 1;
        if (vb == null) return sortDir === "asc" ? 1 : -1;
  
        if (typeof va === "number" && typeof vb === "number") {
          return sortDir === "asc" ? va - vb : vb - va;
        }
        // 날짜 문자열이면 Date 비교
        if (isIsoDate(va) && isIsoDate(vb)) {
          return sortDir === "asc"
            ? new Date(va).getTime() - new Date(vb).getTime()
            : new Date(vb).getTime() - new Date(va).getTime();
        }
        // 일반 문자열 비교
        return sortDir === "asc"
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      });
  
      return sorted;
    }, [data, q, sortKey, sortDir]);

  const totals = useMemo(() => {
    const base = data ?? [];
    const sum = (k: keyof Customer) =>
      base.reduce((acc, cur) => acc + (Number(cur[k]) || 0), 0);
    return {
      total: base.length,
      coupons: sum("couponCount"),
      issued: sum("issuedCount"),
      redeemed: sum("redeemedCount"),
      expired: sum("expiredCount"),
      revoked: sum("revokedCount"),
    };
  }, [data]);

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return {
    data,
    filtered,
    totals,
    isLoading,
    isError,
    error,
    q,
    setQ,
    sortKey,
    sortDir,
    onSort,
  };
}
