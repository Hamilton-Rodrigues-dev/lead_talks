import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function Calendario() {
  const [visualizacao, setVisualizacao] = useState<'mes' | 'semana'>('mes');
  const [mesAtual, setMesAtual] = useState(new Date(2025, 9, 1)); // Outubro 2025

  const nomeMes = mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Mock de eventos
  const eventos = [
    {
      dia: 24,
      titulo: 'Giovana Messias Nutricionais',
      horario: '13:00 - 13:30 - Reunião',
      cor: 'bg-blue-500',
    },
  ];

  const getDiasDoMes = () => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaDaSemanaInicio = primeiroDia.getDay();

    const dias = [];
    
    // Dias do mês anterior
    const diasMesAnterior = new Date(ano, mes, 0).getDate();
    for (let i = diaDaSemanaInicio - 1; i >= 0; i--) {
      dias.push({ dia: diasMesAnterior - i, mesAtual: false });
    }

    // Dias do mês atual
    for (let i = 1; i <= diasNoMes; i++) {
      dias.push({ dia: i, mesAtual: true });
    }

    // Completar com dias do próximo mês
    const diasRestantes = 42 - dias.length;
    for (let i = 1; i <= diasRestantes; i++) {
      dias.push({ dia: i, mesAtual: false });
    }

    return dias;
  };

  const hoje = new Date().getDate();
  const mesAtualHoje = new Date().getMonth() === mesAtual.getMonth();

  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendário</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova tarefa
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold capitalize">{nomeMes}</h2>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1))}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="outline" onClick={() => setMesAtual(new Date())}>
                  Hoje
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1))}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={visualizacao === 'mes' ? 'default' : 'outline'}
                onClick={() => setVisualizacao('mes')}
              >
                Mês
              </Button>
              <Button
                variant={visualizacao === 'semana' ? 'default' : 'outline'}
                onClick={() => setVisualizacao('semana')}
              >
                Semana
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Header dias da semana */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/30">
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia) => (
              <div key={dia} className="p-4 text-center font-semibold text-sm">
                {dia}
              </div>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-7">
            {getDiasDoMes().map((item, index) => {
              const temEvento = eventos.some(e => e.dia === item.dia && item.mesAtual);
              const isHoje = item.dia === hoje && item.mesAtual && mesAtualHoje;

              return (
                <div
                  key={index}
                  className={`min-h-[120px] border-r border-b border-border p-2 ${
                    !item.mesAtual ? 'bg-muted/20 text-muted-foreground' : 'hover:bg-muted/30'
                  } transition-colors cursor-pointer`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      isHoje ? 'bg-primary text-primary-foreground' : ''
                    }`}
                  >
                    {item.dia}
                  </div>

                  {temEvento && item.mesAtual && (
                    <div className="mt-2">
                      {eventos
                        .filter(e => e.dia === item.dia)
                        .map((evento, i) => (
                          <div
                            key={i}
                            className={`text-xs p-2 rounded ${evento.cor} text-white mb-1`}
                          >
                            <div className="font-medium">{evento.titulo}</div>
                            <div className="text-xs opacity-90 mt-1">{evento.horario}</div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
