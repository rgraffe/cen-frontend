import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export interface ReservaPayload {
  fecha_creacion?: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_usuario: number;
  id_ubicacion: number;
  id_equipo: number;
  status?: string;
}

export async function crearReserva(payload: ReservaPayload) {
  const { data } = await axios.post(`${API_BASE}/reservas/`, payload);
  return data;
}

export async function obtenerReservas(params?: any) {
  const { data } = await axios.get(`${API_BASE}/reservas/`, { params });
  return data;
}
