"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { crearHorarioClase, HorarioClasePayload, SesionClasePayload } from "@/lib/apis/horarios-clase"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ClassScheduleFormProps {
  profesores: { id: string, name: string }[]
  labs: { id: string, name: string, computers: number }[]
  onSuccess?: () => void
  onClose?: () => void
}

export function ClassScheduleForm({ profesores, labs, onSuccess, onClose }: ClassScheduleFormProps) {
  const [horarioForm, setHorarioForm] = useState<{ nombre_materia: string; id_usuario: string; sesiones: SesionClasePayload[] }>({ nombre_materia: "", id_usuario: "", sesiones: [] })
  // id_ubicacion como string para el select, pero se convierte a number al agregar
  const [sesion, setSesion] = useState<Omit<SesionClasePayload, 'id_ubicacion'> & { id_ubicacion: string }>({ dia_semana: "", hora_inicio: "", hora_fin: "", id_ubicacion: "", estado: "activa" })

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ]

  const mutation = useMutation({
    mutationFn: (payload: HorarioClasePayload) => crearHorarioClase(payload),
    onSuccess: () => {
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    },
  })

  return (
    <form onSubmit={e => {
      e.preventDefault()
      mutation.mutate({
        nombre_materia: horarioForm.nombre_materia,
        id_usuario: Number(horarioForm.id_usuario),
        sesiones: horarioForm.sesiones,
      })
    }} className="space-y-4">
      <div className="space-y-2">
        <Label>Materia</Label>
        <Input value={horarioForm.nombre_materia} onChange={e => setHorarioForm(f => ({ ...f, nombre_materia: e.target.value }))} required />
      </div>
      <div className="space-y-2">
        <Label>Profesor</Label>
        <Select value={horarioForm.id_usuario} onValueChange={v => setHorarioForm(f => ({ ...f, id_usuario: v }))}>
          <SelectTrigger><SelectValue placeholder="Selecciona un profesor" /></SelectTrigger>
          <SelectContent>
            {profesores.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.id} - {p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Sesiones</Label>
        {/* Sesiones agregadas */}
        {horarioForm.sesiones.map((s, i) => {
          const lab = labs.find(l => l.id === s.id_ubicacion.toString())
          return (
            <div key={i} className="flex gap-2 items-center">
              <span>{s.dia_semana} {s.hora_inicio}-{s.hora_fin} | Lab: {lab ? lab.name : s.id_ubicacion}</span>
            </div>
          )
        })}
        {/* Formulario para agregar sesión */}
        <div className="flex gap-2">
          <Select value={sesion.dia_semana} onValueChange={v => setSesion(s => ({ ...s, dia_semana: v }))}>
            <SelectTrigger className="w-24"><SelectValue placeholder="Día" /></SelectTrigger>
            <SelectContent>
              {diasSemana.map(dia => (
                <SelectItem key={dia} value={dia}>{dia}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="time" value={sesion.hora_inicio} onChange={e => setSesion(s => ({ ...s, hora_inicio: e.target.value }))} required />
          <Input type="time" value={sesion.hora_fin} onChange={e => setSesion(s => ({ ...s, hora_fin: e.target.value }))} required />
          <Select value={sesion.id_ubicacion} onValueChange={v => setSesion(s => ({ ...s, id_ubicacion: v }))}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Laboratorio" /></SelectTrigger>
            <SelectContent>
              {labs.map(lab => (
                <SelectItem key={lab.id} value={lab.id}>{lab.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={() => {
            if (sesion.dia_semana && sesion.hora_inicio && sesion.hora_fin && sesion.id_ubicacion) {
              setHorarioForm(f => ({
                ...f,
                sesiones: [...f.sesiones, { ...sesion, id_ubicacion: Number(sesion.id_ubicacion) }]
              }))
              setSesion({ dia_semana: "", hora_inicio: "", hora_fin: "", id_ubicacion: "", estado: "activa" })
            }
          }}>Agregar</Button>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        )}
        <Button type="submit" disabled={mutation.isPending}>Crear Horario</Button>
      </div>
      {mutation.isError && <div className="text-red-500">Error al crear el horario</div>}
    </form>
  )
}
