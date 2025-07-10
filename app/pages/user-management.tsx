"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  Search,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { registerUser } from "@/lib/apis/users";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "superuser" | "admin" | "professor" | "student";
  createdAt: string;
  lastLogin: string;
  status: "active" | "inactive" | "suspended";
  monthlyReservations?: number;
  totalReservations?: number;
  studentId?: string; // Para estudiantes
  department?: string; // Para profesores
}

interface UserManagementProps {
  user: SystemUser;
}

export function UserManagement({ user }: UserManagementProps) {
  const [showNewUser, setShowNewUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: "1",
      name: "Ana García",
      email: "ana.garcia@ucab.edu.ve",
      role: "superuser",
      createdAt: "2024-01-15",
      lastLogin: "2025-01-26",
      status: "active",
    },
    {
      id: "2",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@ucab.edu.ve",
      role: "admin",
      createdAt: "2024-02-20",
      lastLogin: "2025-01-25",
      status: "active",
    },
    {
      id: "3",
      name: "María López",
      email: "maria.lopez@ucab.edu.ve",
      role: "professor",
      createdAt: "2024-03-10",
      lastLogin: "2025-01-26",
      status: "active",
      monthlyReservations: 12,
      totalReservations: 45,
      department: "Ingeniería de Sistemas",
    },
    {
      id: "4",
      name: "Dr. Juan Pérez",
      email: "juan.perez@ucab.edu.ve",
      role: "professor",
      createdAt: "2024-01-05",
      lastLogin: "2025-01-24",
      status: "active",
      monthlyReservations: 8,
      totalReservations: 67,
      department: "Ciencias de la Computación",
    },
    {
      id: "5",
      name: "Pedro Martínez",
      email: "pedro.martinez@ucab.edu.ve",
      role: "student",
      createdAt: "2024-09-01",
      lastLogin: "2025-01-26",
      status: "active",
      monthlyReservations: 5,
      totalReservations: 15,
      studentId: "2024-001234",
    },
    {
      id: "6",
      name: "Ana Rodríguez",
      email: "ana.rodriguez@ucab.edu.ve",
      role: "student",
      createdAt: "2024-09-01",
      lastLogin: "2025-01-25",
      status: "active",
      monthlyReservations: 3,
      totalReservations: 8,
      studentId: "2024-001235",
    },
    {
      id: "7",
      name: "Luis González",
      email: "luis.gonzalez@ucab.edu.ve",
      role: "student",
      createdAt: "2024-09-01",
      lastLogin: "2025-01-20",
      status: "inactive",
      monthlyReservations: 0,
      totalReservations: 2,
      studentId: "2024-001236",
    },
  ]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.studentId &&
        u.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus = filterStatus === "all" || u.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "superuser":
        return "Superusuario";
      case "admin":
        return "Administrador";
      case "professor":
        return "Profesor";
      case "student":
        return "Estudiante";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superuser":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "professor":
        return "bg-green-100 text-green-800";
      case "student":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "superuser":
        return <Shield className="w-3 h-3 mr-1" />;
      case "admin":
        return <Shield className="w-3 h-3 mr-1" />;
      case "professor":
        return <GraduationCap className="w-3 h-3 mr-1" />;
      case "student":
        return <BookOpen className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "suspended":
        return "Suspendido";
      default:
        return status;
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  const handleUpdateUserStatus = (
    userId: string,
    newStatus: SystemUser["status"]
  ) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    professors: users.filter((u) => u.role === "professor").length,
    students: users.filter((u) => u.role === "student").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  // Verificar permisos: solo superusuarios y administradores pueden gestionar usuarios
  const canManageUsers = user.role === "superuser" || user.role === "admin";
  const canCreateSuperusers = user.role === "superuser";

  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Acceso Restringido</h3>
          <p className="text-muted-foreground">
            No tienes permisos para gestionar usuarios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">
            {user.role === "superuser"
              ? "Administra todas las cuentas de usuario y permisos del sistema"
              : "Crea y gestiona cuentas de profesores y estudiantes"}
          </p>
        </div>
        <Dialog open={showNewUser} onOpenChange={setShowNewUser}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Registra un nuevo usuario en el sistema
              </DialogDescription>
            </DialogHeader>
            <NewUserForm
              onClose={() => setShowNewUser(false)}
              canCreateSuperusers={canCreateSuperusers}
              currentUserRole={user.role}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Con acceso al sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students}</div>
            <p className="text-xs text-muted-foreground">
              Pueden hacer reservas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profesores</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.professors}</div>
            <p className="text-xs text-muted-foreground">
              Pueden hacer reservas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administradores
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">Gestión del sistema</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Buscar usuario</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nombre, email o ID de estudiante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="min-w-[150px]">
              <Label>Rol</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {user.role === "superuser" && (
                    <SelectItem value="superuser">Superusuario</SelectItem>
                  )}
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="professor">Profesor</SelectItem>
                  <SelectItem value="student">Estudiante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <Label>Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="suspended">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuario
            {filteredUsers.length !== 1 ? "s" : ""}
            {searchTerm || filterRole !== "all" || filterStatus !== "all"
              ? " (filtrado)"
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Reservas</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {u.role === "student" ? (
                            <BookOpen className="w-4 h-4" />
                          ) : u.role === "professor" ? (
                            <GraduationCap className="w-4 h-4" />
                          ) : (
                            <Users className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {u.email}
                            {u.studentId && (
                              <div className="text-xs text-blue-600">
                                ID: {u.studentId}
                              </div>
                            )}
                            {u.department && (
                              <div className="text-xs text-green-600">
                                {u.department}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(u.role)}>
                        {getRoleIcon(u.role)}
                        {getRoleLabel(u.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.status}
                        onValueChange={(value: SystemUser["status"]) =>
                          handleUpdateUserStatus(u.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                          <SelectItem value="suspended">Suspendido</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(u.lastLogin).toLocaleDateString("es-ES")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {u.role === "professor" || u.role === "student" ? (
                        <div className="text-sm">
                          <div>Este mes: {u.monthlyReservations || 0}</div>
                          <div className="text-muted-foreground">
                            Total: {u.totalReservations || 0}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {u.id !== user.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NewUserForm({
  onClose,
  canCreateSuperusers,
  currentUserRole,
}: {
  onClose: () => void;
  canCreateSuperusers: boolean;
  currentUserRole: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "professor" | "student">(
    "student"
  );
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let type: "ADMINISTRADOR" | "PROFESOR" | "ESTUDIANTE" = "ESTUDIANTE";
      if (role === "admin") type = "ADMINISTRADOR";
      if (role === "professor") type = "PROFESOR";
      if (!password) {
        setError("Debes ingresar una contraseña");
        setLoading(false);
        return;
      }
      await registerUser({
        name,
        email,
        password,
        type,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="user-name">Nombre Completo</Label>
        <Input
          id="user-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej. Dr. Juan Pérez / Ana María González"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-email">Correo Electrónico</Label>
        <Input
          id="user-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ej. juan.perez@ucab.edu.ve"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-password">Contraseña</Label>
        <Input
          id="user-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa la contraseña del usuario"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-role">Rol</Label>
        <Select
          value={role}
          onValueChange={(value: "admin" | "professor" | "student") =>
            setRole(value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Estudiante</SelectItem>
            <SelectItem value="professor">Profesor</SelectItem>
            {currentUserRole === "superuser" && (
              <SelectItem value="admin">Administrador</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {role === "student" && (
        <div className="space-y-2">
          <Label htmlFor="student-id">ID de Estudiante</Label>
          <Input
            id="student-id"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="ej. 2024-001234"
            required
          />
        </div>
      )}

      {role === "professor" && (
        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Input
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="ej. Ingeniería de Sistemas"
            required
          />
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> El usuario recibirá un correo electrónico con
          las instrucciones para activar su cuenta y establecer su contraseña.
          {role === "student" && (
            <>
              <br />
              <strong>Límite de reservas:</strong> Los estudiantes pueden hacer
              máximo 10 horas de reservas por mes.
            </>
          )}
        </p>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={
            loading ||
            !name ||
            !email ||
            (role === "student" && !studentId) ||
            (role === "professor" && !department)
          }
        >
          {loading ? "Creando..." : "Crear Usuario"}
        </Button>
      </div>
    </form>
  );
}
