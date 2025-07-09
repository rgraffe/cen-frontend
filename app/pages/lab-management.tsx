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
import { getLaboratorios, deleteLaboratorio, createLaboratorio } from "@/lib/apis/laboratorios"

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

  useEffect(() => {
    fetchLabs()
  }, [])

  const handleDeleteLab = async (labId: number) => {
    await deleteLaboratorio(labId)
    fetchLabs()
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
        {labs.map((lab) => (
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
                    Registradas: {Array.isArray(lab.equipos) ? lab.equipos.length : 0}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar PC
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
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
