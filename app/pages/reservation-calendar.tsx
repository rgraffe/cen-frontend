"use client"

import React, { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { crearHorarioClase, HorarioClasePayload } from "@/lib/apis/horarios-clase"
import { obtenerReservas } from "@/lib/apis/reservas"

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

interface Reservation {
  id: string
  labId: string
  labName: string
  computerId?: string
  computerName?: string
  professorName: string
  professorEmail: string
  date: string
  startTime: string
  endTime: string
  type: "lab" | "computer"
  status: "active" | "scheduled" | "completed"
}

export function ReservationCalendar({ user }: ReservationCalendarProps) {
  const [selectedLab, setSelectedLab] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [showNewReservation, setShowNewReservation] = useState(false)
  const [showNewHorario, setShowNewHorario] = useState(false)
  const [profesores, setProfesores] = useState<{ id: string, name: string }[]>([])

  // MOCK: Profesores de ejemplo (solo este useEffect, elimina el fetch para que no se sobreescriba)
  useEffect(() => {
    setProfesores([
      { id: "3", name: "María López" },
      { id: "4", name: "Dr. Juan Pérez" },
      { id: "5", name: "Prof. Carlos López" },
    ])
  }, [])

  const mutation = useMutation({
    mutationFn: (payload: HorarioClasePayload) => crearHorarioClase(payload),
    onSuccess: () => setShowNewHorario(false),
  })

  const labs = [
    { id: "lab-a101", name: "Lab A-101", computers: 30 },
    { id: "lab-b205", name: "Lab B-205", computers: 25 },
    { id: "lab-c301", name: "Lab C-301", computers: 35 },
    { id: "lab-d102", name: "Lab D-102", computers: 30 },
  ]

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ]

  const reservations: Reservation[] = [
    {
      id: "1",
      labId: "lab-a101",
      labName: "Lab A-101",
      computerId: "pc-15",
      computerName: "PC-15",
      professorName: "Dr. Juan Pérez",
      professorEmail: "juan.perez@ucab.edu.ve",
      date: selectedDate,
      startTime: "10:00",
      endTime: "12:00",
      type: "computer",
      status: "active",
    },
    {
      id: "2",
      labId: "lab-b205",
      labName: "Lab B-205",
      professorName: "Dra. Ana Martínez",
      professorEmail: "ana.martinez@ucab.edu.ve",
      date: selectedDate,
      startTime: "14:00",
      endTime: "16:00",
      type: "lab",
      status: "scheduled",
    },
    {
      id: "3",
      labId: "lab-a101",
      labName: "Lab A-101",
      computerId: "pc-08",
      computerName: "PC-08",
      professorName: "Prof. Carlos López",
      professorEmail: "carlos.lopez@ucab.edu.ve",
      date: selectedDate,
      startTime: "16:00",
      endTime: "18:00",
      type: "computer",
      status: "scheduled",
    },
  ]

  const filteredReservations = reservations.filter(
    (reservation) => selectedLab === "all" || reservation.labId === selectedLab,
  )

  const handleCancelReservation = (reservationId: string) => {
    // Implementar lógica de cancelación
    console.log("Cancelando reserva:", reservationId)
  }

  const getReservationForSlot = (labId: string, time: string) => {
    return filteredReservations.find(
      (reservation) => reservation.labId === labId && reservation.startTime <= time && reservation.endTime > time,
    )
  }

  return (
    <div className="space-y-6">
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
                  <p className="text-lg font-medium mb-2">No hay reservas programadas</p>
                  <p>Para la fecha seleccionada: {new Date(selectedDate).toLocaleDateString("es-ES")}</p>
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
              filteredReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {reservation.type === "lab" ? (
                        <Computer className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Computer className="w-5 h-5 text-green-600" />
                      )}
                      <div>
                        <div className="font-medium">
                          {reservation.labName}
                          {reservation.computerName && ` - ${reservation.computerName}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.startTime} - {reservation.endTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{reservation.professorName}</div>
                        <div className="text-xs text-muted-foreground">{reservation.professorEmail}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={reservation.status === "active" ? "default" : "secondary"}>
                      {reservation.status === "active" ? "Activa" : "Programada"}
                    </Badge>
                    {user.role !== "professor" && user.role !== "student" && (
                      <Button size="sm" variant="outline" onClick={() => handleCancelReservation(reservation.id)}>
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
