import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lead, NotaLead } from "@/lib/mockData";
import { ChevronLeft, MoreVertical, Plus, Mic } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface LeadDetailModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  lead: Lead | null;
  notas: NotaLead[];
  onAddNota: (nota: Omit<NotaLead, "id" | "criadoEm">) => void;
}

const etapaLabels: Record<Lead['etapaFunil'], string> = {
  novo: 'Novo Lead',
  contato: 'Contato',
  proposta: 'Proposta',
  fechamento: 'Fechamento',
};

const etapaColors: Record<Lead['etapaFunil'], string> = {
  novo: 'bg-emerald-500',
  contato: 'bg-red-500',
  proposta: 'bg-blue-500',
  fechamento: 'bg-purple-500',
};

export default function LeadDetailModal({ open, onClose, onSave, lead, notas, onAddNota }: LeadDetailModalProps) {
  const [formData, setFormData] = useState<Lead | null>(null);
  const [novaNota, setNovaNota] = useState("");

  useEffect(() => {
    if (lead) {
      setFormData({ ...lead });
    }
  }, [lead]);

  if (!formData) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleAddNota = () => {
    if (!novaNota.trim()) return;
    
    onAddNota({
      leadId: formData.id,
      texto: novaNota,
      autor: "Agência Brakeel",
      tipo: "nota",
    });
    
    setNovaNota("");
  };

  const leadNotas = notas.filter(n => n.leadId === formData.id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-lg font-semibold">{formData.nomeLead}</h2>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Funil de Vendas</Label>
                  <Select value={formData.etapaFunil} onValueChange={(v) => setFormData({ ...formData, etapaFunil: v as any })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(etapaLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          <Badge className={etapaColors[key as Lead['etapaFunil']]}>{label}</Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Usuário responsável</Label>
                    <p className="font-medium">{formData.responsavel}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Venda</Label>
                    <Input
                      type="number"
                      value={formData.valorVenda}
                      onChange={(e) => setFormData({ ...formData, valorVenda: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Recorrência</Label>
                    <Input
                      type="number"
                      value={formData.valorMensal}
                      onChange={(e) => setFormData({ ...formData, valorMensal: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="principal" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="w-full justify-start rounded-none border-b px-6">
                <TabsTrigger value="principal">Principal</TabsTrigger>
                <TabsTrigger value="briefing">Briefing de Prospecção</TabsTrigger>
                <TabsTrigger value="config">Configurações</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <TabsContent value="principal" className="p-6 space-y-4 mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label>Nome do Lead</Label>
                      <Input
                        value={formData.nomeLead}
                        onChange={(e) => setFormData({ ...formData, nomeLead: e.target.value })}
                        placeholder="Nome do Lead"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tel. comercial</Label>
                        <Input
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          placeholder="Número de Telefone"
                        />
                      </div>
                      <div>
                        <Label>E-mail comercial</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@exemplo.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Empresa</Label>
                      <Input
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        placeholder="Nome da empresa"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Posição</Label>
                        <Input placeholder="Ex: CEO, Gerente" />
                      </div>
                      <div>
                        <Label>Especialidade</Label>
                        <Input placeholder="Ex: Marketing, Vendas" />
                      </div>
                    </div>

                    <div>
                      <Label>Endereço</Label>
                      <Input placeholder="Endereço completo" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Site</Label>
                        <Input placeholder="www.exemplo.com" />
                      </div>
                      <div>
                        <Label>Instagram</Label>
                        <Input placeholder="@usuario" />
                      </div>
                    </div>

                    <div>
                      <Label>Nicho</Label>
                      <Input placeholder="Segmento de atuação" />
                    </div>

                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar empresa
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="briefing" className="p-6 mt-0">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Informações adicionais sobre a prospecção do lead.</p>
                    <Textarea
                      placeholder="Adicione informações sobre o briefing..."
                      rows={10}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="config" className="p-6 mt-0">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Configurações do lead.</p>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            {/* Footer */}
            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Adicionar
              </Button>
            </div>
          </div>

          {/* Sidebar - Histórico */}
          <div className="w-96 border-l bg-muted/20 flex flex-col">
            <div className="p-4 border-b bg-primary/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Adição do Lead</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(formData.criadoEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {leadNotas.map((nota) => (
                  <div key={nota.id} className="bg-card p-3 rounded-lg border text-sm">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium">{nota.autor}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(nota.criadoEm), "dd/MM HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{nota.texto}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {nota.tipo}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Button size="sm" className="flex-1">
                  Notas
                </Button>
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={novaNota}
                  onChange={(e) => setNovaNota(e.target.value)}
                  placeholder="Escreva uma nota..."
                  rows={2}
                  className="flex-1"
                />
                <Button size="icon" variant="outline">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={handleAddNota} className="w-full" disabled={!novaNota.trim()}>
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
