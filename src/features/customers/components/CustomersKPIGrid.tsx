import { KPI, KPIGrid } from "../styles";

interface Props {
  readonly totals: {
   readonly coupons: number;
   readonly issued: number;
   readonly redeemed: number;
   readonly expired: number;
   readonly revoked: number;
  };
}

export function CustomersKPIGrid({ totals }: Props) {
  return (
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
  );
}
