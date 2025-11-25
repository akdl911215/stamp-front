import { EmptyBox } from "@/shared/ui/EmptyBox";
import { Spinner } from "@/shared/ui/Spinner";
import { useEffect, useState } from "react";
import { CustomerCreateModal } from "../components/CustomerCreateModal";
import { CustomerDetailDrawer } from "../components/CustomerDetailDrawer";
import { CustomersHeader } from "../components/CustomersHeader";
import { CustomersKPIGrid } from "../components/CustomersKPIGrid";
import { useCustomerMutations } from "../hooks/useCustomerMutations";
import { useCustomers } from "../hooks/useCustomers";
import { Button2, Center, Header, Title, Wrap } from "../styles";
import { CustomersTable } from "../components/CustomersTable";

export default function CustomersPage() {
  const [openDetail, setOpenDetail] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data,
    filtered,
    totals,
    isLoading,
    isError,
    error,
    q,
    setQ,
  } = useCustomers();

  const { visitMut, createCustomerMut } = useCustomerMutations();
  useEffect(() => {
    console.log('visitMut : ', visitMut)
    console.log('createCustmomerMut : ', createCustomerMut)
  }, [visitMut, createCustomerMut])

  const onCheckIn = (id: string) => visitMut.mutate(id);

  const onOpenDetail = (id: string) => {
    setSelectedId(id);
    setOpenDetail(true);
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

  if (!data || data.length === 0) {
    return (
      <Wrap>
        <Header>
          <div>
            <Title>고객 리스트</Title>
          </div>
        </Header>
        <EmptyBox
          title="아직 등록된 고객이 없습니다."
          description="고객을 추가하고 스탬프 적립을 시작하세요."
        >
          <Button2
            $variant="primary"
            onClick={() => setOpenCreate(true)}
          >
            고객 등록하기
          </Button2>
        </EmptyBox>
        {/* 팝업을 여기서도 렌더링 */}
        <CustomerCreateModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          name={newName}
          phone={newPhone}
          onChangeName={setNewName}
          onChangePhone={setNewPhone}
          onSubmit={() => {
            if (!newPhone.trim()) {
              alert("전화번호는 필수입니다.");
              return;
            }
            createCustomerMut.mutate({
              name: newName.trim() || undefined,
              phone: newPhone.trim(),
            });
          }}
          loading={createCustomerMut.isPending}
        />
      </Wrap>
    );
  }

  return (
    <Wrap>
      <CustomersHeader
        total={totals.total}
        q={q}
        onChangeQ={setQ}
        onOpenCreate={() => setOpenCreate(true)}
      />

      <CustomersKPIGrid totals={totals}/>

      <CustomersTable
        customers={filtered}
        onCheckIn={onCheckIn}
        onOpenDetail={onOpenDetail}
        visitPending={visitMut.isPending}
      />

      <CustomerDetailDrawer
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        customerId={selectedId}
      />
    </Wrap>
  );
}