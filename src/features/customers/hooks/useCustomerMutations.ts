import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer, createVisit } from "../api";
import { setUuidv4 } from "@/shared/lib/setUuidv4";
import type { Customer } from "../types";

export function useCustomerMutations() {
  const qc = useQueryClient();

  const visitMut = useMutation({
    mutationFn: (customerId: string) =>
      createVisit({ customerId, idempotencyKey: setUuidv4() }),

    onMutate: async (customerId) => {
      await qc.cancelQueries({ queryKey: ["customers"] });

      const prev = qc.getQueryData<Customer[]>(["customers"]);

      if (prev) {
        const next = prev.map((c) =>
          c.id === customerId ? { ...c, stampCount: c.stampCount + 1 } : c
        );
        qc.setQueryData(["customers"], next);
      }

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["customers"], ctx.prev);
      alert("체크인 처리 중 문제가 발생했습니다.");
    },

    onSettled: (_data, _error, customerId) => {
      qc.invalidateQueries({ queryKey: ["customers"] });

      if (customerId) {
        qc.invalidateQueries({
          queryKey: ["customer-detail", customerId],
        });
      }
    },
  });

  const createCustomerMut = useMutation({
    mutationFn: (payload: { name?: string; phone: string }) =>
      createCustomer(payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
    },

    onError: () => {
      alert("고객 등록 중 오류가 발생했습니다.");
    },
  });

  return { visitMut, createCustomerMut };
}
