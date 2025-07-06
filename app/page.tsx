"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Computer, Users, Clock, LogOut } from "lucide-react"
import { LoginForm } from "./components/login-form"
import { Dashboard } from "./components/dashboard"
import { ReservationCalendar } from "./components/reservation-calendar"
import { LabManagement } from "./components/lab-management"
import { UserManagement } from "./components/user-management"

type UserRole = "superuser" | "admin" | "professor"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<"dashboard" | "calendar" | "labs" | "users">("dashboard")

  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("dashboard")
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">UCAB Lab Reservations</h1>
            <p className="text-gray-600">Sistema de Reserva de Recursos de Laboratorio</p>
          </div>
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    )
  }

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: Calendar, show: true },
    { id: "calendar", label: "Horarios", icon: Clock, show: true },
    { id: "labs", label: "Laboratorios", icon: Computer, show: currentUser.role !== "professor" },
    { id: "users", label: "Usuarios", icon: Users, show: currentUser.role === "superuser" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">UCAB Lab Reservations</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Bienvenido, </span>
                <span className="font-medium">{currentUser.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {currentUser.role === "superuser"
                    ? "Superusuario"
                    : currentUser.role === "admin"
                      ? "Administrador"
                      : "Profesor"}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex gap-2 mb-8">
          {navigation
            .filter((nav) => nav.show)
            .map((nav) => (
              <Button
                key={nav.id}
                variant={currentView === nav.id ? "default" : "outline"}
                onClick={() => setCurrentView(nav.id as any)}
                className="flex items-center gap-2"
              >
                <nav.icon className="w-4 h-4" />
                {nav.label}
              </Button>
            ))}
        </div>

        {/* Content */}
        {currentView === "dashboard" && <Dashboard user={currentUser} />}
        {currentView === "calendar" && <ReservationCalendar user={currentUser} />}
        {currentView === "labs" && <LabManagement user={currentUser} />}
        {currentView === "users" && <UserManagement user={currentUser} />}
      </div>
    </div>
  )
}
