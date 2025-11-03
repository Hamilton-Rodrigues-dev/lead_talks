import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Mock login
    toast.success("Login realizado com sucesso!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
            <Target className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-center">
            Lead <span className="text-primary">Talks</span>
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Gerencie seus leads com inteligência
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="h-12"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold">
              Entrar
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2025 Lead Talks. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
