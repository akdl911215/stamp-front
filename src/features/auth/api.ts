import api from "@/shared/lib/axios";

export type LoginDto = { username: string; password: string };
export type LoginRes = { accessToken: string; username: string };

export async function login(dto: LoginDto): Promise<LoginRes> {
  try {
    const { data } = await api.post("/admin/auth/login", dto, {
      withCredentials: true,  
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Login successful:', data);
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}