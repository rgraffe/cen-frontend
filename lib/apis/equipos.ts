import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Equipo {
  id: number;
  nombre: string;
  modelo: string;
  estado: "Operativo" | "Mantenimiento" | "Dañado";
  id_laboratorio: number;
}

export interface EquipoCreate {
  nombre: string;
  modelo: string;
  estado: "Operativo" | "Mantenimiento" | "Dañado";
  id_laboratorio: number;
}

export async function getEquipos(params?: {
  limit?: number;
  offset?: number;
  order_by?: string;
  estado?: string;
  id_laboratorio?: number;
}) {
  const res = await axios.get<Equipo[]>(`${API_URL}/equipos`, { params });
  return res.data;
}

export async function getEquipo(id: number) {
  const res = await axios.get<Equipo & { laboratorio: any }>(
    `${API_URL}/equipos/${id}`
  );
  return res.data;
}

export async function createEquipo(data: EquipoCreate) {
  const res = await axios.post<Equipo>(
    `${API_URL}/laboratorios/equipos/`,
    data
  );
  return res.data;
}

export async function updateEquipo(id: number, data: EquipoCreate) {
  const res = await axios.patch<Equipo>(`${API_URL}/equipos/${id}`, data);
  return res.data;
}

export async function deleteEquipo(id: number) {
  const res = await axios.delete(`${API_URL}/equipos/${id}`);
  return res.status === 204;
}
