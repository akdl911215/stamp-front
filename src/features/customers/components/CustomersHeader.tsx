import { Button2, Header, Search, Sub, Title } from "../styles";

interface Props {
  readonly total: number;
  readonly q: string;
  readonly onChangeQ: (v: string) => void;
  readonly onOpenCreate: () => void;
}

export function CustomersHeader({ total, q, onChangeQ, onOpenCreate }: Props) {
  return (
      <Header>
        <div>
          <Title>고객 리스트</Title>
          <Sub>총 {total}명</Sub>
        </div>
        <Search>
          <input
            value={q}
            onChange={(e) => onChangeQ(e.target.value)}
            placeholder="이름/전화로 검색"
          />
        </Search>
        <Button2 $variant="primary" onClick={onOpenCreate}>
            신규 고객
        </Button2>
      </Header>
  );
}
