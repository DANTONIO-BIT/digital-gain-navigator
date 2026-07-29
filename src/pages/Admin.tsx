import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

interface Lead {
  id: string;
  created_at: string;
  source: "contacto" | "agente";
  status: "nuevo" | "contactado" | "ganado" | "perdido";
  nombre: string;
  email: string | null;
  telefono: string | null;
  empresa: string | null;
  tipo_negocio: string | null;
  mensaje: string | null;
  agente_tipo: string | null;
  presupuesto: string | null;
  caso: string | null;
  notas: string | null;
}

const S = { lino: "#F9F6F1", onyx: "#1A1A1A", terra: "#A05730", stone: "#E0DAD3", mid: "#6A6460", dark: "#0F0F0F" };

const STATUS_OPTS: Lead["status"][] = ["nuevo", "contactado", "ganado", "perdido"];
const STATUS_COLOR: Record<Lead["status"], string> = {
  nuevo: "#A05730", contactado: "#2D6A4F", ganado: "#1A7A3D", perdido: "#8A8580",
};

const Admin = () => {
  const { signOut } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todos" | "contacto" | "agente">("todos");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: Lead["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await supabase.from("leads").update({ status }).eq("id", id);
  };

  const filtered = filter === "todos" ? leads : leads.filter((l) => l.source === filter);

  return (
    <div style={{ minHeight: "100vh", background: S.lino, fontFamily: "'Space Grotesk', sans-serif", color: S.onyx }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", borderBottom: `1px solid ${S.stone}`, background: "#fff" }}>
        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
          DIGI<span style={{ color: S.terra }}>DOT</span> · Admin
        </div>
        <button onClick={signOut} style={{ background: "none", border: `1px solid ${S.stone}`, padding: "0.5rem 1rem", fontSize: "0.8rem", cursor: "pointer" }}>
          Cerrar sesión
        </button>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {(["todos", "contacto", "agente"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.5rem 1rem", fontSize: "0.8rem", border: `1px solid ${filter === f ? S.terra : S.stone}`,
                background: filter === f ? S.terra : "transparent", color: filter === f ? "#fff" : S.mid, cursor: "pointer",
              }}
            >
              {f === "todos" ? `Todos (${leads.length})` : `${f} (${leads.filter((l) => l.source === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: S.mid }}>Cargando…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: S.mid }}>No hay leads todavía.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtered.map((l) => (
              <div key={l.id} style={{ border: `1px solid ${S.stone}`, background: "#fff", padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{l.nombre}</span>
                      <span style={{ fontSize: "0.65rem", fontFamily: "'JetBrains Mono',monospace", color: S.mid, textTransform: "uppercase", border: `1px solid ${S.stone}`, padding: "0.1rem 0.4rem" }}>
                        {l.source}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: S.mid }}>
                      {l.email && <span>{l.email} · </span>}
                      {l.telefono && <span>{l.telefono} · </span>}
                      {new Date(l.created_at).toLocaleString("es-ES")}
                    </div>
                  </div>
                  <select
                    value={l.status}
                    onChange={(e) => updateStatus(l.id, e.target.value as Lead["status"])}
                    style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", border: `1px solid ${STATUS_COLOR[l.status]}`, color: STATUS_COLOR[l.status], background: "#fff", fontWeight: 700 }}
                  >
                    {STATUS_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: S.onyx, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {l.empresa && <div><strong>Empresa:</strong> {l.empresa}</div>}
                  {l.tipo_negocio && <div><strong>Tipo de negocio:</strong> {l.tipo_negocio}</div>}
                  {l.agente_tipo && <div><strong>Agente pedido:</strong> {l.agente_tipo}</div>}
                  {l.presupuesto && <div><strong>Presupuesto:</strong> {l.presupuesto}</div>}
                  {l.mensaje && <div><strong>Mensaje:</strong> {l.mensaje}</div>}
                  {l.caso && <div><strong>Caso:</strong> {l.caso}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
