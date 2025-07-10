import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export interface RegisterUserPayload {
  email: string;
  name: string;
  password: string;
  type: "ADMINISTRADOR" | "ESTUDIANTE" | "PROFESOR";
}

export async function registerUser(payload: RegisterUserPayload) {
  const response = await axios.post(`${API_BASE}/api/auth/register`, payload);
  return response.data;
}

export async function deleteUser(id: number | string) {
  await axios.delete(`${API_BASE}/api/auth/users/${id}`);
}
