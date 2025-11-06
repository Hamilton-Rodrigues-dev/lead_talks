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
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

// --- Menu principal ---
const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/contatos", label: "Contatos", icon: Contact },
  { path: "/calendario", label: "Calendário", icon: Calendar },
  { path: "/leads", label: "Leads", icon: Target },
  { path: "/tarefas", label: "Tarefas", icon: CheckSquare },
];

function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  // --- Mock temporário ---
  const profile = {
    nome: "Brakeel Rodrigues",
    email: "agencia@brakeel.com",
    avatar_url: "",
  };
  const role = "admin";

  const signOut = async () => {
    console.log("Saindo...");
    window.location.href = "/"; // redireciona via navegador
  };

  return (
    <Sidebar collapsible="icon">
      {/* Topo com logo */}
      <div
        className={`border-b border-sidebar-border p-4 flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {collapsed ? (
          <div className="flex flex-col items-center justify-center gap-2 mx-auto">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <ThemeToggle />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-9 rounded-[8px]" />
              <div>
                <h1 className="text-base font-semibold text-sidebar-foreground">
                  Lead Talks
                </h1>
                <p className="text-xs text-muted-foreground">CRM System</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            </div>
          </>
        )}
      </div>

      {/* Conteúdo */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
                          isActive
                            ? "bg-[#DDD6FF]  text-[#5D0EC0]"
                            : "text-muted-foreground hover:bg-muted/20"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 transition-colors ${
                            isActive
                              ? "stroke-[#5D0EC0]"
                              : "stroke-muted-foreground text-muted-foreground"
                          }`}
                        />

                        <span
                          className={`text-sm font-medium transition-colors ${
                            isActive
                              ? "text-[#5D0EC0]"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Rodapé com perfil */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center justify-center gap-3">
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
  const profile = {
    nome: "Brakeel Rodrigues",
    email: "agencia@brakeel.com",
    avatar_url: "",
  };
  const role = "admin";

  const handleLogout = () => {
    window.location.href = "/";
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 rounded-[8px]" />
          <div>
            <h1 className="text-lg font-bold">Lead Talks</h1>
            <p className="text-xs text-muted-foreground">CRM System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-[#DDD6FF] text-[#5D0EC0]"
                  : "text-muted-foreground hover:bg-muted/20"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? "stroke-[#5D0EC0]"
                    : "stroke-muted-foreground text-muted-foreground"
                }`}
              />

              <span
                className={`font-medium ${
                  isActive ? "text-[#5D0EC0]" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
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
                <Button variant="ghost" className="w-14 h-14 p-0 flex items-center justify-center">
                  <Menu className="!w-8 !h-8 "/>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <MobileSidebar onClose={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-8 rounded-[8px]" />
              <h1 className="font-bold text-[#5D0EC0]">Lead Talks</h1>
            </div>

            <ThemeToggle />
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
