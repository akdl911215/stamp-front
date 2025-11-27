import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCustomerDetail /*, redeemCoupon */ } from "../api";
import { Badge, Box, Dim, Head, KPI, Label, List, Muted, Panel, Tbl, UseButton, Val } from "../styles/customerDetailDrawer.styles";
import { formatYmd, formatYmdHm } from "@/shared/utils/date.utils";
import { toneOf } from "../utils/coupon.utils";
import { CustomerDetail } from "../types/customer.types";

interface CustomerDetailDrawerProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly customerId: string | null;
}

export function CustomerDetailDrawer({
  open,
  onClose,
  customerId,
}: CustomerDetailDrawerProps) {
  const queryClient = useQueryClient();

  // 상세 조회
  const {
    data,
    isLoading,
    isError,
  } = useQuery<CustomerDetail>({
    queryKey: ["customer-detail", customerId],
    queryFn: () => getCustomerDetail(customerId!),
    enabled: open && !!customerId,
  });

  // 쿠폰 사용 mutation (API 연결 후 mutationFn 주석 해제)
  const redeemMutation = useMutation({
    // mutationFn: (couponId: string) => redeemCoupon(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-detail", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  // 디버깅용 로그 (필요 없으면 삭제 가능)
  useEffect(() => {
    console.log("Drawer open:", open, "customerId:", customerId);
  }, [open, customerId]);

  useEffect(() => {
    console.log("detail data:", data, "isLoading:", isLoading, "isError:", isError);
  }, [data, isLoading, isError]);

  // ESC 닫기
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const handleUseCoupon = (couponId: string) => {
    if (!window.confirm("이 쿠폰을 사용 처리할까요?")) return;
    // redeemMutation.mutate(couponId);
  };

  return (
    <>
      <Dim open={open} onClick={onClose} />
      <Panel open={open}>
        <Head>
          <h3>고객 상세</h3>
          <button onClick={onClose}>닫기</button>
        </Head>

        {isLoading && <p>불러오는 중…</p>}
        {isError && <p>상세를 불러오지 못했습니다.</p>}
        {!isLoading && !isError && data && (
          <div>
            {/* 기본 정보 */}
            <Box>
              <h4>기본 정보</h4>
              <List>
                <li>
                  <Label>이름</Label>
                  <Val>{data.name ?? "-"}</Val>
                </li>
                <li>
                  <Label>전화</Label>
                  <Val>{data.phone}</Val>
                </li>
                <li>
                  <Label>스탬프</Label>
                  <Val>
                    <b>{data.stampCount}</b>
                  </Val>
                </li>
                <li>
                  <Label>등록일</Label>
                  <Val>{formatYmd(data.createdAt)}</Val>
                </li>
              </List>
            </Box>

            {/* 쿠폰 집계 */}
            <Box>
              <h4>쿠폰 집계</h4>
              <KPI>
                <i>전체</i>
                <b>{data.couponCount}</b>
                <i>발급</i>
                <b>{data.issuedCount}</b>
                <i>사용</i>
                <b>{data.redeemedCount}</b>
                <i>만료</i>
                <b>{data.expiredCount}</b>
                <i>취소</i>
                <b>{data.revokedCount}</b>
              </KPI>
            </Box>

            {/* 쿠폰 목록 */}
            <Box>
              <h4>쿠폰</h4>
              <Tbl>
                <thead>
                  <tr>
                    <th>코드</th>
                    <th>상태</th>
                    <th>발급일</th>
                    <th>만료일</th>
                    <th>사용일</th>
                    <th>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {data.coupons.map((c) => (
                    <tr key={c.id}>
                      <td>{c.code}</td>
                      <td>
                        <Badge tone={toneOf(c.status)}>{c.status}</Badge>
                      </td>
                      <td>{formatYmdHm(c.issuedAt)}</td>
                      <td>{c.expiresAt ? formatYmdHm(c.expiresAt) : "-"}</td>
                      <td>{c.usedAt ? formatYmdHm(c.usedAt) : "-"}</td>
                      <td>
                        {c.status === "ISSUED" ? (
                          <UseButton
                            type="button"
                            disabled={redeemMutation.isPending}
                            onClick={() => handleUseCoupon(c.id)}
                          >
                            {redeemMutation.isPending ? "처리 중…" : "사용하기"}
                          </UseButton>
                        ) : (
                          <Muted>-</Muted>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Tbl>
            </Box>
          </div>
        )}
      </Panel>
    </>
  );
}