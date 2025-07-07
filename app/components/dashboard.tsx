"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Computer, Clock, AlertCircle, CheckCircle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "superuser" | "admin" | "professor" | "student"
}

interface DashboardProps {
  user: User
}

export function Dashboard({ user }: DashboardProps) {
  const stats = {
    totalLabs: 8,
    totalComputers: 120,
    activeReservations: 15,
    todayReservations: 8,
    monthlyUsage: user.role === "professor" || user.role === "student" ? 12 : null,
    monthlyLimit: user.role === "professor" ? 20 : user.role === "student" ? 10 : null,
  }

  const recentReservations = [
    { id: 1, lab: "Lab A-101", computer: "PC-15", time: "10:00 - 12:00", date: "Hoy", status: "active" },
    { id: 2, lab: "Lab B-205", computer: "PC-08", time: "14:00 - 16:00", date: "Mañana", status: "scheduled" },
    { id: 3, lab: "Lab C-301", computer: "PC-22", time: "09:00 - 11:00", date: "15/01/2025", status: "scheduled" },
  ]

  const labStatus = [
    { name: "Lab A-101", computers: 30, available: 25, inUse: 5 },
    { name: "Lab B-205", computers: 25, available: 20, inUse: 5 },
    { name: "Lab C-301", computers: 35, available: 30, inUse: 5 },
    { name: "Lab D-102", computers: 30, available: 28, inUse: 2 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Laboratorios</CardTitle>
            <Computer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLabs}</div>
            <p className="text-xs text-muted-foreground">Activos en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Computadoras</CardTitle>
            <Computer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComputers}</div>
            <p className="text-xs text-muted-foreground">Disponibles para reserva</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReservations}</div>
            <p className="text-xs text-muted-foreground">En este momento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user.role === "professor" ? "Uso Mensual" : "Reservas Hoy"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.role === "professor" ? `${stats.monthlyUsage}/${stats.monthlyLimit}` : stats.todayReservations}
            </div>
            <p className="text-xs text-muted-foreground">
              {user.role === "professor" ? "Horas utilizadas" : "Programadas para hoy"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>{user.role === "professor" ? "Mis Reservas" : "Reservas Recientes"}</CardTitle>
            <CardDescription>
              {user.role === "professor" ? "Tus próximas reservas programadas" : "Últimas reservas del sistema"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      {reservation.lab} - {reservation.computer}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {reservation.date} • {reservation.time}
                    </div>
                  </div>
                  <Badge variant={reservation.status === "active" ? "default" : "secondary"}>
                    {reservation.status === "active" ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Activa
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        Programada
                      </>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
            {user.role === "professor" && <Button className="w-full mt-4">Nueva Reserva</Button>}
          </CardContent>
        </Card>

        {/* Lab Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Laboratorios</CardTitle>
            <CardDescription>Disponibilidad actual de computadoras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {labStatus.map((lab) => (
                <div key={lab.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{lab.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {lab.available}/{lab.computers} disponibles
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(lab.available / lab.computers) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{lab.inUse} en uso</span>
                    <span>{lab.available} libres</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Limit Warning for Professors */}
      {(user.role === "professor" || user.role === "student") &&
        stats.monthlyUsage &&
        stats.monthlyLimit &&
        stats.monthlyUsage / stats.monthlyLimit > 0.8 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="w-5 h-5" />
                Límite de Uso Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700">
                Has utilizado {stats.monthlyUsage} de {stats.monthlyLimit} horas permitidas este mes. Te quedan{" "}
                {stats.monthlyLimit - stats.monthlyUsage} horas disponibles.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  )
}
