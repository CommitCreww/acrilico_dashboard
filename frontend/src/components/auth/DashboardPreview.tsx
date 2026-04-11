import AnimatedBackground from "../ui/AnimatedBackground";

type DashboardPreviewProps = {
  visible: boolean;
  blurred?: boolean;
  darkened?: boolean;
};

export default function DashboardPreview({
  visible,
  blurred = true,
  darkened = true,
}: DashboardPreviewProps) {
  return (
    <div
      className={`absolute inset-0 transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 scale-100"
          : "pointer-events-none opacity-0 scale-[1.03]"
      }`}
    >
      <AnimatedBackground />

      <div
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          blurred ? "blur-md scale-[1.02]" : "blur-0 scale-100"
        }`}
      >
        <div className="flex h-full w-full">
          <aside className="hidden w-72 border-r border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl lg:block">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white">Ludarte</h2>
              <p className="text-sm text-zinc-400">Painel administrativo</p>
            </div>

            <nav className="space-y-3">
              <div className="rounded-xl bg-violet-500/15 px-4 py-3 text-sm text-violet-200">
                Dashboard
              </div>
              <div className="rounded-xl px-4 py-3 text-sm text-zinc-400">
                Pedidos
              </div>
              <div className="rounded-xl px-4 py-3 text-sm text-zinc-400">
                Clientes
              </div>
              <div className="rounded-xl px-4 py-3 text-sm text-zinc-400">
                Materiais
              </div>
            </nav>
          </aside>

          <main className="flex-1 p-6 lg:p-8">
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="xl:col-span-2 rounded-[28px] border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl">
                <div className="h-4 w-32 rounded bg-violet-400/20" />
                <div className="mt-4 h-10 w-80 rounded bg-white/10" />
                <div className="mt-3 h-4 w-96 rounded bg-white/5" />

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="h-3 w-20 rounded bg-white/10" />
                      <div className="mt-3 h-8 w-16 rounded bg-white/15" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl">
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="mt-5 h-16 w-28 rounded bg-white/15" />
                <div className="mt-3 h-4 w-40 rounded bg-white/10" />
              </div>

              <div className="rounded-[24px] border border-white/10 bg-zinc-900/60 p-5 backdrop-blur-xl">
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="mt-5 h-16 w-28 rounded bg-white/15" />
                <div className="mt-3 h-4 w-40 rounded bg-white/10" />
              </div>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2 rounded-[28px] border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl">
                <div className="mb-6 h-5 w-40 rounded bg-white/10" />
                <div className="flex h-72 items-end gap-4">
                  {[60, 90, 70, 120, 85, 140, 110].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-lg bg-violet-400/40"
                      style={{ height }}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-xl">
                <div className="mb-6 h-5 w-32 rounded bg-white/10" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-24 rounded bg-white/10" />
                        <div className="h-4 w-8 rounded bg-white/10" />
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-violet-400/50"
                          style={{ width: `${20 + item * 18}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <div
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          darkened ? "bg-black/35" : "bg-black/0"
        }`}
      />
    </div>
  );
}