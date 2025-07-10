"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { crearHorarioClase, HorarioClasePayload } from "@/lib/apis/horarios-clase"
import { obtenerReservas, cancelarReserva } from "@/lib/apis/reservas"
import { getLaboratorios } from "@/lib/apis/laboratorios"
import { getEquipos } from "@/lib/apis/equipos"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Computer, X } from "lucide-react"
import { ReservationForm } from "@/components/ReservationForm"
import { ClassScheduleForm } from "@/components/ClassScheduleForm"

interface ReservationCalendarProps {
  user: {
    id: string
    name: string
    email: string
    role: "superuser" | "admin" | "professor" | "student"
  }
}

export function ReservationCalendar({ user }: ReservationCalendarProps) {
  const [selectedLab, setSelectedLab] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [showNewReservation, setShowNewReservation] = useState(false)
  const [showNewHorario, setShowNewHorario] = useState(false)
  const [profesores, setProfesores] = useState<{ id: string, name: string }[]>([])
  const [reservas, setReservas] = useState<any[]>([])
  const [labs, setLabs] = useState<any[]>([])
  const [equipos, setEquipos] = useState<any[]>([])
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(null)

  const mutation = useMutation({
    mutationFn: (payload: HorarioClasePayload) => crearHorarioClase(payload),
    onSuccess: () => setShowNewHorario(false),
  })

  useEffect(() => {
    async function fetchData() {
      const [resData, labsData, equiposData] = await Promise.all([
        obtenerReservas(user.role === "admin" ? { fecha: selectedDate } : { fecha: selectedDate, id_usuario: user.id }),
        getLaboratorios(),
        getEquipos(),
      ])
      setReservas(resData)
      setLabs(labsData)
      setEquipos(equiposData)
    }
    fetchData()
  }, [selectedDate, user])

  const handleCancelReservation = async (reservationId: number) => {
    setCancelDialogOpen(false)
    setReservationToCancel(null)
    await cancelarReserva(reservationId)
    // Refresca reservas
    const resData = await obtenerReservas(user.role === "admin" ? { fecha: selectedDate } : { fecha: selectedDate, id_usuario: user.id })
    setReservas(resData)
  }

  // Filtrar reservas por laboratorio seleccionado y por usuario si no es admin
  const filteredReservations = reservas.filter(
    (reserva) =>
      (selectedLab === "all" || reserva.id_ubicacion === Number(selectedLab)) &&
      (user.role === "admin" || reserva.id_usuario == user.id)
  )

  // Utilidades para mostrar nombres
  const getLabName = (id: number) => labs.find((l) => l.id === id)?.nombre || `Lab ${id}`
  const getEquipoName = (id: number) => equipos.find((e) => e.id === id)?.nombre || `PC-${id}`

  return (
    <div className="space-y-6">
      {/* Confirmación de cancelación */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cancelación</DialogTitle>
            <DialogDescription>¿Estás seguro de que deseas cancelar esta reserva?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>No</Button>
            <Button variant="destructive" onClick={() => reservationToCancel && handleCancelReservation(reservationToCancel)}>Sí, cancelar</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Horario de Reservas
          </CardTitle>
          <CardDescription>
            {user.role === "professor" || user.role === "student"
              ? "Consulta la disponibilidad y realiza nuevas reservas"
              : "Gestiona y supervisa todas las reservas del sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="lab-select">Laboratorio</Label>
              <Select value={selectedLab} onValueChange={setSelectedLab}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los laboratorios</SelectItem>
                  {labs.map((lab) => (
                    <SelectItem key={lab.id} value={lab.id}>
                      {lab.id} - {lab.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-select">Fecha</Label>
              <Input
                id="date-select"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </div>

            {(user.role === "professor" || user.role === "student") && (
              <Dialog open={showNewReservation} onOpenChange={setShowNewReservation}>
                <DialogTrigger asChild>
                  <Button>Nueva Reserva</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nueva Reserva</DialogTitle>
                    <DialogDescription>
                      Selecciona el laboratorio, computadora y horario para tu reserva
                    </DialogDescription>
                  </DialogHeader>
                  <ReservationForm userId={parseInt(user.id)} onClose={() => setShowNewReservation(false)} />
                </DialogContent>
              </Dialog>
            )}

            {user.role === "admin" && (
              <Dialog open={showNewHorario} onOpenChange={setShowNewHorario}>
                <DialogTrigger asChild>
                  <Button>Nuevo Horario de Clases</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo Horario de Clases</DialogTitle>
                  </DialogHeader>
                  <ClassScheduleForm
                    profesores={profesores}
                    labs={labs}
                    onClose={() => setShowNewHorario(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Solo mostrar laboratorios que tienen reservas */}
              {(selectedLab === "all" ? labs : labs.filter((lab) => lab.id === selectedLab))
                .filter((lab) => filteredReservations.some((res) => res.labId === lab.id))
                .map((lab) => {
                  const labReservations = filteredReservations.filter((res) => res.labId === lab.id)

                  return (
                    <div key={lab.id} className="border-b">
                      {/* Lab Header */}
                      <div className="p-4 bg-gray-50 border-b">
                        <div className="font-medium">{lab.name}</div>
                        <div className="text-sm text-muted-foreground">{lab.computers} PCs disponibles</div>
                      </div>

                      {/* Reservations for this lab */}
                      <div className="p-4 space-y-2">
                        {labReservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            className={`
                              flex items-center justify-between p-3 rounded-lg border
                              ${
                                reservation.status === "active"
                                  ? "bg-green-50 border-green-200"
                                  : "bg-blue-50 border-blue-200"
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-medium">
                                {reservation.startTime} - {reservation.endTime}
                              </div>
                              <div className="text-sm">
                                {reservation.type === "lab" ? "Laboratorio Completo" : reservation.computerName}
                              </div>
                              <div className="text-sm text-muted-foreground">{reservation.professorName}</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge variant={reservation.status === "active" ? "default" : "secondary"}>
                                {reservation.status === "active" ? "Activa" : "Programada"}
                              </Badge>
                              {user.role !== "professor" && user.role !== "student" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleCancelReservation(reservation.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}

              {/* Mensaje cuando no hay reservas */}
              {filteredReservations.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  {user.role === "professor" || user.role === "student" ? (
                    <>
                      <p className="text-lg font-medium mb-2">No tienes reservas para este día</p>
                      <p>Puedes crear una nueva reserva usando el botón arriba.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-medium mb-2">No hay reservas programadas</p>
                      <p>Para la fecha seleccionada: {new Date(selectedDate).toLocaleDateString("es-ES")}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations List */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas del Día</CardTitle>
          <CardDescription>
            Lista detallada de todas las reservas para {new Date(selectedDate).toLocaleDateString("es-ES")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReservations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hay reservas para la fecha seleccionada</p>
            ) : (
              filteredReservations.map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Computer className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">
                          {getLabName(reserva.id_ubicacion)}
                          {reserva.equipos && reserva.equipos.length > 0 && reserva.equipos[0] !== 0 &&
                            ` - ${getEquipoName(reserva.equipos[0])}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(reserva.fecha_inicio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {" - "}
                          {new Date(reserva.fecha_fin).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-sm font-medium">{reserva.usuario?.nombre || ""}</div>
                        <div className="text-xs text-muted-foreground">{reserva.usuario?.email || ""}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={reserva.status === "active" ? "default" : reserva.status === "cancelled" ? "destructive" : "secondary"}>
                      {reserva.status === "active" ? "Activa" : reserva.status === "cancelled" ? "Cancelada" : "Programada"}
                    </Badge>
                    {(user.role === "admin" || (user.id == reserva.id_usuario)) && reserva.status !== "cancelled" && (
                      <Button size="sm" variant="outline" onClick={() => { setReservationToCancel(reserva.id); setCancelDialogOpen(true); }}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
