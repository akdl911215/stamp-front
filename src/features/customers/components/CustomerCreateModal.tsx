import { Button2, ModalActions, ModalBackdrop, ModalBox, ModalField } from "../styles";

interface CustomerCreateModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  phone: string;
  onChangeName: (v: string) => void;
  onChangePhone: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function CustomerCreateModal({
  open,
  onClose,
  name,
  phone,
  onChangeName,
  onChangePhone,
  onSubmit,
  loading,
}: CustomerCreateModalProps) {
  if (!open) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <h2>신규 고객 등록</h2>
        <p style={{ marginBottom: 16, fontSize: 13, color: "#666" }}>
          이름, 전화번호 필수입니다.
        </p>
        <ModalField>
          <label>이름</label>
          <input
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="예: 이정현"
          />
        </ModalField>
        <ModalField>
          <label>전화번호 *</label>
          <input
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="예: 01012345678"
          />
        </ModalField>
        <ModalActions>
          <Button2 $variant="ghost" onClick={onClose}>
            취소
          </Button2>
          <Button2
            $variant="primary"
            disabled={loading || !phone.trim()}
            onClick={onSubmit}
          >
            {loading ? "등록 중…" : "등록"}
          </Button2>
        </ModalActions>
      </ModalBox>
    </ModalBackdrop>
  );
}