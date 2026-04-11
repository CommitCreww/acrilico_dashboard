import { useState } from "react"
import logo from "../assets/logo.png"

function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("usuario", JSON.stringify(data.usuario))

      alert("Login realizado com sucesso")
    } else {
      alert(data.erro || "Erro no login")
    }
  } catch (error) {
    console.error("Erro ao conectar com a API:", error)
    alert("Erro ao conectar com a API")
  }
}
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#24103d_0%,_#12081f_35%,_#05030a_100%)]">
      {/* brilho geral */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.10),transparent_25%),radial-gradient(circle_at_left,_rgba(59,130,246,0.08),transparent_20%)]" />

      {/* objetos decorativos grandes */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />
      <div className="orb orb-6" />

      {/* linhas/ondas decorativas */}
      <div className="wave wave-1" />
      <div className="wave wave-2" />
      <div className="wave wave-3" />

      {/* conteúdo */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-black/20 p-8 shadow-[0_0_70px_rgba(139,92,246,0.18)] backdrop-blur-2xl">
          {/* topo */}
            <div className="mb-8 flex items-center justify-center h-32">
                <img
                    src={logo}
                    alt="Logo"
                    className="logo-glow w-auto max-h-full object-contain"
                />
            </div>

          {/* formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
                E-mail
              </label>

              <div className="group relative">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-fuchsia-400/40 focus:bg-black/30 focus:shadow-[0_0_0_1px_rgba(217,70,239,0.25),0_0_30px_rgba(168,85,247,0.12)]"
                />
                <span className="pointer-events-none absolute bottom-0 left-5 h-[2px] w-0 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 transition-all duration-500 group-focus-within:w-[calc(100%-40px)]" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
                Senha
              </label>

              <div className="group relative">
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-fuchsia-400/40 focus:bg-black/30 focus:shadow-[0_0_0_1px_rgba(217,70,239,0.25),0_0_30px_rgba(168,85,247,0.12)]"
                />
                <span className="pointer-events-none absolute bottom-0 left-5 h-[2px] w-0 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 transition-all duration-500 group-focus-within:w-[calc(100%-40px)]" />
              </div>
            </div>


            <div className="pt-2">
              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-5 py-4 font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] active:scale-[0.99]"
              >
                <span className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
                <span className="relative flex items-center justify-center gap-2">
                  Entrar
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-white/8 pt-5 text-center text-xs text-white/25">
            © 2026 Ludarte Acrílicos. Made with CommitCrew
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login