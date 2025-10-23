import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getCustomers } from "../api";
import { Spinner } from "@/shared/ui/Spinner";

interface Customer {
  id: string;
  name: string;
  phone: string;
  stampCount: number;
  tenantId: string;
}

export default function CustomersPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  if (isLoading)
    return (
      <Center>
        <Spinner /> 불러오는 중...
      </Center>
    );

  if (isError)
    return <Center>에러가 발생했습니다. {(error as Error).message}</Center>;

  if (!data?.length)
    return <Center>현재 등록된 고객이 없습니다.</Center>;

  return (
    <Wrap>
      <Header>
        <Title>고객 리스트</Title>
        <Sub>총 {data.length}명</Sub>
      </Header>

      <Table>
        <thead>
          <tr>
            <th>이름</th>
            <th>전화번호</th>
            <th>스탬프</th>
            <th>테넌트ID</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c: Customer) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.stampCount}</td>
              <td>{c.tenantId}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrap>
  );
}

const Wrap = styled.div`
  padding: 32px;
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Sub = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
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

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    background: ${({ theme }) => theme.colors.bg};
    font-weight: 600;
  }

  tr:hover td {
    background: #f9fbff;
  }
`;
