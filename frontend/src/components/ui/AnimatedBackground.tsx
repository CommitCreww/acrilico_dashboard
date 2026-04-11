export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#09090b] via-[#1a0f2e] to-[#09090b]" />

      {/* Orb 1 */}
      <div className="absolute top-[-100px] left-[-100px] h-[400px] w-[400px] rounded-full bg-violet-600/20 blur-[120px] animate-float-slow" />

      {/* Orb 2 */}
      <div className="absolute bottom-[-120px] right-[-120px] h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-[140px] animate-float-slower" />

      {/* Orb 3 */}
      <div className="absolute top-[30%] left-[60%] h-[300px] w-[300px] rounded-full bg-purple-400/10 blur-[100px] animate-float" />

      {/* Noise overlay (textura profissional) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/noise.png')]" />
    </div>
  );
}