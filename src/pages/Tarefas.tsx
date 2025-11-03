import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { mockTarefas, mockLeads, Tarefa } from "@/lib/mockData";
import TaskModal from "@/components/TaskModal";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function Tarefas() {
  const [busca, setBusca] = useState("");
  const [tarefas, setTarefas] = useState<Tarefa[]>(
    [...mockTarefas].sort((a, b) => 
      new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime()
    )
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null);

  const tarefasFiltradas = tarefas.filter((tarefa) =>
    tarefa.nomeLead.toLowerCase().includes(busca.toLowerCase()) ||
    tarefa.descricaoTarefa.toLowerCase().includes(busca.toLowerCase())
  );

  const handleSaveTarefa = (tarefaData: Partial<Tarefa>) => {
    const agora = new Date().toISOString();
    
    if (tarefaData.id) {
      // Edit existing
      setTarefas(prev => {
        const updated = prev.map(t => 
          t.id === tarefaData.id 
            ? { ...t, ...tarefaData, atualizadoEm: agora } as Tarefa
            : t
        );
        return updated.sort((a, b) => 
          new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime()
        );
      });
      toast.success("Tarefa atualizada com sucesso!");
    } else {
      // Create new
      const novaTarefa: Tarefa = {
        ...tarefaData,
        id: Date.now().toString(),
        criadoEm: agora,
        atualizadoEm: agora,
      } as Tarefa;
      
      setTarefas(prev => [novaTarefa, ...prev]);
      toast.success("Tarefa criada com sucesso!");
    }
  };

  const handleDeleteTarefa = (id: string) => {
    setTarefas(prev => prev.filter(t => t.id !== id));
    toast.success("Tarefa excluída com sucesso!");
  };

  const handleOpenModal = (tarefa?: Tarefa) => {
    setTarefaSelecionada(tarefa || null);
    setModalOpen(true);
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-amber-500';
      case 'baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tarefas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas tarefas e compromissos
            </p>
          </div>
          <Button size="lg" onClick={() => handleOpenModal()}>
            <Plus className="w-5 h-5 mr-2" />
            Nova tarefa
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar contatos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 h-12 bg-card"
            />
          </div>
          <Button variant="outline">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </div>

        {/* Lista */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 bg-muted/30 border-b border-border">
            <h3 className="font-semibold">Listagem de tarefas</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-4 font-semibold text-sm">Nome</th>
                  <th className="text-left p-4 font-semibold text-sm">Tarefa</th>
                  <th className="text-left p-4 font-semibold text-sm">Data de Entrega</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-left p-4 font-semibold text-sm">Prioridade</th>
                </tr>
              </thead>
              <tbody>
                {tarefasFiltradas.map((tarefa) => (
                  <tr
                    key={tarefa.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => handleOpenModal(tarefa)}
                  >
                    <td className="p-4 font-medium">{tarefa.nomeLead}</td>
                    <td className="p-4 text-muted-foreground">{tarefa.descricaoTarefa}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(tarefa.dataEntrega).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <Badge variant={tarefa.status === 'concluida' ? 'default' : 'secondary'}>
                        {tarefa.status === 'concluida' ? 'Concluída' : 'Pendente'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getPrioridadeColor(tarefa.prioridade)}>
                        {tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <TaskModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveTarefa}
          onDelete={handleDeleteTarefa}
          tarefa={tarefaSelecionada}
          leads={mockLeads}
        />
      </div>
    </Layout>
  );
}
