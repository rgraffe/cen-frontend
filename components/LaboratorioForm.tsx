"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { createLaboratorio, LaboratorioCreate } from "@/lib/apis/laboratorios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LaboratorioFormProps {
  onSuccess?: () => void
  onClose?: () => void
  initialValues?: LaboratorioCreate
}

export function LaboratorioForm({ onSuccess, onClose, initialValues }: LaboratorioFormProps) {
  const [form, setForm] = useState<LaboratorioCreate>(
    initialValues || { nombre: "", descripcion: "" }
  )

  const mutation = useMutation({
    mutationFn: (data: LaboratorioCreate) => createLaboratorio(data),
    onSuccess: () => {
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    },
  })

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        mutation.mutate(form)
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label>Nombre del Laboratorio</Label>
        <Input
          value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
          placeholder="ej. Lab A-101"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Descripción</Label>
        <Input
          value={form.descripcion}
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
          placeholder="ej. Laboratorio de computación, piso 1"
          required
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creando..." : "Crear Laboratorio"}
        </Button>
      </div>
      {mutation.isError && <div className="text-red-500">Error al crear el laboratorio</div>}
    </form>
  )
}
