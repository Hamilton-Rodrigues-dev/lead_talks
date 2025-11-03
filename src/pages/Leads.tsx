import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, LayoutGrid, List } from "lucide-react";
import { mockLeads } from "@/lib/mockData";
import LeadsKanban from "@/components/LeadsKanban";
import LeadsLista from "@/components/LeadsLista";

export default function Leads() {
  const [busca, setBusca] = useState("");
  const [visualizacao, setVisualizacao] = useState<'kanban' | 'lista'>('kanban');

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
          <Button size="lg">
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
          <LeadsKanban busca={busca} />
        ) : (
          <LeadsLista busca={busca} />
        )}
      </div>
    </Layout>
  );
}
