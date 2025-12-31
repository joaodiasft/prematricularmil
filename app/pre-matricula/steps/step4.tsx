"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  GraduationCap,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

interface Class {
  id: string;
  code: string;
  name: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  currentCapacity: number;
  teacher?: string;
  description?: string;
  location?: string;
  subject: {
    name: string;
    type: string;
  };
}

export default function Step4({ onNext, onBack }: Step4Props) {
  const { toast } = useToast();
  const [selectedClasses, setSelectedClasses] = useState<
    Record<string, string>
  >({}); // { subjectType: classId }
  const [classes, setClasses] = useState<{
    highSchool: Class[];
    middleSchool: Class[];
  }>({
    highSchool: [],
    middleSchool: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
    const saved = localStorage.getItem("preMatricula_step4");
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedClasses(data.selectedClasses || {});
    }
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/classes", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("✅ Turmas recebidas da API:", {
        highSchool: data.highSchool?.length || 0,
        middleSchool: data.middleSchool?.length || 0,
      });

      setClasses({
        highSchool: Array.isArray(data.highSchool) ? data.highSchool : [],
        middleSchool: Array.isArray(data.middleSchool) ? data.middleSchool : [],
      });
    } catch (error) {
      console.error("❌ Error fetching classes:", error);
      toast({
        title: "Erro ao carregar turmas",
        description:
          error instanceof Error ? error.message : "Tente recarregar a página.",
        variant: "destructive",
      });
      // Manter arrays vazios em caso de erro
      setClasses({
        highSchool: [],
        middleSchool: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClassSelect = (classItem: Class) => {
    const subjectType = classItem.subject.type;
    const newSelected = { ...selectedClasses };

    // Se já tem uma turma desta matéria selecionada, substitui
    // Se clicar na mesma turma, desmarca
    if (newSelected[subjectType] === classItem.id) {
      delete newSelected[subjectType];
    } else {
      newSelected[subjectType] = classItem.id;
    }

    setSelectedClasses(newSelected);
    localStorage.setItem(
      "preMatricula_step4",
      JSON.stringify({ selectedClasses: newSelected })
    );
  };

  const getSelectedClassForSubject = (subjectType: string) => {
    return selectedClasses[subjectType] || "";
  };

  const getAvailabilityStatus = (classItem: Class) => {
    const available = classItem.maxCapacity - classItem.currentCapacity;
    if (available === 0)
      return { label: "Lista de Espera", color: "bg-gray-500" };
    if (available <= 5)
      return { label: "Poucas Vagas", color: "bg-orange-500" };
    return { label: "Disponível", color: "bg-green-500" };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCount = Object.keys(selectedClasses).length;
    if (selectedCount === 0) {
      toast({
        title: "Selecione pelo menos uma turma",
        description:
          "Você pode selecionar uma turma por matéria. Selecione pelo menos uma para continuar.",
        variant: "destructive",
      });
      return;
    }
    onNext();
  };

  const groupClassesBySubject = (classList: Class[]) => {
    const grouped: Record<string, Class[]> = {};
    classList.forEach((classItem) => {
      const subjectType = classItem.subject.type;
      if (!grouped[subjectType]) {
        grouped[subjectType] = [];
      }
      grouped[subjectType].push(classItem);
    });
    return grouped;
  };

  const renderClassCard = (classItem: Class) => {
    const status = getAvailabilityStatus(classItem);
    const isSelected =
      getSelectedClassForSubject(classItem.subject.type) === classItem.id;
    const available = classItem.maxCapacity - classItem.currentCapacity;

    return (
      <Card
        key={classItem.id}
        className={`cursor-pointer transition-all hover:shadow-lg ${
          isSelected
            ? "border-primary border-2 bg-primary/5"
            : "border-gray-200"
        }`}
        onClick={() => handleClassSelect(classItem)}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">
                {classItem.code} - {classItem.name}
              </CardTitle>
              <CardDescription className="mt-1">
                {classItem.subject.name}
              </CardDescription>
              {classItem.teacher && (
                <div className="mt-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {classItem.teacher}
                  </span>
                </div>
              )}
            </div>
            {isSelected && (
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className={`text-xs text-white px-2 py-1 rounded font-semibold ${status.color}`}
            >
              {status.label} - {available} vagas
            </span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
              {classItem.location || "Presencial - Goiânia"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{classItem.dayOfWeek}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="font-medium">
              {classItem.startTime} às {classItem.endTime}
            </span>
          </div>
          {classItem.description && (
            <div className="text-sm text-gray-600 pt-2 border-t">
              <p>{classItem.description}</p>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-gray-500">
              Capacidade: {classItem.currentCapacity}/{classItem.maxCapacity}
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${
                    (classItem.currentCapacity / classItem.maxCapacity) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderClassesBySubject = (classList: Class[]) => {
    const grouped = groupClassesBySubject(classList);
    const subjectNames: Record<string, string> = {
      REDACAO: "Redação",
      EXATAS: "Exatas",
      GRAMATICA: "Gramática",
      MATEMATICA: "Matemática",
    };

    return Object.entries(grouped).map(([subjectType, subjectClasses]) => {
      const selectedClassId = getSelectedClassForSubject(subjectType);
      const hasSelection = !!selectedClassId;

      return (
        <div key={subjectType} className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">
              {subjectNames[subjectType] || subjectType}
            </h4>
            {hasSelection && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Selecionada
              </span>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {subjectClasses.map(renderClassCard)}
          </div>
        </div>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Escolha sua Turma</CardTitle>
        <CardDescription>
          Selecione uma turma por matéria. Você pode escolher Redação,
          Matemática, Exatas, etc. É obrigatório selecionar pelo menos uma
          turma.
        </CardDescription>
        {Object.keys(selectedClasses).length > 0 && (
          <div className="mt-2 text-sm text-primary font-medium">
            {Object.keys(selectedClasses).length} turma(s) selecionada(s)
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="highSchool" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="highSchool">Ensino Médio</TabsTrigger>
              <TabsTrigger value="middleSchool">Ensino Fundamental</TabsTrigger>
            </TabsList>

            <TabsContent value="highSchool" className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-gray-600">Carregando turmas...</p>
                </div>
              ) : classes.highSchool.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">
                    Nenhuma turma disponível para Ensino Médio
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLoading(true);
                      fetchClasses();
                    }}
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                renderClassesBySubject(classes.highSchool)
              )}
            </TabsContent>

            <TabsContent value="middleSchool" className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-gray-600">Carregando turmas...</p>
                </div>
              ) : classes.middleSchool.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">
                    Nenhuma turma disponível para Ensino Fundamental
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLoading(true);
                      fetchClasses();
                    }}
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                renderClassesBySubject(classes.middleSchool)
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 mt-6 border-t">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button type="submit" size="lg">
              Avançar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
