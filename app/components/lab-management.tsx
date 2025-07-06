"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ComputerIcon, Plus, Settings, Trash2, Edit, Monitor, Wifi, WifiOff } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "superuser" | "admin" | "professor"
}

interface LabManagementProps {
  user: User
}

interface Lab {
  id: string
  name: string
  location: string
  capacity: number
  computers: {
    id: string
    name: string
    specs: string
    status: "available" | "in-use" | "maintenance" | "offline"
    lastMaintenance: string
  }[]
  status: "active" | "maintenance" | "inactive"
}

export function LabManagement({ user }: LabManagementProps) {
  const [showNewLab, setShowNewLab] = useState(false)
  const [showNewComputer, setShowNewComputer] = useState(false)
  const [selectedLab, setSelectedLab] = useState<string>("")

  const [labs, setLabs] = useState<Lab[]>([
    {
      id: "lab-a101",
      name: "Lab A-101",
      location: "Edificio A, Piso 1",
      capacity: 30,
      status: "active",
      computers: [
        {
          id: "pc-1",
          name: "PC-01",
          specs: "Intel i5, 8GB RAM, 256GB SSD",
          status: "available",
          lastMaintenance: "2024-12-01",
        },
        {
          id: "pc-2",
          name: "PC-02",
          specs: "Intel i5, 8GB RAM, 256GB SSD",
          status: "in-use",
          lastMaintenance: "2024-12-01",
        },
        {
          id: "pc-3",
          name: "PC-03",
          specs: "Intel i5, 8GB RAM, 256GB SSD",
          status: "maintenance",
          lastMaintenance: "2024-11-15",
        },
      ],
    },
    {
      id: "lab-b205",
      name: "Lab B-205",
      location: "Edificio B, Piso 2",
      capacity: 25,
      status: "active",
      computers: [
        {
          id: "pc-4",
          name: "PC-01",
          specs: "Intel i7, 16GB RAM, 512GB SSD",
          status: "available",
          lastMaintenance: "2024-12-05",
        },
        {
          id: "pc-5",
          name: "PC-02",
          specs: "Intel i7, 16GB RAM, 512GB SSD",
          status: "available",
          lastMaintenance: "2024-12-05",
        },
      ],
    },
    {
      id: "lab-c301",
      name: "Lab C-301",
      location: "Edificio C, Piso 3",
      capacity: 35,
      status: "maintenance",
      computers: [],
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "available":
        return "bg-green-100 text-green-800"
      case "in-use":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "offline":
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Wifi className="w-4 h-4" />
      case "in-use":
        return <Monitor className="w-4 h-4" />
      case "maintenance":
        return <Settings className="w-4 h-4" />
      case "offline":
        return <WifiOff className="w-4 h-4" />
      default:
        return <ComputerIcon className="w-4 h-4" />
    }
  }

  const handleDeleteLab = (labId: string) => {
    setLabs(labs.filter((lab) => lab.id !== labId))
  }

  const handleDeleteComputer = (labId: string, computerId: string) => {
    setLabs(
      labs.map((lab) =>
        lab.id === labId ? { ...lab, computers: lab.computers.filter((computer) => computer.id !== computerId) } : lab,
      ),
    )
  }

  const handleUpdateComputerStatus = (labId: string, computerId: string, newStatus: string) => {
    setLabs(
      labs.map((lab) =>
        lab.id === labId
          ? {
              ...lab,
              computers: lab.computers.map((computer) =>
                computer.id === computerId ? { ...computer, status: newStatus } : computer,
              ),
            }
          : lab,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Laboratorios</h2>
          <p className="text-muted-foreground">Administra laboratorios y equipos de cómputo</p>
        </div>
        <Dialog open={showNewLab} onOpenChange={setShowNewLab}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Laboratorio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Laboratorio</DialogTitle>
              <DialogDescription>Ingresa los detalles del nuevo laboratorio</DialogDescription>
            </DialogHeader>
            <NewLabForm onClose={() => setShowNewLab(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {labs.map((lab) => (
          <Card key={lab.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ComputerIcon className="w-5 h-5" />
                    {lab.name}
                  </CardTitle>
                  <CardDescription>{lab.location}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(lab.status)}>
                    {lab.status === "active" ? "Activo" : lab.status === "maintenance" ? "Mantenimiento" : "Inactivo"}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteLab(lab.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Capacidad: {lab.capacity} computadoras</span>
                  <span className="text-sm text-muted-foreground">Registradas: {lab.computers.length}</span>
                </div>

                {/* Computer Status Summary */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Disponibles:</span>
                    <span className="font-medium text-green-600">
                      {lab.computers.filter((c) => c.status === "available").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>En uso:</span>
                    <span className="font-medium text-blue-600">
                      {lab.computers.filter((c) => c.status === "in-use").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mantenimiento:</span>
                    <span className="font-medium text-yellow-600">
                      {lab.computers.filter((c) => c.status === "maintenance").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuera de línea:</span>
                    <span className="font-medium text-red-600">
                      {lab.computers.filter((c) => c.status === "offline").length}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog
                    open={showNewComputer && selectedLab === lab.id}
                    onOpenChange={(open) => {
                      setShowNewComputer(open)
                      if (open) setSelectedLab(lab.id)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar PC
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar Computadora</DialogTitle>
                        <DialogDescription>Registra una nueva computadora en {lab.name}</DialogDescription>
                      </DialogHeader>
                      <NewComputerForm
                        labId={lab.id}
                        onClose={() => {
                          setShowNewComputer(false)
                          setSelectedLab("")
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Computers Detail View */}
      {labs.map((lab) => (
        <Card key={`${lab.id}-computers`}>
          <CardHeader>
            <CardTitle>Computadoras - {lab.name}</CardTitle>
            <CardDescription>Gestiona las computadoras de este laboratorio</CardDescription>
          </CardHeader>
          <CardContent>
            {lab.computers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay computadoras registradas en este laboratorio
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lab.computers.map((computer) => (
                  <div key={computer.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{computer.name}</h4>
                        <p className="text-sm text-muted-foreground">{computer.specs}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteComputer(lab.id, computer.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={`${getStatusColor(computer.status)} flex items-center gap-1`}>
                        {getStatusIcon(computer.status)}
                        {computer.status === "available"
                          ? "Disponible"
                          : computer.status === "in-use"
                            ? "En uso"
                            : computer.status === "maintenance"
                              ? "Mantenimiento"
                              : "Fuera de línea"}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Último mantenimiento: {new Date(computer.lastMaintenance).toLocaleDateString("es-ES")}
                    </div>

                    <Select
                      value={computer.status}
                      onValueChange={(value: string) => handleUpdateComputerStatus(lab.id, computer.id, value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="in-use">En uso</SelectItem>
                        <SelectItem value="maintenance">Mantenimiento</SelectItem>
                        <SelectItem value="offline">Fuera de línea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function NewLabForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de creación de laboratorio
    console.log("Nuevo laboratorio:", { name, location, capacity: Number.parseInt(capacity) })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lab-name">Nombre del Laboratorio</Label>
        <Input
          id="lab-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej. Lab A-101"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lab-location">Ubicación</Label>
        <Input
          id="lab-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="ej. Edificio A, Piso 1"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lab-capacity">Capacidad (número de computadoras)</Label>
        <Input
          id="lab-capacity"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="30"
          min="1"
          max="100"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!name || !location || !capacity}>
          Crear Laboratorio
        </Button>
      </div>
    </form>
  )
}

function NewComputerForm({ labId, onClose }: { labId: string; onClose: () => void }) {
  const [name, setName] = useState("")
  const [specs, setSpecs] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de creación de computadora
    console.log("Nueva computadora:", { labId, name, specs })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="computer-name">Nombre de la Computadora</Label>
        <Input
          id="computer-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej. PC-01"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="computer-specs">Especificaciones</Label>
        <Input
          id="computer-specs"
          value={specs}
          onChange={(e) => setSpecs(e.target.value)}
          placeholder="ej. Intel i5, 8GB RAM, 256GB SSD"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!name || !specs}>
          Agregar Computadora
        </Button>
      </div>
    </form>
  )
}
