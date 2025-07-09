"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import { LaboratorioForm } from "@/components/LaboratorioForm"
import { getLaboratorios, deleteLaboratorio } from "@/lib/apis/laboratorios"
import { getEquipos, createEquipo, deleteEquipo, updateEquipo } from "@/lib/apis/equipos"

interface User {
  id: string
  name: string
  email: string
  role: "superuser" | "admin" | "professor"
}

interface LabManagementProps {
  user: User
}

export function LabManagement({ user }: LabManagementProps) {
  const [showNewLab, setShowNewLab] = useState(false)
  const [showNewComputer, setShowNewComputer] = useState(false)
  const [selectedLab, setSelectedLab] = useState<string>("")
  const [labs, setLabs] = useState<any[]>([])
  const [equipos, setEquipos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchLabs = async () => {
    setLoading(true)
    try {
      const data = await getLaboratorios()
      setLabs(data)
    } catch (err) {
      setLabs([])
    } finally {
      setLoading(false)
    }
  }

  const fetchEquipos = async () => {
    try {
      const data = await getEquipos()
      setEquipos(data)
    } catch (err) {
      setEquipos([])
    }
  }

  useEffect(() => {
    fetchLabs()
    fetchEquipos()
  }, [])

  const handleDeleteLab = async (labId: number) => {
    await deleteLaboratorio(labId)
    fetchLabs()
    fetchEquipos()
  }

  const handleAddEquipo = async (equipo: { nombre: string; modelo: string; estado: string; id_laboratorio: number }, onClose: () => void) => {
    await createEquipo(equipo)
    fetchEquipos()
    onClose()
  }

  const handleDeleteEquipo = async (equipoId: number) => {
    await deleteEquipo(equipoId)
    fetchEquipos()
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
            <LaboratorioForm
              onClose={async () => {
                setShowNewLab(false)
                await fetchLabs()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {labs.map((lab) => {
          const labEquipos = equipos.filter((e) => e.id_laboratorio === lab.id)
          return (
            <Card key={lab.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ComputerIcon className="w-5 h-5" />
                      {lab.nombre}
                    </CardTitle>
                    <CardDescription>{lab.descripcion}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleDeleteLab(lab.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Registradas: {labEquipos.length}
                    </span>
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
                          <DialogDescription>Registra una nueva computadora en {lab.nombre}</DialogDescription>
                        </DialogHeader>
                        <NewEquipoForm
                          labId={lab.id}
                          onAdd={handleAddEquipo}
                          onClose={() => {
                            setShowNewComputer(false)
                            setSelectedLab("")
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  {/* Equipos List */}
                  {labEquipos.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {labEquipos.map((equipo) => (
                        <div key={equipo.id} className="border rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{equipo.nombre}</div>
                            <div className="text-xs text-muted-foreground">{equipo.modelo}</div>
                            <div className="text-xs text-muted-foreground">Estado: {equipo.estado}</div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteEquipo(equipo.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function NewEquipoForm({ labId, onAdd, onClose }: { labId: number; onAdd: (equipo: any, onClose: () => void) => void; onClose: () => void }) {
  const [nombre, setNombre] = useState("")
  const [modelo, setModelo] = useState("")
  const [estado, setEstado] = useState("Operativo")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onAdd({ nombre, modelo, estado, id_laboratorio: labId }, onClose)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="equipo-nombre">Nombre de la Computadora</Label>
        <Input
          id="equipo-nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="ej. PC-01"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="equipo-modelo">Especificaciones</Label>
        <Input
          id="equipo-modelo"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          placeholder="ej. Intel i5, 8GB RAM, 256GB SSD"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="equipo-estado">Estado</Label>
        <Select value={estado} onValueChange={setEstado}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Operativo">Operativo</SelectItem>
            <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
            <SelectItem value="Dañado">Dañado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!nombre || !modelo || loading}>
          Agregar Computadora
        </Button>
      </div>
    </form>
  )
}
