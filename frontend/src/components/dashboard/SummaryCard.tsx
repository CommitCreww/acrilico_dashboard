type SummaryCardProps = {
  title: string;
  value: string | number;
  accent?: "violet" | "amber" | "emerald" | "red" | "zinc";
};

const accentStyles = {
  violet: "text-violet-300 bg-violet-500/10 border-violet-500/20",
  amber: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  red: "text-red-300 bg-red-500/10 border-red-500/20",
  zinc: "text-zinc-200 bg-white/5 border-white/10",
};

export default function SummaryCard({
  title,
  value,
  accent = "zinc",
}: SummaryCardProps) {
  return (
    <div
      className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(0,0,0,0.20)] ${accentStyles[accent]}`}
    >
      <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
        {title}
      </p>

      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
