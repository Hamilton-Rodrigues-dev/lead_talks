import { useState } from "react";
import { mockLeads, mockNotas, Lead, NotaLead } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import LeadDetailModal from "@/components/LeadDetailModal";
import { toast } from "sonner";

interface LeadsListaProps {
  busca: string;
}

const etapaLabels: Record<Lead['etapaFunil'], string> = {
  novo: 'Contato Inicial',
  contato: 'Diagnóstico da Dor do Cliente',
  proposta: 'Apresentação Agendada',
  fechamento: 'Fechamento',
};

const etapaColors: Record<Lead['etapaFunil'], string> = {
  novo: 'bg-emerald-500',
  contato: 'bg-red-500',
  proposta: 'bg-blue-500',
  fechamento: 'bg-purple-500',
};

export default function LeadsLista({ busca }: LeadsListaProps) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [notas, setNotas] = useState<NotaLead[]>(mockNotas);
  const [modalOpen, setModalOpen] = useState(false);
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);

  const leadsFiltrados = leads.filter((lead) =>
    lead.nomeLead.toLowerCase().includes(busca.toLowerCase()) ||
    lead.empresa.toLowerCase().includes(busca.toLowerCase())
  );

  const handleSaveLead = (lead: Lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
    toast.success("Lead atualizado com sucesso!");
  };

  const handleAddNota = (nota: Omit<NotaLead, "id" | "criadoEm">) => {
    const novaNota: NotaLead = {
      ...nota,
      id: Date.now().toString(),
      criadoEm: new Date().toISOString(),
    };
    setNotas(prev => [...prev, novaNota]);
    toast.success("Nota adicionada com sucesso!");
  };

  const handleRowClick = (lead: Lead) => {
    setLeadSelecionado(lead);
    setModalOpen(true);
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 bg-muted/30 border-b border-border">
        <h3 className="font-semibold">
          Listagem de Leads <span className="text-muted-foreground">Total {leadsFiltrados.length}</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left p-4 font-semibold text-sm">Nome</th>
              <th className="text-left p-4 font-semibold text-sm">Segmento</th>
              <th className="text-left p-4 font-semibold text-sm">Telefone</th>
              <th className="text-left p-4 font-semibold text-sm">Etapa</th>
            </tr>
          </thead>
          <tbody>
            {leadsFiltrados.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => handleRowClick(lead)}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <td className="p-4 font-medium">{lead.nomeLead}</td>
                <td className="p-4 text-muted-foreground">{lead.empresa}</td>
                <td className="p-4 text-muted-foreground">{lead.telefone}</td>
                <td className="p-4">
                  <Badge className={etapaColors[lead.etapaFunil]}>
                    {etapaLabels[lead.etapaFunil]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LeadDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveLead}
        lead={leadSelecionado}
        notas={notas}
        onAddNota={handleAddNota}
      />
    </div>
  );
}
