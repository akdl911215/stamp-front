import api from "@/shared/lib/axios";

export async function getCustomers() {
  const { data } = await api.get("/customers");
  return data;
}
