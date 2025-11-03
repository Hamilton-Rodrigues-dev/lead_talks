import { mockLeads, mockNotas, Lead, NotaLead, EtapaFunil } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface LeadsKanbanProps {
  busca: string;
  leads: Lead[];
  notas: NotaLead[];
  onLeadClick: (lead: Lead) => void;
  onUpdateLeads: (leads: Lead[]) => void;
  etapas: EtapaFunil[];
  onAddEtapa: () => void;
}

export default function LeadsKanban({ 
  busca, 
  leads, 
  notas, 
  onLeadClick, 
  onUpdateLeads,
  etapas,
  onAddEtapa 
}: LeadsKanbanProps) {

  const leadsFiltrados = (leads || []).filter((lead) =>
    lead.nomeLead.toLowerCase().includes(busca.toLowerCase()) ||
    lead.empresa.toLowerCase().includes(busca.toLowerCase())
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const novaEtapa = destination.droppableId;
    
    const updatedLeads = (leads || []).map(lead => 
      lead.id === draggableId 
        ? { ...lead, etapaFunil: novaEtapa }
        : lead
    );
    
    onUpdateLeads(updatedLeads);
    const etapaLabel = etapas.find(e => e.id === novaEtapa)?.label || novaEtapa;
    toast.success(`Lead movido para ${etapaLabel}`);
  };

  const getLeadsPorEtapa = (etapaId: string) => {
    return leadsFiltrados.filter(lead => lead.etapaFunil === etapaId);
  };

  const calcularTotal = (leadsEtapa: Lead[]) => {
    return leadsEtapa.reduce((sum, lead) => sum + lead.valorVenda, 0);
  };

  const etapasOrdenadas = [...etapas].sort((a, b) => a.ordem - b.ordem);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {etapasOrdenadas.map((etapa) => {
          const leadsEtapa = getLeadsPorEtapa(etapa.id);
          const total = calcularTotal(leadsEtapa);

          return (
            <div key={etapa.id} className="flex-shrink-0 w-[320px] space-y-4">
              {/* Header */}
              <div className={`${etapa.cor} ${etapa.borderColor} ${etapa.textColor} border-2 rounded-lg p-4`}>
                <h3 className="font-semibold">{etapa.label}</h3>
                <p className="text-sm mt-1">
                  {leadsEtapa.length} leads: R$ {total.toFixed(2)}
                </p>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={etapa.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[400px] rounded-lg p-3 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-muted' : ''
                    }`}
                  >
                    {leadsEtapa.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onLeadClick(lead)}
                            className={`p-4 cursor-pointer transition-shadow ${
                              snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'
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
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
        
        {/* Coluna para adicionar nova etapa */}
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
