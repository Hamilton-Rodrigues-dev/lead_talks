import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { mockLeads, mockTarefas } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const leadsAtivos = mockLeads.length;
  const tarefasPendentes = mockTarefas.filter(t => t.status === 'pendente').length;
  const tarefasConcluidas = mockTarefas.filter(t => t.status === 'concluida').length;
  const totalTarefas = mockTarefas.length;
  const percentualConclusao = totalTarefas > 0 
    ? Math.round((tarefasConcluidas / totalTarefas) * 100) 
    : 0;

  const leadsPorSegmento = mockLeads.reduce((acc, lead) => {
    acc[lead.etapaFunil] = (acc[lead.etapaFunil] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
const navigate = useNavigate();
  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do seu pipeline de vendas
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card onClick={() => navigate("/leads")} className="border-l-4 border-l-primary cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Leads Ativos
              </CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{leadsAtivos}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total no funil de vendas
              </p>
            </CardContent>
          </Card>

          <Card onClick={() => navigate("/tarefas")} className="border-l-4 border-l-orange-500 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tarefas Pendentes
              </CardTitle>
              <Clock className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tarefasPendentes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requerem atenção
              </p>
            </CardContent>
          </Card>

          <Card onClick={() => navigate("/tarefas")} className="border-l-4 border-l-green-500 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Conclusão
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{percentualConclusao}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {tarefasConcluidas} de {totalTarefas} concluídas
              </p>
            </CardContent>
          </Card>

          <Card onClick={() => navigate("/leads")} className="border-l-4 border-l-blue-500 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversão
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">
                Em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card onClick={() => navigate("/leads")} className="cursor-pointer">
            <CardHeader>
              <CardTitle>Leads por Etapa do Funil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(leadsPorSegmento).map(([etapa, count]) => (
                  <div key={etapa} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{etapa}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(count / leadsAtivos) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card onClick={() => navigate("/tarefas")} className="cursor-pointer">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTarefas.slice(0, 4).map((tarefa) => (
                  <div key={tarefa.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      tarefa.status === 'concluida' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tarefa.nomeLead}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {tarefa.descricaoTarefa}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(tarefa.dataEntrega).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
