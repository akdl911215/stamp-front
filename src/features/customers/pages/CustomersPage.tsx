import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { createVisit, getCustomers } from "../api";
import { Spinner } from "@/shared/ui/Spinner";
import { setUuidv4 } from "@/shared/lib/setUuidv4";
import { CustomerDetailDrawer } from "../components/CustomerDetailDrawer";

interface Customer {
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

type SortKey = "name" | "stampCount" | "couponCount" | "issuedCount" | "redeemedCount" | "expiredCount" | "revokedCount" | "createdAt";

export default function CustomersPage() {
  const { data, isLoading, isError, error } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const visitMut = useMutation({
    mutationFn: (customerId: string) => createVisit({ customerId, idempotencyKey: setUuidv4() }),
    
    onMutate: async (customerId) => {
      // 낙관적 업데이트: 리스트의 stampCount만 +1
      await qc.cancelQueries({ queryKey: ["customers"] });
      const prev = qc.getQueryData<Customer[]>(["customers"]);
      if (prev) {
        const next = prev.map(c => c.id === customerId ? { ...c, stampCount: c.stampCount + 1 } : c);
        qc.setQueryData(["customers"], next);
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["customers"], ctx.prev);
      alert("체크인 처리 중 문제가 발생했습니다.");
    },
    onSettled: () => {
      // 서버 계산(임계치 도달 시 쿠폰 발급/차감 등)이 반영되도록 재조회
      qc.invalidateQueries({ queryKey: ["customers"] });
      if (selectedId) qc.invalidateQueries({ queryKey: ["customer-detail", selectedId] });
    },
  });


  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const qc = useQueryClient();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <Center>
        <Spinner /> 불러오는 중...
      </Center>
    );
  }
  if (isError) {
    return <Center>에러가 발생했습니다. {(error as Error).message}</Center>;
  }
  if (!data?.length) {
    return <Center>현재 등록된 고객이 없습니다.</Center>;
  }

 
  const onCheckIn = (id: string) => visitMut.mutate(id);

  const onOpenDetail = (id: string) => {
    setSelectedId(id);
    setOpenDetail(true);
  };

  return (
    <Wrap>
      <Header>
        <div>
          <Title>고객 리스트</Title>
          <Sub>총 {totals.total}명</Sub>
        </div>
        <Search>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="이름/전화로 검색"
          />
        </Search>
      </Header>

      <KPIGrid>
        <KPI>
          <h4>전체 쿠폰</h4>
          <strong>{totals.coupons.toLocaleString()}</strong>
        </KPI>
        <KPI>
          <h4>발급(ISSUED)</h4>
          <strong>{totals.issued.toLocaleString()}</strong>
        </KPI>
        <KPI>
          <h4>사용(REDEEMED)</h4>
          <strong>{totals.redeemed.toLocaleString()}</strong>
        </KPI>
        <KPI>
          <h4>만료(EXPIRED)</h4>
          <strong>{totals.expired.toLocaleString()}</strong>
        </KPI>
        <KPI>
          <h4>취소(REVOKED)</h4>
          <strong>{totals.revoked.toLocaleString()}</strong>
        </KPI>
      </KPIGrid>

       <Table>
        <thead>
          <tr>
            <th>이름</th>
            <th>전화번호</th>
            <th>스탬프</th>
            <th>쿠폰합계</th>
            <th>발급</th>
            <th>사용</th>
            <th>만료</th>
            <th>취소</th>
            <th>등록일</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id}>
              <td>
                <a role="button" onClick={() => onOpenDetail(c.id)} title="상세 보기">
                  {c.name ?? "-"}
                </a>
              </td>
              <td>{c.phone}</td>
              <td>{c.stampCount}</td>
              <td className="num"><Badge>{c.couponCount}</Badge></td>
              <td className="num"><Badge tone="blue">{c.issuedCount}</Badge></td>
              <td className="num"><Badge tone="green">{c.redeemedCount}</Badge></td>
              <td className="num"><Badge tone="orange">{c.expiredCount}</Badge></td>
              <td className="num"><Badge tone="red">{c.revokedCount}</Badge></td>
              <td>{formatYmd(c.createdAt)}</td>
              <td>
                <ActRow>
                  <Button2
                    $variant="primary"
                    disabled={visitMut.isPending}
                    onClick={() => onCheckIn(c.id)}
                    aria-busy={visitMut.isPending}
                  >
                    {visitMut.isPending ? "처리중…" : "체크인(+1)"}
                  </Button2>
                  <Button2 $variant="ghost" onClick={() => onOpenDetail(c.id)}>상세</Button2>
                </ActRow>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CustomerDetailDrawer
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        customerId={selectedId}
      />
    </Wrap>
  );
}

function getValue(c: Customer, k: SortKey) {
  return c[k];
}
function isIsoDate(v: unknown) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v);
}
function formatYmd(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function truncate(v: string, n = 10) {
  return v.length <= n ? v : v.slice(0, n) + "…";
}
function arrow(key: SortKey, dir: "asc" | "desc", me: SortKey) {
  if (key !== me) return "";
  return dir === "asc" ? "▲" : "▼";
}

const Button2 = styled.button<{ $variant?: "primary" | "ghost" }>`
  appearance: none;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: transform .04s ease, box-shadow .2s ease, background-color .2s ease, border-color .2s ease;
  outline: none;

  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `
        background: ${theme.colors.primary};
        color: #fff;
        box-shadow: 0 1px 0 rgba(0,0,0,.04), 0 4px 10px rgba(0,0,0,.06);
        &:hover { filter: brightness(0.97); }
        &:active { transform: translateY(1px); }
        &:focus-visible { box-shadow: 0 0 0 3px rgba(36,86,232,.25); }
      `
      : `
        background: ${theme.colors.cardBg};
        color: #333;
        border-color: ${theme.colors.border};
        &:hover { background: #f6f8fb; }
        &:active { transform: translateY(1px); }
        &:focus-visible { box-shadow: 0 0 0 3px rgba(0,0,0,.06); }
      `
  }

  &:disabled {
    opacity: .6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ActRow = styled.div`display:flex; gap:8px; align-items:center;`;

const Wrap = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
`;
const Header = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;
const Sub = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  margin-left: 8px;
`;
const Search = styled.div`
  input {
    padding: 10px 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 10px;
    min-width: 240px;
    background: ${({ theme }) => theme.colors.cardBg};
  }
`;
const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const KPI = styled.div`
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cardBg};
  h4 {
    margin: 0 0 6px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.muted};
  }
  strong {
    font-size: 20px;
  }
`;
const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 8px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;

  th, td {
    padding: 12px 14px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
  }
  th {
    background: ${({ theme }) => theme.colors.bg};
    font-weight: 600;
    cursor: pointer;
    user-select: none;
  }
  tr:hover td {
    background: #f9fbff;
  }
`;
const Badge = styled.span<{ tone?: "blue" | "green" | "orange" | "red" }>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
  background: ${({ tone, theme }) =>
    tone === "blue" ? "#e8f0ff"
    : tone === "green" ? "#e7f7ee"
    : tone === "orange" ? "#fff3e6"
    : tone === "red" ? "#ffe8ea"
    : theme.colors.bg};
  color: ${({ tone }) =>
    tone === "blue" ? "#2456e8"
    : tone === "green" ? "#0f8a4b"
    : tone === "orange" ? "#c45a00"
    : tone === "red" ? "#c2152a"
    : "#333"};
`;
