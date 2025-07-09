import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export interface SesionClasePayload {
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  id_ubicacion: number;
  estado: string;
  id_horario_clase?: number;
}

export interface HorarioClasePayload {
  nombre_materia: string;
  id_usuario: number;
  sesiones: SesionClasePayload[];
}

export async function crearHorarioClase(payload: HorarioClasePayload) {
  const { data } = await axios.post(`${API_BASE}/horarios-clase/`, payload);
  return data;
}

export async function obtenerHorariosClase(params?: any) {
  const { data } = await axios.get(`${API_BASE}/horarios-clase/`, { params });
  return data;
}
