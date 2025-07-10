import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export interface ReservaPayload {
  fecha_creacion?: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_usuario: number;
  id_ubicacion: number;
  status?: string;
  id?: number | null;
  equipos: number[];
}

export interface Reserva {
  id: number;
  fecha_creacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_usuario: number;
  id_ubicacion: number;
  status: string;
  equipos: number[];
  usuario?: {
    id: number;
    nombre: string;
    email: string;
  };
  laboratorio?: {
    id: number;
    nombre: string;
  };
  equipo_objs?: Array<{
    id: number;
    nombre: string;
    modelo: string;
  }>;
}

export async function crearReserva(payload: ReservaPayload) {
  const { data } = await axios.post(`${API_BASE}/api/reservas/`, payload);
  return data;
}

export async function obtenerReservas(params?: any) {
  const { data } = await axios.get(`${API_BASE}/api/reservas/`, { params });
  return data;
}

export async function cancelarReserva(id: number) {
  // PATCH para cambiar status a cancelada o DELETE si el backend lo permite
  const { data } = await axios.patch(`${API_BASE}/api/reservas/${id}`, {
    status: "cancelled",
  });
  return data;
}
