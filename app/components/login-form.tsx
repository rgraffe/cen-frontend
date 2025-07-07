"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  name: string
  email: string
  role: "superuser" | "admin" | "professor" | "student"
}

interface LoginFormProps {
  onLogin: (user: User) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("")

  // Usuarios de demostración
  const demoUsers = {
    superuser: { id: "1", name: "Ana García", email: "ana.garcia@ucab.edu.ve", role: "superuser" as const },
    admin: { id: "2", name: "Carlos Rodríguez", email: "carlos.rodriguez@ucab.edu.ve", role: "admin" as const },
    professor: { id: "3", name: "María López", email: "maria.lopez@ucab.edu.ve", role: "professor" as const },
    student: { id: "4", name: "Pedro Martínez", email: "pedro.martinez@ucab.edu.ve", role: "student" as const },
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRole && demoUsers[selectedRole as keyof typeof demoUsers]) {
      onLogin(demoUsers[selectedRole as keyof typeof demoUsers])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Selecciona un rol para acceder al sistema de demostración</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Rol de Usuario</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superuser">Superusuario</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="professor">Profesor</SelectItem>
                <SelectItem value="student">Estudiante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Usuario de demostración:</strong>
                <br />
                {demoUsers[selectedRole as keyof typeof demoUsers]?.name}
                <br />
                {demoUsers[selectedRole as keyof typeof demoUsers]?.email}
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!selectedRole}>
            Ingresar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
