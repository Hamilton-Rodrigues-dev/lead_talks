import { useState } from "react";
import { mockLeads, mockNotas, Lead, NotaLead } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import LeadDetailModal from "@/components/LeadDetailModal";

interface LeadsKanbanProps {
  busca: string;
  leads: Lead[];
  notas: NotaLead[];
  onLeadClick: (lead: Lead) => void;
  onUpdateLeads: (leads: Lead[]) => void;
}

const etapas = [
  { id: 'novo', label: 'Contato Inicial', color: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
  { id: 'contato', label: 'Diagnóstico da Dor do Cliente', color: 'bg-red-100 border-red-300 text-red-700' },
  { id: 'proposta', label: 'Apresentação Agendada', color: 'bg-blue-100 border-blue-300 text-blue-700' },
];

export default function LeadsKanban({ busca, leads, notas, onLeadClick, onUpdateLeads }: LeadsKanbanProps) {

  const leadsFiltrados = leads.filter((lead) =>
    lead.nomeLead.toLowerCase().includes(busca.toLowerCase()) ||
    lead.empresa.toLowerCase().includes(busca.toLowerCase())
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const novaEtapa = destination.droppableId as Lead['etapaFunil'];
    
    const updatedLeads = leads.map(lead => 
      lead.id === draggableId 
        ? { ...lead, etapaFunil: novaEtapa }
        : lead
    );
    
    onUpdateLeads(updatedLeads);
    toast.success(`Lead movido para ${etapas.find(e => e.id === novaEtapa)?.label}`);
  };

  const getLeadsPorEtapa = (etapaId: string) => {
    return leadsFiltrados.filter(lead => lead.etapaFunil === etapaId);
  };

  const calcularTotal = (leadsEtapa: Lead[]) => {
    return leadsEtapa.reduce((sum, lead) => sum + lead.valorVenda, 0);
  };


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {etapas.map((etapa) => {
          const leadsEtapa = getLeadsPorEtapa(etapa.id);
          const total = calcularTotal(leadsEtapa);

          return (
            <div key={etapa.id} className="space-y-4">
              {/* Header */}
              <div className={`${etapa.color} border-2 rounded-lg p-4`}>
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
      </div>

    </DragDropContext>
  );
}
