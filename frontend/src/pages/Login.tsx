import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IntroScreen from "../components/auth/IntroScreen";
import DashboardPreview from "../components/auth/DashboardPreview";
import LoginModal from "../components/auth/LoginModal";
import { loginUser } from "../services/auth";

type LoginStage = "intro" | "transitioning" | "auth" | "success";

export default function Login() {
  const [stage, setStage] = useState<LoginStage>("intro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  function handleStart() {
    setError(null);
    setStage("transitioning");

    window.setTimeout(() => {
      setStage("auth");
    }, 450);
  }

  async function handleLogin(data: { email: string; senha: string }) {
    try {
      setLoading(true);
      setError(null);

      const response = await loginUser(data);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        throw new Error("Resposta de login inválida.");
      }

      setStage("success");

      window.setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message === "Failed to fetch"
            ? "Não foi possível conectar ao servidor."
            : err.message
          : "Falha ao realizar login.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const showPreview =
    stage === "transitioning" || stage === "auth" || stage === "success";

  const showModal = stage === "auth" || stage === "success";

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <DashboardPreview
        visible={showPreview}
        blurred={true}
      />

      <IntroScreen
        visible={stage === "intro" || stage === "transitioning"}
        isLeaving={stage === "transitioning"}
        onStart={handleStart}
      />

      <LoginModal
        visible={showModal}
        isClosing={stage === "success"}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </div>
  );
}