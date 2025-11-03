import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { mockTarefas, Tarefa } from "@/lib/mockData";

export default function Tarefas() {
  const [busca, setBusca] = useState("");
  const [tarefas] = useState<Tarefa[]>(mockTarefas);

  const tarefasFiltradas = tarefas.filter((tarefa) =>
    tarefa.nomeLead.toLowerCase().includes(busca.toLowerCase()) ||
    tarefa.descricaoTarefa.toLowerCase().includes(busca.toLowerCase())
  );

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
          <Button size="lg">
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
                </tr>
              </thead>
              <tbody>
                {tarefasFiltradas.map((tarefa) => (
                  <tr
                    key={tarefa.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 font-medium">{tarefa.nomeLead}</td>
                    <td className="p-4 text-muted-foreground">{tarefa.descricaoTarefa}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(tarefa.dataEntrega).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
