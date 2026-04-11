import { useEffect, useState } from "react";
import desktopPreview from "../../assets/dashboard-preview-desktop.png";
import mobilePreview from "../../assets/dashboard-preview-mobile.png";

type DashboardPreviewProps = {
  visible: boolean;
  blurred?: boolean;
};

export default function DashboardPreview({
  visible,
  blurred = true,
}: DashboardPreviewProps) {
  const [desktopLoaded, setDesktopLoaded] = useState(false);
  const [mobileLoaded, setMobileLoaded] = useState(false);

  useEffect(() => {
    const imgDesktop = new Image();
    imgDesktop.src = desktopPreview;
    imgDesktop.onload = () => setDesktopLoaded(true);

    const imgMobile = new Image();
    imgMobile.src = mobilePreview;
    imgMobile.onload = () => setMobileLoaded(true);
  }, []);

  const desktopReady = desktopLoaded;
  const mobileReady = mobileLoaded;

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ease-out ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* MOBILE */}
      <div
        className={`absolute inset-0 md:hidden transition-opacity duration-300 ${
          mobileReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out will-change-transform ${
            blurred ? "scale-[1.08] blur-md" : "scale-100 blur-0"
          }`}
          style={{ backgroundImage: `url(${mobilePreview})` }}
        />
      </div>

      {/* DESKTOP */}
      <div
        className={`absolute inset-0 hidden md:block transition-opacity duration-300 ${
          desktopReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out will-change-transform ${
            blurred ? "scale-[1.04] blur-lg" : "scale-100 blur-0"
          }`}
          style={{ backgroundImage: `url(${desktopPreview})` }}
        />
      </div>

      {/* overlay escuro */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          blurred ? "bg-black/45" : "bg-black/0"
        }`}
      />

      {/* fallback enquanto carrega */}
      <div
        className={`absolute inset-0 bg-zinc-950 transition-opacity duration-300 ${
          desktopReady || mobileReady ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}