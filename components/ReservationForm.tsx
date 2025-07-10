"use client"

import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { crearReserva, ReservaPayload } from "@/lib/apis/reservas"
import { getLaboratorios } from "@/lib/apis/laboratorios"
import { getEquipos } from "@/lib/apis/equipos"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ReservationFormProps {
  userId: number
  onSuccess?: () => void
  onClose?: () => void
}

export function ReservationForm({ userId, onSuccess, onClose }: ReservationFormProps) {
  const [reservationType, setReservationType] = useState<"lab" | "computer">("computer")
  const [selectedLab, setSelectedLab] = useState("")
  const [selectedComputer, setSelectedComputer] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [date, setDate] = useState("")
  const [labs, setLabs] = useState<any[]>([])
  const [equipos, setEquipos] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const labsData = await getLaboratorios()
        setLabs(labsData)
        const equiposData = await getEquipos()
        setEquipos(equiposData)
      } catch (err) {
        setLabs([])
        setEquipos([])
      }
    }
    fetchData()
  }, [])

  const selectedLabData = labs.find((lab) => lab.id === Number(selectedLab))
  const filteredEquipos = equipos.filter((e) => e.id_laboratorio === Number(selectedLab))

  const mutation = useMutation({
    mutationFn: (payload: ReservaPayload) => crearReserva(payload),
    onSuccess: () => {
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLab || !startTime || !endTime || (reservationType === "computer" && !selectedComputer) || !date) return
    const fecha_inicio = `${date}T${startTime}`
    const fecha_fin = `${date}T${endTime}`
    const payload = {
      fecha_creacion: new Date().toISOString(),
      fecha_inicio,
      fecha_fin,
      id_usuario: userId,
      id_ubicacion: Number(selectedLab),
      status: "pending",
      id: null,
      equipos: reservationType === "computer" ? [Number(selectedComputer)] : [0],
    }
    console.log("Payload enviado al backend:", payload)
    mutation.mutate(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Tipo de Reserva</Label>
        <Select value={reservationType} onValueChange={(value: "lab" | "computer") => setReservationType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="computer">Computadora Específica</SelectItem>
            <SelectItem value="lab">Laboratorio Completo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Laboratorio</Label>
        <Select value={selectedLab} onValueChange={setSelectedLab}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un laboratorio" />
          </SelectTrigger>
          <SelectContent>
            {labs.map((lab) => (
              <SelectItem key={lab.id} value={lab.id.toString()}>
                {lab.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {reservationType === "computer" && selectedLab && (
        <div className="space-y-2">
          <Label>Computadora</Label>
          <Select value={selectedComputer} onValueChange={setSelectedComputer}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una computadora" />
            </SelectTrigger>
            <SelectContent>
              {filteredEquipos.map((equipo) => (
                <SelectItem key={equipo.id} value={equipo.id.toString()}>
                  {equipo.nombre} - {equipo.modelo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label>Fecha</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Hora de Inicio</Label>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} min="08:00" max="19:00" />
        </div>
        <div className="space-y-2">
          <Label>Hora de Fin</Label>
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} min="08:00" max="20:00" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={mutation.isPending || !selectedLab || !startTime || !endTime || (reservationType === "computer" && !selectedComputer) || !date}
        >
          {mutation.isPending ? "Creando..." : "Crear Reserva"}
        </Button>
      </div>
      {mutation.isError && <div className="text-red-500">Error al crear la reserva</div>}
    </form>
  )
}
