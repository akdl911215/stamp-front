import { ActRow, Badge, Button2, Table } from "../styles";
import { Customer } from "../types";

interface Props {
  customers: Customer[];
  onCheckIn: (id: string) => void;
  onOpenDetail: (id: string) => void;
  visitPending: boolean;
}

function formatYmd(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function CustomersTable({
  customers,
  onCheckIn,
  onOpenDetail,
  visitPending,
}: Props) {
  return (
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
            {customers.map((c) => (
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
                    disabled={visitPending}
                    onClick={() => onCheckIn(c.id)}
                    aria-busy={visitPending}
                    >
                    {visitPending ? "처리중…" : "체크인(+1)"}
                    </Button2>
                    <Button2 $variant="ghost" onClick={() => onOpenDetail(c.id)}>상세</Button2>
                </ActRow>
                </td>
            </tr>
            ))}
        </tbody>
    </Table>
  );
}
