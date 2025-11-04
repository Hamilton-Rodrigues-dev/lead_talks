import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Target,
  Contact,
  Calendar,
  CheckSquare,
  Menu,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import logo from "@/assets/logo.png";
// import { useAuth } from '@/contexts/AuthContext'; // <-- COMENTADO

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/leads", label: "Leads", icon: Target },
  { path: "/contatos", label: "Contatos", icon: Contact },
  { path: "/calendario", label: "Calendário", icon: Calendar },
  { path: "/tarefas", label: "Tarefas", icon: CheckSquare },
  {
    path: "/usuarios",
    label: "Usuários",
    icon: Users,
    requiredRole: "admin" as const,
  },
];

function AppSidebar() {
  const location = useLocation();
  // const { profile, role, signOut } = useAuth(); // <-- COMENTADO

  // --- Bloco de Mock para Teste (sem login) --- // <-- ADICIONADO
  const profile = {
    nome: "Usuário de Teste",
    email: "teste@exemplo.com",
    avatar_url: "",
  };
  const role = "admin"; // Mude para 'gerente' ou 'vendedor' para testar os menus
  const signOut = () => console.log("Cliquei no Sair (Mock)");
  // --- Fim do Bloco de Mock --- // <-- ADICIONADO

  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <div className="border-b border-sidebar-border p-4 flex items-center justify-between">
        {collapsed ? (
          // 👉 Quando o menu está fechado, só o botão
          <SidebarTrigger className="mx-auto text-muted-foreground hover:text-foreground" />
        ) : (
          // 👉 Quando aberto, mostra logo + título + botão
          <>
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-9" />
              <div>
                <h1 className="text-base font-semibold text-sidebar-foreground">
                  Lead Talks
                </h1>
                <p className="text-xs text-muted-foreground">CRM System</p>
              </div>
            </div>
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          </>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (item.requiredRole && role !== "admin") {
                  return null;
                }

                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path}>
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3">
          <Avatar className={collapsed ? "w-8 h-8 mx-auto" : "w-9 h-9"}>
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {profile?.nome?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-sidebar-foreground">
                  {profile?.nome}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.email}
                </p>
                {role && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {role === "admin"
                      ? "👑 Admin"
                      : role === "gerente"
                      ? "📊 Gerente"
                      : "💼 Vendedor"}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Sidebar>
  );
}

function MobileSidebar({ onClose }: { onClose: () => void }) {
  const location = useLocation();
  // const { profile, role, signOut } = useAuth(); // <-- COMENTADO

  // --- Bloco de Mock para Teste (sem login) --- // <-- ADICIONADO
  const profile = {
    nome: "Usuário de Teste",
    email: "teste@exemplo.com",
    avatar_url: "",
  };
  const role = "admin"; // Mude para 'gerente' ou 'vendedor' para testar os menus
  const signOut = () => console.log("Cliquei no Sair (Mock)");
  // --- Fim do Bloco de Mock --- // <-- ADICIONADO

  const handleLogout = () => {
    signOut();
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10" />
          <div>
            <h1 className="text-lg font-bold">Lead Talks</h1>
            <p className="text-xs text-muted-foreground">CRM System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          if (item.requiredRole && role !== "admin") return null;

          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {profile?.nome?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.nome}</p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.email}
            </p>
            {role && (
              <Badge variant="outline" className="mt-1 text-xs">
                {role === "admin"
                  ? "👑 Admin"
                  : role === "gerente"
                  ? "📊 Gerente"
                  : "💼 Vendedor"}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <MobileSidebar onClose={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-8" />
              <h1 className="font-bold">Lead Talks</h1>
            </div>

            <div className="w-10" />
          </div>
        </header>

        <main className="p-4">{children}</main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
