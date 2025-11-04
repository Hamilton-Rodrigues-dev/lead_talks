
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Lead, NotaLead, EtapaFunil } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { useDragScroll } from "@/hooks/use-drag-scroll"; // 👈 hook de scroll arrastável

// Tipagem das props
interface LeadsKanbanProps {
  busca: string;
  leads: Lead[];
  notas: NotaLead[];
  etapas: EtapaFunil[];
  onLeadClick: (lead: Lead) => void;
  onUpdateLeads: (leads: Lead[]) => void;
  onAddEtapa: () => void;
  onAddLead: (etapaId: string) => void; // 👈 função recebida da página principal
}

export default function LeadsKanban({
  busca,
  leads,
  notas,
  etapas,
  onLeadClick,
  onUpdateLeads,
  onAddEtapa,
  onAddLead,
}: LeadsKanbanProps) {
  const dragScroll = useDragScroll(); // 👈 ativa arrasto horizontal no fundo

  // 🔍 Filtragem
  const leadsFiltrados = (leads || []).filter(
    (lead) =>
      lead.nomeLead.toLowerCase().includes(busca.toLowerCase()) ||
      lead.empresa.toLowerCase().includes(busca.toLowerCase())
  );

  // 🔁 Movimentação de leads entre etapas
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const novaEtapa = destination.droppableId;

    const updatedLeads = (leads || []).map((lead) =>
      lead.id === draggableId ? { ...lead, etapaFunil: novaEtapa } : lead
    );

    onUpdateLeads(updatedLeads);

    const etapaLabel = etapas.find((e) => e.id === novaEtapa)?.label || novaEtapa;
    toast.success(`Lead movido para ${etapaLabel}`);
  };

  // 🔢 Agrupamento e totalização
  const getLeadsPorEtapa = (etapaId: string) =>
    leadsFiltrados.filter((lead) => lead.etapaFunil === etapaId);

  const calcularTotal = (leadsEtapa: Lead[]) =>
    leadsEtapa.reduce((sum, lead) => sum + lead.valorVenda, 0);

  const etapasOrdenadas = [...etapas].sort((a, b) => a.ordem - b.ordem);

  // 🧩 Renderização
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        ref={dragScroll.ref}
        onMouseDown={dragScroll.onMouseDown}
        onMouseLeave={dragScroll.onMouseLeave}
        onMouseUp={dragScroll.onMouseUp}
        onMouseMove={dragScroll.onMouseMove}
        className={`flex gap-6 overflow-x-auto pb-4 select-none ${
          dragScroll.isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {etapasOrdenadas.map((etapa) => {
          const leadsEtapa = getLeadsPorEtapa(etapa.id);
          const total = calcularTotal(leadsEtapa);

          return (
            <div key={etapa.id} className="flex-shrink-0 w-[320px] space-y-4">
              {/* --- Cabeçalho da coluna --- */}
              <div
                className={`${etapa.cor} ${etapa.borderColor} ${etapa.textColor} border-2 rounded-lg p-4`}
              >
                <h3 className="font-semibold">{etapa.label}</h3>
                <p className="text-sm mt-1">
                  {leadsEtapa.length} leads: R$ {total.toFixed(2)}
                </p>
              </div>

              {/* --- Área de leads (droppable) --- */}
              <Droppable droppableId={etapa.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[400px] rounded-lg p-3 transition-colors ${
                      snapshot.isDraggingOver ? "bg-muted" : ""
                    }`}
                  >
                    {/* --- Cards de lead --- */}
                    {leadsEtapa.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            data-drag-item // 👈 impede conflito com scroll arrastável
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onLeadClick(lead)}
                            className={`p-4 cursor-pointer transition-shadow ${
                              snapshot.isDragging ? "shadow-lg rotate-2" : "hover:shadow-md"
                            }`}
                          >
                            <h4 className="font-medium text-sm mb-2">{lead.nomeLead}</h4>
                            <p className="text-xs text-muted-foreground mb-3">{lead.telefone}</p>

                            <div className="flex items-center justify-between text-xs">
                              <div>
                                <span className="text-muted-foreground">Venda: </span>
                                <span className="font-medium">R$ {lead.valorVenda.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Mensal: </span>
                                <span className="font-medium">R$ {lead.valorMensal.toFixed(2)}</span>
                              </div>
                            </div>

                            {lead.tags && lead.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {lead.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {lead.valorVenda === 0 && (
                              <p className="text-xs text-red-500 mt-2">Sem tarefa</p>
                            )}
                          </Card>
                        )}
                      </Draggable>
                    ))}

                    {/* --- Botão para adicionar novo lead na etapa --- */}
                    <Card
                      onClick={() => onAddLead(etapa.id)}
                      className="h-[80px] border-2 border-dashed border-muted-foreground/40 
                                 flex items-center justify-center cursor-pointer 
                                 hover:bg-muted/40 transition"
                    >
                      <Plus className="w-6 h-6 text-muted-foreground" />
                    </Card>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}

        {/* --- Coluna para adicionar nova etapa --- */}
        <div className="flex-shrink-0 w-[320px]">
          <Button
            variant="outline"
            className="w-full h-[100px] border-dashed border-2 hover:bg-muted/50"
            onClick={onAddEtapa}
          >
            <Plus className="w-8 h-8" />
          </Button>
          <p className="text-sm text-center text-muted-foreground mt-2">
            Adicionar Nova Etapa
          </p>
        </div>
      </div>
    </DragDropContext>
  );
}
