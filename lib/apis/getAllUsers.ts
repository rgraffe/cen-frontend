import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function getAllUsers() {
  const res = await axios.get(`${API_BASE}/api/auth/users`);
  return res.data;
}
