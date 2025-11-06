import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tarefa, Lead } from "@/lib/mockData";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (tarefa: Partial<Tarefa>) => void;
  onDelete?: (id: string) => void;
  tarefa?: Tarefa | null;
  leads: Lead[];
  hideCloseIcon?: boolean;
}

export default function TaskModal({ open, onClose, onSave, onDelete, tarefa, leads }: TaskModalProps) {
  const [leadId, setLeadId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataEntrega, setDataEntrega] = useState<Date>();
  const [status, setStatus] = useState<"pendente" | "concluida">("pendente");
  const [prioridade, setPrioridade] = useState<"baixa" | "media" | "alta">("media");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (tarefa) {
      setLeadId(tarefa.leadId);
      setDescricao(tarefa.descricaoTarefa);
      setDataEntrega(new Date(tarefa.dataEntrega));
      setStatus(tarefa.status);
      setPrioridade(tarefa.prioridade);
    } else {
      setLeadId("");
      setDescricao("");
      setDataEntrega(undefined);
      setStatus("pendente");
      setPrioridade("media");
    }
  }, [tarefa, open]);

  const handleSave = () => {
    if (!descricao || !dataEntrega) return;

    const lead = leads.find(l => l.id === leadId);
    
    onSave({
      id: tarefa?.id,
      leadId: leadId || "",
      nomeLead: lead?.nomeLead || "",
      descricaoTarefa: descricao,
      dataEntrega: format(dataEntrega, "yyyy-MM-dd"),
      status,
      prioridade,
      criadoPor: "Agência Brakeel",
    });

    onClose();
  };

  const handleDelete = () => {
    if (tarefa?.id && onDelete) {
      onDelete(tarefa.id);
      setShowDeleteDialog(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-primary">Nova Tarefa</DialogTitle>
             
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="lead">Nome do Lead</Label>
              <Select value={leadId} onValueChange={setLeadId}>
                <SelectTrigger id="lead">
                  <SelectValue placeholder="Nome do Lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.nomeLead}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tarefa">Tarefa</Label>
              <Textarea
                id="tarefa"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descobrir a dor do cliente e montar apresentação"
                rows={3}
              />
            </div>

            <div>
              <Label>Data de Entrega</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataEntrega && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataEntrega ? format(dataEntrega, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataEntrega}
                    onSelect={setDataEntrega}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
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
          </div>

          <div className="flex justify-between gap-2 mt-6">
             {tarefa && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
          <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!descricao || !dataEntrega}>
              Salvar
            </Button>
          </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
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
