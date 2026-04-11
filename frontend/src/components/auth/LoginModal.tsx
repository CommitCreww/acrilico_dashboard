import { useState } from "react";

type LoginModalProps = {
  visible: boolean;
  isClosing: boolean;
  onSubmit: (data: { email: string; senha: string }) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export default function LoginModal({
  visible,
  isClosing,
  onSubmit,
  loading,
  error,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit({ email, senha });
  }

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center px-4 transition-all duration-500 ease-out ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-500 ease-out ${
          isClosing
            ? "scale-95 translate-y-2 opacity-0"
            : visible
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-6 opacity-0"
        }`}
      >
        <div className="mb-8">
          <p className="text-sm font-medium text-violet-300"></p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Acessar painel
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Entre com suas credenciais para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="seuemail@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 font-medium text-white transition hover:from-violet-500 hover:to-purple-500 hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Entrando...
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}