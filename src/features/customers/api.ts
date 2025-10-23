import api from "@/shared/lib/axios";

export async function getCustomers() {
  const { data } = await api.get("/admin/customers");
  console.log('getCustomers data : ', data);

  return data;
}
