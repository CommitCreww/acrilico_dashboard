import logo from "../../assets/logo.png";

type IntroScreenProps = {
  visible: boolean;
  isLeaving: boolean;
  onStart: () => void;
};

export default function IntroScreen({
  visible,
  isLeaving,
  onStart,
}: IntroScreenProps) {
  return (
    <div
      className={`absolute inset-0 z-20 flex items-center justify-center bg-[radial-gradient(circle_at_top,_#5c5c5c_0%,_#3c3c3c_35%,_#1d1d1d_100%)] transition-all duration-700 ease-out ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`flex flex-col items-center gap-6 px-4 transition-all duration-500 ease-out ${
          isLeaving
            ? "-translate-y-3 scale-95 opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        <div className="text-center">
          <img
            src={logo}
            alt="Ludarte Acrílicos"
            className="mx-auto h-100 w-auto object-contain sm:h-28 md:h-100"
            draggable={false}
          />

        </div>

        <button
          onClick={onStart}
          className="min-w-[220px] rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-lg font-medium text-white shadow-lg backdrop-blur-sm transition duration-300 hover:border-violet-400/50 hover:bg-violet-500/10 hover:shadow-violet-500/20 active:scale-[0.98]"
        >
          Iniciar
        </button>
      </div>
    </div>
  );
}