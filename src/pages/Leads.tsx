import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, LayoutGrid, List } from "lucide-react";
import { mockLeads, mockNotas, mockEtapasFunil, Lead, NotaLead, CalendarEvent, EtapaFunil, getCurrentTimestamp } from "@/lib/mockData";
import LeadsKanban from "@/components/LeadsKanban";
import LeadsLista from "@/components/LeadsLista";
import LeadDetailModal from "@/components/LeadDetailModal";
import CalendarEventModal from "@/components/CalendarEventModal";
import EtapaConfigModal from "@/components/EtapaConfigModal";
import { toast } from "sonner";

export default function Leads() {
  const [busca, setBusca] = useState("");
  const [visualizacao, setVisualizacao] = useState<'kanban' | 'lista'>('kanban');
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [notas, setNotas] = useState<NotaLead[]>(mockNotas);
  const [modalOpen, setModalOpen] = useState(false);
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Partial<CalendarEvent> | null>(null);
  const [etapas, setEtapas] = useState<EtapaFunil[]>(mockEtapasFunil);
  const [etapaModalOpen, setEtapaModalOpen] = useState(false);
  const [etapaEditando, setEtapaEditando] = useState<EtapaFunil | null>(null);

  const handleNovaLead = (etapaId: string) => {
    const novoLead: Lead = {
      id: Date.now().toString(),
      nomeLead: "",
      telefone: "",
      email: "",
      empresa: "",
      etapaFunil: etapaId,
      responsavel: "Agência Brakeel",
      valorVenda: 0,
      valorMensal: 0,
      criadoEm: getCurrentTimestamp(),
      atualizadoEm: getCurrentTimestamp(),
      tags: [],
    };
    setLeadSelecionado(novoLead);
    setModalOpen(true);
  };

  const handleSaveLead = (lead: Lead) => {
    const leadExiste = leads.find(l => l.id === lead.id);
    
    if (leadExiste) {
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...lead, atualizadoEm: getCurrentTimestamp() } : l));
      toast.success("Lead atualizado com sucesso!");
    } else {
      setLeads(prev => [lead, ...prev]);
      toast.success("Lead criado com sucesso!");
    }
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    setNotas(prev => prev.filter(n => n.leadId !== id));
    toast.success("Lead excluído com sucesso!");
  };

  const handleAddNota = (nota: Omit<NotaLead, "id" | "criadoEm">) => {
    const novaNota: NotaLead = {
      ...nota,
      id: Date.now().toString(),
      criadoEm: getCurrentTimestamp(),
    };
    setNotas(prev => [...prev, novaNota]);
    toast.success("Nota adicionada com sucesso!");
  };

  const handleCreateTask = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    setEventoSelecionado({
      tipo: "tarefa",
      leadId: leadId,
      nomeLead: lead?.nomeLead,
    });
    setModalOpen(false);
    setCalendarModalOpen(true);
  };

  const handleCreateMeeting = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    setEventoSelecionado({
      tipo: "reuniao",
      leadId: leadId,
      nomeLead: lead?.nomeLead,
    });
    setModalOpen(false);
    setCalendarModalOpen(true);
  };

  const handleSaveCalendarEvent = (eventData: Partial<CalendarEvent>) => {
    const eventoId = eventData.id || Date.now().toString();
    
    // Adicionar ao histórico do lead
    if (eventData.leadId) {
      const nota: NotaLead = {
        id: Date.now().toString() + "_nota",
        leadId: eventData.leadId,
        texto: `${eventData.tipo === 'tarefa' ? 'Tarefa' : 'Reunião'}: ${eventData.titulo}`,
        autor: "Agência Brakeel",
        criadoEm: getCurrentTimestamp(),
        tipo: eventData.tipo as 'tarefa' | 'reuniao',
        calendarioEventoId: eventoId,
      };
      setNotas(prev => [...prev, nota]);
    }
    
    toast.success(`${eventData.tipo === 'tarefa' ? 'Tarefa' : 'Reunião'} criada e adicionada ao calendário!`);
    setCalendarModalOpen(false);
    setModalOpen(true);
  };

  const handleSaveEtapa = (etapa: EtapaFunil) => {
    const etapaExiste = etapas.find(e => e.id === etapa.id);
    
    if (etapaExiste) {
      setEtapas(prev => prev.map(e => e.id === etapa.id ? etapa : e));
      toast.success("Etapa atualizada!");
    } else {
      setEtapas(prev => [...prev, etapa]);
      toast.success("Etapa criada!");
    }
    setEtapaModalOpen(false);
    setEtapaEditando(null);
  };

  const handleAddEtapa = () => {
    setEtapaEditando(null);
    setEtapaModalOpen(true);
  };

  const handleNovaLeadPadrao = () => handleNovaLead("novo");





  

  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seu funil de vendas
            </p>
          </div>
          <Button size="lg" onClick={handleNovaLeadPadrao}>
            <Plus className="w-5 h-5 mr-2" />
            Nova Lead
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar leads..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 h-12 bg-card"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={visualizacao === 'kanban' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setVisualizacao('kanban')}
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              variant={visualizacao === 'lista' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setVisualizacao('lista')}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {visualizacao === 'kanban' ? (
          <LeadsKanban 
            busca={busca} 
            leads={leads}
            notas={notas}
            onLeadClick={(lead) => {
              setLeadSelecionado(lead);
              setModalOpen(true);
            }}
            onUpdateLeads={setLeads}
            etapas={etapas}
            onAddEtapa={handleAddEtapa}
             onAddLead={handleNovaLead}
          />
        ) : (
          <LeadsLista 
            busca={busca}
            leads={leads}
            notas={notas}
            onLeadClick={(lead) => {
              setLeadSelecionado(lead);
              setModalOpen(true);
            }}
          />
        )}

        <LeadDetailModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveLead}
          onDelete={handleDeleteLead}
          lead={leadSelecionado}
          notas={notas}
          onAddNota={handleAddNota}
          onCreateTask={handleCreateTask}
          onCreateMeeting={handleCreateMeeting}
          etapas={etapas}
        />
  
        <CalendarEventModal
          open={calendarModalOpen}
          onClose={() => {
            setCalendarModalOpen(false);
            setModalOpen(true);
          }}
          onSave={handleSaveCalendarEvent}
          event={eventoSelecionado as any}
          leads={leads}
        />

        <EtapaConfigModal
          open={etapaModalOpen}
          onClose={() => {
            setEtapaModalOpen(false);
            setEtapaEditando(null);
          }}
          onSave={handleSaveEtapa}
          etapa={etapaEditando}
          existingEtapas={etapas}
        />
      </div>
    </Layout>
  );
}
