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

export async function loginUser(email: string, password: string) {
  const apiBase = API_BASE || "http://34.75.34.76";
  // 1. Login
  const res = await fetch(`${apiBase}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales incorrectas");
  const { access_token } = await res.json();

  // 2. Obtener datos del usuario
  const meRes = await fetch(`${apiBase}/api/auth/me`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!meRes.ok) throw new Error("No se pudo obtener el usuario");
  const user = await meRes.json();

  return { user, token: access_token };
}
