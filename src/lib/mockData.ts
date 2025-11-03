// Mock data para Lead Talks CRM

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'user' | 'viewer';
  ultimoLogin: string;
}


export interface EtapaFunil {
  id: string;
  label: string;
  cor: string;
  borderColor: string;
  textColor: string;
  ordem: number;
}

export interface Lead {
  id: string;
  nomeLead: string;
  telefone: string;
  email: string;
  empresa: string;
  etapaFunil: string;
  responsavel: string;
  valorVenda: number;
  valorMensal: number;
  criadoEm: string;
  atualizadoEm?: string;
  tags?: string[];
  etiquetas?: string[];
  camposPersonalizados?: Record<string, any>;
}

export interface EtiquetaPersonalizada {
  id: string;
  nome: string;
  cor: string;
}

export interface CampoPersonalizado {
  id: string;
  nome: string;
  tipo: 'texto' | 'numero' | 'data' | 'selecao';
  opcoes?: string[];
}

export interface NotaLead {
  id: string;
  leadId: string;
  texto: string;
  autor: string;
  criadoEm: string;
  tipo: 'nota' | 'movimentacao' | 'tarefa' | 'reuniao';
  calendarioEventoId?: string;
}

export interface Tarefa {
  id: string;
  nomeLead: string;
  leadId: string;
  descricaoTarefa: string;
  dataEntrega: string;
  status: 'pendente' | 'concluida';
  prioridade: 'baixa' | 'media' | 'alta';
  criadoPor: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Contato {
  id: string;
  nome: string;
  telefone: string;
  segmento: string;
  dataEntrada: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CalendarEvent {
  id: string;
  tipo: 'tarefa' | 'nota' | 'reuniao';
  titulo: string;
  descricao?: string;
  leadId?: string;
  nomeLead?: string;
  data: string;
  horaInicio?: string;
  horaFim?: string;
  status?: 'pendente' | 'concluida';
  prioridade?: 'baixa' | 'media' | 'alta';
  criadoEm: string;
}

export const mockEtapasFunil: EtapaFunil[] = [
  { 
    id: 'novo', 
    label: 'Contato Inicial', 
    cor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
    ordem: 1 
  },
  { 
    id: 'contato', 
    label: 'Diagnóstico da Dor do Cliente', 
    cor: 'bg-red-100',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    ordem: 2 
  },
  { 
    id: 'proposta', 
    label: 'Apresentação Agendada', 
    cor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    ordem: 3 
  },
];

export const mockUsuario: Usuario = {
  id: '1',
  nome: 'Agência Brakeel',
  email: 'agencia@brakeel.com',
  tipo: 'admin',
  ultimoLogin: new Date().toISOString(),
};

export const mockContatos: Contato[] = [
  {
    id: '1',
    nome: 'Dr. João Pafuncio Siqueira',
    telefone: '67 99999-9999',
    segmento: 'Clínica',
    dataEntrada: '2025-09-04',
  },
  {
    id: '2',
    nome: 'Dra. Giovanna Massalli',
    telefone: '67 99142-6269',
    segmento: 'Clínica',
    dataEntrada: '2025-09-04',
  },
  {
    id: '3',
    nome: 'Cintia Peters',
    telefone: '67 99142-6269',
    segmento: 'Cerimonia',
    dataEntrada: '2025-09-04',
  },
  {
    id: '4',
    nome: 'Diógenes',
    telefone: '67 99264-0107',
    segmento: 'Multitarefa',
    dataEntrada: '2025-09-01',
  },
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    nomeLead: 'Dr. João Pafuncio Siqueira, Clínica coração',
    telefone: '67 9999-9999',
    email: 'joao@clinica.com',
    empresa: 'Clínica Coração',
    etapaFunil: 'novo',
    responsavel: 'Pafuncio Siqueira',
    valorVenda: 2000,
    valorMensal: 600,
    criadoEm: '2025-09-17',
    tags: ['Refazer Contato'],
  },
  {
    id: '2',
    nomeLead: 'Dra. Giovanna Massalli',
    telefone: '67 99142-6269',
    email: 'giovanna@endocrino.com',
    empresa: 'Endocrinologia Avançada',
    etapaFunil: 'contato',
    responsavel: 'Pafuncio Siqueira',
    valorVenda: 0,
    valorMensal: 0,
    criadoEm: '2025-09-17',
    tags: ['Morno'],
  },
  {
    id: '3',
    nomeLead: 'Cintia Peters',
    telefone: '67 99142-6269',
    email: 'cintia@eventos.com',
    empresa: 'Cerimonialista Peters',
    etapaFunil: 'contato',
    responsavel: 'Pafuncio Siqueira',
    valorVenda: 0,
    valorMensal: 0,
    criadoEm: '2025-09-17',
    tags: ['Hot'],
  },
  {
    id: '4',
    nomeLead: 'Diógenes',
    telefone: '67 99264-0107',
    email: 'diogenes@multi.com',
    empresa: 'Multitarefa Ltda',
    etapaFunil: 'proposta',
    responsavel: 'Pafuncio Siqueira',
    valorVenda: 0,
    valorMensal: 0,
    criadoEm: '2025-09-17',
    tags: ['Frio'],
  },
  {
    id: '5',
    nomeLead: 'Dra. Luana Recalde',
    telefone: '67 99123-4567',
    email: 'luana@estetica.com',
    empresa: 'Estética Recalde',
    etapaFunil: 'novo',
    responsavel: 'Pafuncio Siqueira',
    valorVenda: 0,
    valorMensal: 0,
    criadoEm: '2025-09-15',
    tags: [],
  },
];

export const mockTarefas: Tarefa[] = [
  {
    id: '1',
    nomeLead: 'Dr. João Pafuncio Siqueira',
    leadId: '1',
    descricaoTarefa: 'Montar apresentação e agente teste',
    dataEntrega: '2025-10-17',
    status: 'pendente',
    prioridade: 'alta',
    criadoPor: 'Agência Brakeel',
    criadoEm: '2025-10-01T10:00:00',
    atualizadoEm: '2025-10-01T10:00:00',
  },
  {
    id: '2',
    nomeLead: 'Dra. Giovanna Masseli',
    leadId: '2',
    descricaoTarefa: 'Montar proposta para testar',
    dataEntrega: '2025-10-06',
    status: 'pendente',
    prioridade: 'media',
    criadoPor: 'Agência Brakeel',
    criadoEm: '2025-09-28T14:30:00',
    atualizadoEm: '2025-09-28T14:30:00',
  },
  {
    id: '3',
    nomeLead: 'Cintia Peters',
    leadId: '3',
    descricaoTarefa: 'Diagnosticar a dor do cliente',
    dataEntrega: '2025-10-05',
    status: 'pendente',
    prioridade: 'alta',
    criadoPor: 'Agência Brakeel',
    criadoEm: '2025-09-25T09:15:00',
    atualizadoEm: '2025-09-25T09:15:00',
  },
  {
    id: '4',
    nomeLead: 'Diógenes',
    leadId: '4',
    descricaoTarefa: 'Montar apresentação',
    dataEntrega: '2025-10-02',
    status: 'concluida',
    prioridade: 'media',
    criadoPor: 'Agência Brakeel',
    criadoEm: '2025-09-20T16:00:00',
    atualizadoEm: '2025-09-20T16:00:00',
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    tipo: 'reuniao',
    titulo: 'Reunião com Giovana Messias',
    descricao: 'Apresentação de proposta',
    leadId: '2',
    nomeLead: 'Dra. Giovanna Masseli',
    data: '2025-10-30',
    horaInicio: '13:00',
    horaFim: '13:30',
    criadoEm: '2025-10-20T10:00:00',
  },
  {
    id: '2',
    tipo: 'tarefa',
    titulo: 'Preparar apresentação',
    descricao: 'Preparar slides para reunião',
    leadId: '1',
    nomeLead: 'Dr. João Pafuncio Siqueira',
    data: '2025-10-30',
    horaInicio: '09:00',
    status: 'pendente',
    prioridade: 'alta',
    criadoEm: '2025-10-20T08:00:00',
  },
];

export const mockNotas: NotaLead[] = [
  {
    id: '1',
    leadId: '1',
    texto: 'Lead criado e adicionado ao funil',
    autor: 'Sistema',
    criadoEm: '2025-09-17T10:00:00',
    tipo: 'movimentacao',
  },
  {
    id: '2',
    leadId: '1',
    texto: 'Primeiro contato realizado por telefone. Cliente demonstrou interesse.',
    autor: 'Agência Brakeel',
    criadoEm: '2025-09-18T14:30:00',
    tipo: 'nota',
  },
];

// Utility functions
export const getCurrentTimestamp = () => new Date().toISOString();

export const sortByRecent = <T extends { criadoEm?: string; atualizadoEm?: string }>(
  items: T[]
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.atualizadoEm || a.criadoEm || 0).getTime();
    const dateB = new Date(b.atualizadoEm || b.criadoEm || 0).getTime();
    return dateB - dateA;
  });
};
