import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const S = { lino: "#F9F6F1", onyx: "#1A1A1A", terra: "#A05730", stone: "#E0DAD3", mid: "#6A6460" };

const AdminLogin = () => {
  const { signIn, session, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session && isAdmin) {
    navigate("/admin");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error === "Email not confirmed" ? "Confirma tu email primero (revisa tu bandeja de entrada)." : "Email o contraseña incorrectos.");
      return;
    }
    navigate("/admin");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: S.lino, fontFamily: "'Space Grotesk', sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 360, padding: "2rem" }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: S.terra, marginBottom: "0.75rem" }}>
          Admin
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: S.onyx }}>Iniciar sesión</h1>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: "0.75rem", color: S.mid, display: "block", marginBottom: "0.35rem" }}>Email</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.75rem 1rem", border: `1px solid ${S.stone}`, background: "#fff", fontSize: "0.9rem", outline: "none" }}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "0.75rem", color: S.mid, display: "block", marginBottom: "0.35rem" }}>Contraseña</label>
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.75rem 1rem", border: `1px solid ${S.stone}`, background: "#fff", fontSize: "0.9rem", outline: "none" }}
          />
        </div>

        {error && <p style={{ color: "#C0392B", fontSize: "0.8rem", marginBottom: "1rem" }}>{error}</p>}

        <button
          type="submit" disabled={loading}
          style={{ width: "100%", padding: "0.9rem", background: S.terra, color: "#fff", border: "none", fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "wait" : "pointer" }}
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
