import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarEvent, Lead } from "@/lib/mockData";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface CalendarEventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: Partial<CalendarEvent>) => void;
  onDelete?: (id: string) => void;
  event?: CalendarEvent | null;
  selectedDate?: Date;
  selectedTime?: string;
  leads: Lead[];
}

export default function CalendarEventModal({ 
  open, 
  onClose, 
  onSave, 
  onDelete, 
  event, 
  selectedDate, 
  selectedTime,
  leads 
}: CalendarEventModalProps) {
  const [tipo, setTipo] = useState<"tarefa" | "nota" | "reuniao">("tarefa");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [leadId, setLeadId] = useState("");
  const [data, setData] = useState<Date>();
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [status, setStatus] = useState<"pendente" | "concluida">("pendente");
  const [prioridade, setPrioridade] = useState<"baixa" | "media" | "alta">("media");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (event) {
      try {
        setTipo(event.tipo || "tarefa");
        setTitulo(event.titulo || "");
        setDescricao(event.descricao || "");
        setLeadId(event.leadId || "");
        
        if (event.data) {
          try {
            setData(new Date(event.data));
          } catch {
            setData(new Date());
          }
        } else {
          setData(new Date());
        }
        
        setHoraInicio(event.horaInicio || "");
        setHoraFim(event.horaFim || "");
        setStatus(event.status || "pendente");
        setPrioridade(event.prioridade || "media");
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
        setTipo("tarefa");
        setTitulo("");
        setDescricao("");
        setLeadId("");
        setData(new Date());
        setHoraInicio("");
        setHoraFim("");
        setStatus("pendente");
        setPrioridade("media");
      }
    } else {
      setTipo((event as any)?.tipo || "tarefa");
      setTitulo("");
      setDescricao("");
      setLeadId((event as any)?.leadId || "");
      setData(selectedDate || new Date());
      setHoraInicio(selectedTime || "");
      setHoraFim("");
      setStatus("pendente");
      setPrioridade("media");
    }
  }, [event, selectedDate, selectedTime, open]);

  const handleSave = () => {
    if (!titulo || !data) return;

    const lead = leads.find(l => l.id === leadId);

    onSave({
      id: event?.id,
      tipo,
      titulo,
      descricao,
      leadId: leadId || undefined,
      nomeLead: lead?.nomeLead,
      data: format(data, "yyyy-MM-dd"),
      horaInicio: tipo === "reuniao" || tipo === "tarefa" ? horaInicio : undefined,
      horaFim: tipo === "reuniao" ? horaFim : undefined,
      status: tipo === "tarefa" ? status : undefined,
      prioridade: tipo === "tarefa" ? prioridade : undefined,
    });

    onClose();
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
      setShowDeleteDialog(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-primary">
                {event ? "Editar Evento" : "Novo Evento"}
              </DialogTitle>
              {event && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <Tabs value={tipo} onValueChange={(v) => setTipo(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tarefa">Tarefa</TabsTrigger>
              <TabsTrigger value="nota">Anotação</TabsTrigger>
              <TabsTrigger value="reuniao">Reunião</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Título do evento"
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Adicione uma descrição..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="lead">Lead (opcional)</Label>
                <Select value={leadId} onValueChange={setLeadId}>
                  <SelectTrigger id="lead">
                    <SelectValue placeholder="Selecione um lead" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.nomeLead}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !data && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {data ? format(data, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={data}
                      onSelect={setData}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {tipo === "reuniao" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="horaInicio">Hora Início</Label>
                    <Input
                      id="horaInicio"
                      type="time"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="horaFim">Hora Fim</Label>
                    <Input
                      id="horaFim"
                      type="time"
                      value={horaFim}
                      onChange={(e) => setHoraFim(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {tipo === "tarefa" && (
                <>
                  <div>
                    <Label htmlFor="horaInicio">Horário</Label>
                    <Input
                      id="horaInicio"
                      type="time"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="concluida">Concluída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="prioridade">Prioridade</Label>
                      <Select value={prioridade} onValueChange={(v) => setPrioridade(v as any)}>
                        <SelectTrigger id="prioridade">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!titulo || !data}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Evento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
