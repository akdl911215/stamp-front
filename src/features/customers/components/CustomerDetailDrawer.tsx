import { useEffect } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { getCustomerDetail } from "../api";

export function CustomerDetailDrawer({
  open, onClose, customerId,
}: { open: boolean; onClose: () => void; customerId: string | null; }) {

    useEffect(() => {
        console.log('open : ' , open)
        console.log('customerId : ' , customerId)
        console.log('onClose : ', onClose)
    }, [open, customerId, onClose])

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customer-detail", customerId],
    queryFn: () => getCustomerDetail(customerId!),
    enabled: open && !!customerId,
  });
  useEffect(() => {
    console.log('data : ', data)
    console.log('isLoading : ', isLoading)
    console.log('isError : ', isError)
  }, [data, isLoading, isError])

  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  return (
    <>
      <Dim open={open} onClick={onClose}/>
      <Panel open={open}>
        <Head>
          <h3>고객 상세</h3>
          <button onClick={onClose}>닫기</button>
        </Head>

        {isLoading && <p>불러오는 중…</p>}
        {isError && <p>상세를 불러오지 못했습니다.</p>}

        {data && (
          <div>
            <Box>
              <h4>기본 정보</h4>
              <List>
                <li><Label>이름</Label><Val>{data.name ?? "-"}</Val></li>
                <li><Label>전화</Label><Val>{data.phone}</Val></li>
                <li><Label>스탬프</Label><Val><b>{data.stampCount}</b></Val></li>
                <li><Label>등록일</Label><Val>{fmtYmd(data.createdAt)}</Val></li>
              </List>
            </Box>

            <Box>
              <h4>쿠폰 집계</h4>
              <KPI>
                <i>전체</i><b>{data.couponCount}</b>
                <i>발급</i><b>{data.issuedCount}</b>
                <i>사용</i><b>{data.redeemedCount}</b>
                <i>만료</i><b>{data.expiredCount}</b>
                <i>취소</i><b>{data.revokedCount}</b>
              </KPI>
            </Box>

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
                  </tr>
                </thead>
                <tbody>
                  {data.coupons.map(c => (
                    <tr key={c.id}>
                      <td>{c.code}</td>
                      <td><Badge tone={toneOf(c.status)}>{c.status}</Badge></td>
                      <td>{fmtYmdhm(c.issuedAt)}</td>
                      <td>{c.expiresAt ? fmtYmdhm(c.expiresAt) : "-"}</td>
                      <td>{c.usedAt ? fmtYmdhm(c.usedAt) : "-"}</td>
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

function fmtYmd(s: string){ const d=new Date(s); return isNaN(+d)?"-":`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function fmtYmdhm(s: string){ const d=new Date(s); if(isNaN(+d)) return "-"; const hh=String(d.getHours()).padStart(2,"0"); const mm=String(d.getMinutes()).padStart(2,"0"); return `${fmtYmd(s)} ${hh}:${mm}`; }
function toneOf(s: string): "blue"|"green"|"orange"|"red" {
  if (s==="ISSUED") return "blue";
  if (s==="REDEEMED") return "green";
  if (s==="EXPIRED") return "orange";
  return "red";
}

const Dim = styled.div<{open:boolean}>`
  position: fixed; inset: 0; background: rgba(0,0,0,.2);
  opacity: ${p=>p.open?1:0}; pointer-events: ${p=>p.open?'auto':'none'};
  transition: .2s ease;
`;
const Panel = styled.div<{open:boolean}>`
  position: fixed; top:0; right:0; width: 560px; max-width: 92vw; height: 100%;
  transform: translateX(${p=>p.open?'0':'100%'});
  transition: transform .25s ease;
  background: ${({theme})=>theme.colors.cardBg};
  border-left: 1px solid ${({theme})=>theme.colors.border};
  padding: 16px 18px; overflow: auto; z-index: 50;
`;
const Head = styled.div`display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;`;
const Box = styled.div`border:1px solid ${({theme})=>theme.colors.border}; border-radius:12px; padding:12px; margin-bottom:12px; background:${({theme})=>theme.colors.bg};`;
const List = styled.ul`list-style:none; padding:0; margin:0; li{display:flex; gap:10px; padding:6px 0;}`;
const Label = styled.span`width:72px; color:${({theme})=>theme.colors.muted};`;
const Val = styled.span``;
const KPI = styled.div`display:grid; grid-template-columns: repeat(5,1fr); gap:10px; i{font-size:12px;color:${({theme})=>theme.colors.muted}} b{font-size:18px;}`;
const Tbl = styled.table`width:100%; border-collapse:collapse; th,td{border-bottom:1px solid ${({theme})=>theme.colors.border}; padding:8px 10px; text-align:left;}`;
const Badge = styled.span<{tone:"blue"|"green"|"orange"|"red"}>`
  padding:2px 8px; border-radius:999px; font-size:12px;
  background:${p=>p.tone==="blue"?"#e8f0ff":p.tone==="green"?"#e7f7ee":p.tone==="orange"?"#fff3e6":"#ffe8ea"};
  color:${p=>p.tone==="blue"?"#2456e8":p.tone==="green"?"#0f8a4b":p.tone==="orange"?"#c45a00":"#c2152a"};
`;
