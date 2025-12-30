"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, Clock, GraduationCap, Eye, Edit, Users, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"

interface Class {
  id: string
  code: string
  name: string
  dayOfWeek: string
  startTime: string
  endTime: string
  maxCapacity: number
  currentCapacity: number
  educationLevel: string
  shift: string
  subject: {
    id: string
    name: string
    type: string
  }
  preEnrollments?: any[]
}

interface Subject {
  id: string
  name: string
  type: string
}

export default function TurmasPage() {
  const { toast } = useToast()
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [classStudents, setClassStudents] = useState<any[]>([])
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    subjectId: "",
    educationLevel: "HIGH_SCHOOL",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    maxCapacity: 30,
    shift: "NIGHT",
  })

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      const data = await response.json()
      setClasses([...data.highSchool, ...data.middleSchool])
    } catch (error) {
      console.error("Error fetching classes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/subjects")
      if (response.ok) {
        const data = await response.json()
        setSubjects(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching subjects:", error)
    }
  }

  const fetchClassStudents = async (classId: string) => {
    try {
      const response = await fetch(`/api/admin/classes/${classId}/students`)
      if (response.ok) {
        const data = await response.json()
        setClassStudents(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching students:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar alunos da turma",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (classItem: Class) => {
    setSelectedClass(classItem)
    setFormData({
      code: classItem.code,
      name: classItem.name,
      subjectId: classItem.subject.id,
      educationLevel: classItem.educationLevel,
      dayOfWeek: classItem.dayOfWeek,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      maxCapacity: classItem.maxCapacity,
      shift: classItem.shift,
    })
    setIsEditDialogOpen(true)
  }

  const handleAdd = () => {
    setSelectedClass(null)
    setFormData({
      code: "",
      name: "",
      subjectId: "",
      educationLevel: "HIGH_SCHOOL",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      maxCapacity: 30,
      shift: "NIGHT",
    })
    setIsAddDialogOpen(true)
  }

  const handleViewStudents = async (classItem: Class) => {
    setSelectedClass(classItem)
    await fetchClassStudents(classItem.id)
    setIsStudentsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      const url = selectedClass
        ? `/api/admin/classes/${selectedClass.id}`
        : "/api/admin/classes"
      const method = selectedClass ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: selectedClass ? "Turma atualizada com sucesso" : "Turma criada com sucesso",
        })
        setIsEditDialogOpen(false)
        setIsAddDialogOpen(false)
        fetchClasses()
      } else {
        throw new Error("Erro ao salvar")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar turma",
        variant: "destructive",
      })
    }
  }

  const getOccupancyText = (classItem: Class) => {
    const available = classItem.maxCapacity - classItem.currentCapacity
    if (available === 0) return "Lotado!"
    if (available <= 5) return `Apenas ${available} vaga${available > 1 ? "s" : ""} restante${available > 1 ? "s" : ""}!`
    return "Vagas disponíveis"
  }

  const getLevelBadge = (level: string) => {
    const levelMap: Record<string, { label: string; className: string }> = {
      HIGH_SCHOOL: { label: "Ensino Médio", className: "bg-blue-100 text-blue-800" },
      MIDDLE_SCHOOL: { label: "Ensino Fundamental", className: "bg-purple-100 text-purple-800" },
    }
    const config = levelMap[level] || levelMap.HIGH_SCHOOL
    return <Badge className={config.className}>{config.label}</Badge>
  }

  // Agrupar alunos por token
  const studentsByToken = classStudents.reduce((acc, student) => {
    const token = student.token
    if (!acc[token]) {
      acc[token] = []
    }
    acc[token].push(student)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Turmas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie a lotação, disponibilidade e alunos em tempo real
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Turma
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((sum, c) => sum + c.currentCapacity, 0)}
            </div>
            <p className="text-xs text-green-600 mt-1">Total cadastrado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Turmas Ativas</CardTitle>
            <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded bg-purple-600"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-gray-600 mt-1">Turmas cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ocupação Média</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold text-xs">%</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.length > 0
                ? Math.round(
                    (classes.reduce((sum, c) => sum + (c.currentCapacity / c.maxCapacity) * 100, 0) /
                      classes.length)
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-gray-600 mt-1">Média de ocupação</p>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      {loading ? (
        <div className="text-center py-12">Carregando turmas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => {
            const occupancyPercentage = (classItem.currentCapacity / classItem.maxCapacity) * 100
            return (
              <Card key={classItem.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    {getLevelBadge(classItem.educationLevel)}
                    <div className="text-xs text-gray-500">#{classItem.code}</div>
                  </div>
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{classItem.dayOfWeek}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {classItem.startTime} - {classItem.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    <span>{classItem.subject.name}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Lotação</span>
                      <span>
                        {classItem.currentCapacity}/{classItem.maxCapacity}
                      </span>
                    </div>
                    <Progress value={occupancyPercentage} className="h-2" />
                    <p className={`text-xs ${occupancyPercentage >= 90 ? "text-red-600" : occupancyPercentage >= 70 ? "text-yellow-600" : "text-green-600"}`}>
                      {getOccupancyText(classItem)}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(classItem)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewStudents(classItem)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Alunos ({classItem.currentCapacity})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Turma</DialogTitle>
            <DialogDescription>Atualize as informações da turma</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subjectId">Matéria *</Label>
                <Select value={formData.subjectId} onValueChange={(value) => setFormData({ ...formData, subjectId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="educationLevel">Nível de Ensino *</Label>
                <Select value={formData.educationLevel} onValueChange={(value) => setFormData({ ...formData, educationLevel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH_SCHOOL">Ensino Médio</SelectItem>
                    <SelectItem value="MIDDLE_SCHOOL">Ensino Fundamental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dayOfWeek">Dia da Semana *</Label>
                <Input
                  id="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                  placeholder="Segunda-feira"
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">Horário Início *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">Horário Fim *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxCapacity">Capacidade Máxima *</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  min="1"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 30 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="shift">Turno *</Label>
                <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MORNING">Manhã</SelectItem>
                    <SelectItem value="AFTERNOON">Tarde</SelectItem>
                    <SelectItem value="NIGHT">Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">Salvar</Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Turma</DialogTitle>
            <DialogDescription>Preencha os dados para criar uma nova turma</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subjectId">Matéria *</Label>
                <Select value={formData.subjectId} onValueChange={(value) => setFormData({ ...formData, subjectId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="educationLevel">Nível de Ensino *</Label>
                <Select value={formData.educationLevel} onValueChange={(value) => setFormData({ ...formData, educationLevel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH_SCHOOL">Ensino Médio</SelectItem>
                    <SelectItem value="MIDDLE_SCHOOL">Ensino Fundamental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dayOfWeek">Dia da Semana *</Label>
                <Input
                  id="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                  placeholder="Segunda-feira"
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">Horário Início *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">Horário Fim *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxCapacity">Capacidade Máxima *</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  min="1"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 30 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="shift">Turno *</Label>
                <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MORNING">Manhã</SelectItem>
                    <SelectItem value="AFTERNOON">Tarde</SelectItem>
                    <SelectItem value="NIGHT">Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">Criar Turma</Button>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Students Dialog */}
      <Dialog open={isStudentsDialogOpen} onOpenChange={setIsStudentsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Alunos da Turma {selectedClass?.code} - {selectedClass?.name}
            </DialogTitle>
            <DialogDescription>
              Visualize todos os alunos cadastrados nesta turma, agrupados por token
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {Object.entries(studentsByToken).map(([token, students]) => (
              <Card key={token}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-white font-mono text-lg">
                        {token}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {students.length} pré-matrícula(s) com este token
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="border-l-4 border-l-primary pl-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{student.fullName}</div>
                            <div className="text-sm text-gray-600">{student.email}</div>
                            {student.whatsapp && (
                              <div className="text-sm text-gray-600">📱 {student.whatsapp}</div>
                            )}
                            {student.age && (
                              <div className="text-sm text-gray-600">Idade: {student.age} anos</div>
                            )}
                            {student.currentSchool && (
                              <div className="text-sm text-gray-600">Escola: {student.currentSchool}</div>
                            )}
                            {student.currentGrade && (
                              <div className="text-sm text-gray-600">Série: {student.currentGrade}</div>
                            )}
                            {student.writingLevel && (
                              <div className="text-sm text-gray-600">
                                Nível: {student.writingLevel === "BEGINNER" ? "Iniciante" : student.writingLevel === "INTERMEDIATE" ? "Intermediário" : "Avançado"}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 mt-2">
                              Cadastrado em: {format(new Date(student.createdAt), "d MMM yyyy 'às' HH:mm", { locale: ptBR })}
                            </div>
                          </div>
                          <Badge className={student.status === "CONFIRMED" ? "bg-green-100 text-green-800" : student.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}>
                            {student.status === "CONFIRMED" ? "Confirmado" : student.status === "PENDING" ? "Pendente" : student.status}
                          </Badge>
                        </div>
                        {student.fatherName && (
                          <div className="text-xs text-gray-500 border-t pt-2">
                            <div>Pai: {student.fatherName} {student.fatherPhone && `- ${student.fatherPhone}`}</div>
                          </div>
                        )}
                        {student.motherName && (
                          <div className="text-xs text-gray-500">
                            <div>Mãe: {student.motherName} {student.motherPhone && `- ${student.motherPhone}`}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {Object.keys(studentsByToken).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum aluno cadastrado nesta turma ainda
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
