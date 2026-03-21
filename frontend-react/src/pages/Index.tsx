import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        senha: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      console.log("Login realizado com sucesso:", data);

      window.location.href = "/dashboard";
    } else {
      console.error("Erro no login:", data);
      alert(data.erro || "Erro no login");
    }
  } catch (error) {
    console.error("Erro ao conectar com a API:", error);
    alert("Erro ao conectar com a API");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo - decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-10 w-72 h-72 rounded-full bg-primary-foreground" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary-foreground" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-primary-foreground" />
        </div>
        <div className="relative z-10 text-center px-12">
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
            Bem-vindo de volta
          </h1>
          <p className="mt-4 text-primary-foreground/70 text-lg">
            Faça login para acessar sua conta
          </p>
        </div>
      </div>

      {/* Painel direito - formulário */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Espaço para logo */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-xs text-center px-2">
              {/* Substitua por: <img src="/sua-logo.png" alt="Logo" className="w-32 h-auto" /> */}
              Sua logo aqui
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Entrar
            </h2>
            <p className="text-sm text-muted-foreground">
              Insira suas credenciais para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium active:scale-[0.98] transition-transform"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={16} />
                  Entrar
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Esqueceu sua senha? Contate o administrador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
