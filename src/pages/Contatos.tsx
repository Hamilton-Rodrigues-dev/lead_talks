import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2 } from "lucide-react";
import { mockContatos, Contato } from "@/lib/mockData";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>(mockContatos);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [contatoEditando, setContatoEditando] = useState<Contato | null>(null);
  const [contatoParaExcluir, setContatoParaExcluir] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    segmento: "",
  });

  const contatosFiltrados = contatos.filter(
    (contato) =>
      contato.nome.toLowerCase().includes(busca.toLowerCase()) ||
      contato.segmento.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirModal = (contato?: Contato) => {
    if (contato) {
      setContatoEditando(contato);
      setFormData({
        nome: contato.nome,
        telefone: contato.telefone,
        segmento: contato.segmento,
      });
    } else {
      setContatoEditando(null);
      setFormData({ nome: "", telefone: "", segmento: "" });
    }
    setModalAberto(true);
  };

  const salvarContato = () => {
    if (!formData.nome || !formData.telefone || !formData.segmento) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (contatoEditando) {
      setContatos(
        contatos.map((c) =>
          c.id === contatoEditando.id ? { ...c, ...formData } : c
        )
      );
      toast.success("Contato atualizado com sucesso");
    } else {
      const novoContato: Contato = {
        id: Date.now().toString(),
        ...formData,
        dataEntrada: new Date().toISOString().split("T")[0],
      };
      setContatos([novoContato, ...contatos]);
      toast.success("Contato criado com sucesso");
    }

    setModalAberto(false);
    setFormData({ nome: "", telefone: "", segmento: "" });
    setContatoEditando(null);
  };

  const excluirContato = () => {
    if (contatoParaExcluir) {
      setContatos(contatos.filter((c) => c.id !== contatoParaExcluir));
      toast.success("Contato excluído com sucesso");
      setContatoParaExcluir(null);
    }
  };

  const formatarTelefone = (valor: string) => {
    // Remove tudo que não for número
    const apenasNumeros = valor.replace(/\D/g, "");

    // Aplica a máscara conforme o tamanho
    if (apenasNumeros.length <= 10) {
      // Formato (67) 9999-9999
      return apenasNumeros
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 14);
    } else {
      // Formato (67) 99999-9999
      return apenasNumeros
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold">Contatos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie sua base de contatos
            </p>
          </div>
          <Button
            onClick={() => abrirModal()}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar contatos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 h-12 bg-card"
          />
        </div>

        {/* Table / Cards */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* --- VISUAL DESKTOP (tabela) --- */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-4 font-semibold text-sm">Nome</th>
                  <th className="text-left p-4 font-semibold text-sm">
                    Segmento
                  </th>
                  <th className="text-left p-4 font-semibold text-sm">
                    Telefone
                  </th>
                  <th className="text-left p-4 font-semibold text-sm">
                    Data de Entrada
                  </th>
                  <th className="text-right p-4 font-semibold text-sm">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {contatosFiltrados.map((contato) => (
                  <tr
                    key={contato.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => abrirModal(contato)}
                  >
                    <td className="p-4 font-medium">{contato.nome}</td>
                    <td className="p-4 text-muted-foreground">
                      {contato.segmento}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {contato.telefone}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(contato.dataEntrada).toLocaleDateString(
                        "pt-BR"
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setContatoParaExcluir(contato.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- VISUAL MOBILE (cards) --- */}
          <div className="block md:hidden divide-y divide-border">
            {contatosFiltrados.map((contato) => (
              <div
                key={contato.id}
                className="p-4 space-y-2 hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => abrirModal(contato)}
              >
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-semibold">{contato.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Segmento</p>
                  <p>{contato.segmento}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p>{contato.telefone}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Data de entrada
                    </p>
                    <p>
                      {new Date(contato.dataEntrada).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setContatoParaExcluir(contato.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {contatoEditando ? "Editar Contato" : "Novo Contato"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Lead</Label>
              <Input
                placeholder="Nome completo"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Número do lead</Label>
              <Input
                placeholder="(67) 99999-9999"
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    telefone: formatarTelefone(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Segmento</Label>
              <Input
                placeholder="Ex: Clínica, Agronegócio..."
                value={formData.segmento}
                onChange={(e) =>
                  setFormData({ ...formData, segmento: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarContato}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog */}
      <AlertDialog
        open={!!contatoParaExcluir}
        onOpenChange={() => setContatoParaExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este contato? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={excluirContato}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
