type MaterialItem = {
  material: string;
  quantidade: number;
};

type MaterialsUsageCardProps = {
  data?: MaterialItem[];
};

export default function MaterialsUsageCard({
  data = [],
}: MaterialsUsageCardProps) {
  const max = Math.max(...data.map((item) => item.quantidade), 1);

  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-300">
          Materiais mais usados
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Ranking dos materiais com maior uso
        </p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-zinc-500">
          Nenhum material encontrado.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item) => {
            const width = (item.quantidade / max) * 100;

            return (
              <div key={item.material} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-zinc-300">{item.material}</span>
                  <span className="text-sm font-medium text-white">
                    {item.quantidade}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/5">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}