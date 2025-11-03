import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { mockCalendarEvents, mockLeads, CalendarEvent } from "@/lib/mockData";
import CalendarEventModal from "@/components/CalendarEventModal";
import CalendarWeekView from "@/components/CalendarWeekView";
import { toast } from "sonner";
import { startOfWeek, addWeeks, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";

export default function Calendario() {
  const [visualizacao, setVisualizacao] = useState<'mes' | 'semana'>('semana');
  const [mesAtual, setMesAtual] = useState(new Date(2025, 9, 1)); // Outubro 2025
  const [semanaAtual, setSemanaAtual] = useState(startOfWeek(new Date(2025, 9, 27), { weekStartsOn: 1 }));
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventSelecionado, setEventSelecionado] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  const nomeMes = mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const nomeSemana = format(semanaAtual, "'Semana de' dd 'de' MMMM", { locale: ptBR });

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    const agora = new Date().toISOString();
    
    if (eventData.id) {
      // Edit existing
      setEvents(prev => 
        prev.map(e => e.id === eventData.id ? { ...e, ...eventData } as CalendarEvent : e)
      );
      toast.success("Evento atualizado com sucesso!");
    } else {
      // Create new
      const novoEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(),
        criadoEm: agora,
      } as CalendarEvent;
      
      setEvents(prev => [...prev, novoEvent]);
      toast.success("Evento criado com sucesso!");
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    toast.success("Evento excluído com sucesso!");
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setEventSelecionado(null);
    setModalOpen(true);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    setEventSelecionado(null);
    setModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEventSelecionado(event);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setModalOpen(true);
  };

  const getDiasDoMes = () => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaDaSemanaInicio = primeiroDia.getDay();

    const dias = [];
    
    // Dias do mês anterior
    const diasMesAnterior = new Date(ano, mes, 0).getDate();
    for (let i = diaDaSemanaInicio - 1; i >= 0; i--) {
      dias.push({ dia: diasMesAnterior - i, mesAtual: false });
    }

    // Dias do mês atual
    for (let i = 1; i <= diasNoMes; i++) {
      dias.push({ dia: i, mesAtual: true });
    }

    // Completar com dias do próximo mês
    const diasRestantes = 42 - dias.length;
    for (let i = 1; i <= diasRestantes; i++) {
      dias.push({ dia: i, mesAtual: false });
    }

    return dias;
  };

  const hoje = new Date().getDate();
  const mesAtualHoje = new Date().getMonth() === mesAtual.getMonth();

  const getEventosParaDia = (dia: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.data);
      return eventDate.getDate() === dia && 
             eventDate.getMonth() === mesAtual.getMonth() &&
             eventDate.getFullYear() === mesAtual.getFullYear();
    });
  };

  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendário</h1>
          </div>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                className="pl-9 bg-card"
              />
            </div>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar
            </Button>
            <Button onClick={() => handleDayClick(new Date())}>
              <Plus className="w-4 h-4 mr-2" />
              Nova tarefa
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold capitalize">
                {visualizacao === 'mes' ? nomeMes : nomeSemana}
              </h2>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (visualizacao === 'mes') {
                      setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1));
                    } else {
                      setSemanaAtual(addWeeks(semanaAtual, -1));
                    }
                  }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const hoje = new Date();
                    setMesAtual(hoje);
                    setSemanaAtual(startOfWeek(hoje, { weekStartsOn: 1 }));
                  }}
                >
                  Hoje
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (visualizacao === 'mes') {
                      setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1));
                    } else {
                      setSemanaAtual(addWeeks(semanaAtual, 1));
                    }
                  }}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={visualizacao === 'mes' ? 'default' : 'outline'}
                onClick={() => setVisualizacao('mes')}
              >
                Mês
              </Button>
              <Button
                variant={visualizacao === 'semana' ? 'default' : 'outline'}
                onClick={() => setVisualizacao('semana')}
              >
                Semana
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        {visualizacao === 'semana' ? (
          <CalendarWeekView
            weekStart={semanaAtual}
            events={events}
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={handleEventClick}
          />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Header dias da semana */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/30">
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia) => (
              <div key={dia} className="p-4 text-center font-semibold text-sm">
                {dia}
              </div>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-7">
            {getDiasDoMes().map((item, index) => {
              const isHoje = item.dia === hoje && item.mesAtual && mesAtualHoje;

              return (
                <div
                  key={index}
                  className={`min-h-[120px] border-r border-b border-border p-2 ${
                    !item.mesAtual ? 'bg-muted/20 text-muted-foreground' : 'hover:bg-muted/30'
                  } transition-colors cursor-pointer`}
                  onClick={() => item.mesAtual && handleDayClick(new Date(mesAtual.getFullYear(), mesAtual.getMonth(), item.dia))}
                >
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      isHoje ? 'bg-primary text-primary-foreground' : ''
                    }`}
                  >
                    {item.dia}
                  </div>

                  {item.mesAtual && (
                    <div className="mt-2 space-y-1">
                      {getEventosParaDia(item.dia).map((evento) => (
                        <div
                          key={evento.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(evento);
                          }}
                          className={`text-xs p-2 rounded cursor-pointer transition-colors ${
                            evento.tipo === 'tarefa' ? 'bg-blue-500 hover:bg-blue-600' :
                            evento.tipo === 'nota' ? 'bg-red-500 hover:bg-red-600' :
                            'bg-green-500 hover:bg-green-600'
                          } text-white`}
                        >
                          <div className="font-medium truncate">{evento.titulo}</div>
                          {evento.horaInicio && (
                            <div className="text-xs opacity-90 mt-1">{evento.horaInicio}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        )}

        <CalendarEventModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          event={eventSelecionado}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          leads={mockLeads}
        />
      </div>
    </Layout>
  );
}
