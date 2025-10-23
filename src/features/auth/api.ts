import api from "@/shared/lib/axios";

export type LoginDto = { username: string; password: string };
export type LoginRes = { accessToken: string; username: string };

export async function login(dto: LoginDto) {
  const { data } = await api.post("/admin/auth/login", dto);
  console.log('login api data : ', data);

  return data as LoginRes;
}
