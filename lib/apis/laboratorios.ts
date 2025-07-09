import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Laboratorio {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface LaboratorioCreate {
  nombre: string;
  descripcion: string;
}

export async function getLaboratorios(params?: {
  limit?: number;
  offset?: number;
  order_by?: string;
  nombre?: string;
}) {
  const res = await axios.get<Laboratorio[]>(
    `${API_URL}/laboratorios/laboratorios`,
    {
      params,
    }
  );
  return res.data;
}

export async function getLaboratorio(id: number) {
  const res = await axios.get<Laboratorio & { equipos: any[] }>(
    `${API_URL}/laboratorios/laboratorios${id}`
  );
  return res.data;
}

export async function createLaboratorio(data: LaboratorioCreate) {
  const res = await axios.post<Laboratorio>(
    `${API_URL}/laboratorios/laboratorios`,
    data
  );
  return res.data;
}

export async function updateLaboratorio(id: number, data: LaboratorioCreate) {
  const res = await axios.patch<Laboratorio>(
    `${API_URL}/laboratorios/laboratorios${id}`,
    data
  );
  return res.data;
}

export async function deleteLaboratorio(id: number) {
  const res = await axios.delete(`${API_URL}/laboratorios/laboratorios${id}`);
  return res.status === 204;
}
