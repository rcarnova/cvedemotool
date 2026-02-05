import { useState, useEffect } from "react";
import cveLogo from "@/assets/cve-logo.png";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";

// ─── THEME (CVE Brand Palette) ────────────────────────────────────────────────
const T = {
  // Core CVE Colors
  bg: "#F5F6F8",           // Neutral light background
  surface: "#FFFFFF",       // White cards/containers
  border: "#EAECF0",        // Light borders
  text: "#1A1A1A",          // Primary text (neutral dark)
  textMuted: "#6B7280",     // Secondary text
  textLight: "#9CA3AF",     // Tertiary text
  
  // CVE Primary Accent
  accent: "#22C9AC",        // Verde acqua CVE - primary accent
  accentHover: "#1DB89C",   // Hover state (5% darker)
  accentSoft: "#E8FAF6",    // Soft accent background
  accentRing: "rgba(34, 201, 172, 0.4)", // Focus ring
  
  // Semantic Status Colors
  training: { color: "#DC2626", bg: "#FEF2F2" },  // Red for "Da allenare"
  onTrack: { color: "#22C9AC", bg: "#E8FAF6" },   // CVE green for "In linea"
  example: { color: "#0D9488", bg: "#E6FFFA" },   // Teal for "Di esempio"
  ai: { color: "#22C9AC", bg: "#E8FAF6" },        // CVE green for AI features
  
  // Typography
  fontBody: "'Inter', system-ui, sans-serif",
  fontHeading: "'Sora', system-ui, sans-serif",
  
  // Shadows
  shadowSoft: "0 1px 3px rgba(0, 0, 0, 0.08)",
  shadowMedium: "0 4px 12px rgba(0, 0, 0, 0.1)",
  shadowElevated: "0 8px 24px rgba(0, 0, 0, 0.12)",
  
  // Border radius
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

// Organizzazione completa caricata da Excel (simulata) — Team amministrazione CVE
const ORG_ALL = [
  { id: "chiara", name: "Chiara Bonfanti", initials: "CB", role: "Payroll Specialist", department: "Amministrazione" },
  { id: "elena", name: "Elena Marchetti", initials: "EM", role: "Accounts Payable", department: "Amministrazione" },
  {
    id: "francesca",
    name: "Francesca Colombo",
    initials: "FC",
    role: "Accounts Receivable",
    department: "Amministrazione",
  },
  { id: "giulia", name: "Giulia Moretti", initials: "GM", role: "Supplier Relations", department: "Amministrazione" },
  {
    id: "sofia",
    name: "Sofia Santoro",
    initials: "SS",
    role: "Administrative Coordinator",
    department: "Amministrazione",
  },
];

// Il team di Dalila pre-suggerito dal sistema basato sulla struttura
const SUGGESTED_TEAM = ["chiara", "elena", "francesca", "giulia", "sofia"];

let TEAM = [
  { id: "chiara", name: "Chiara Bonfanti", initials: "CB", role: "Payroll Specialist" },
  { id: "elena", name: "Elena Marchetti", initials: "EM", role: "Accounts Payable" },
  { id: "francesca", name: "Francesca Colombo", initials: "FC", role: "Accounts Receivable" },
];

const BEHAVIORS = [
  {
    id: "comportamento_1",
    name: "Comportamento 1",
    category: "dna",
    description: "Questo comportamento sarà definito insieme durante la sessione di codesign con il team CVE.",
    indicators: ["Da definire", "Da definire", "Da definire"],
  },
  {
    id: "comportamento_2",
    name: "Comportamento 2",
    category: "dna",
    description: "Questo comportamento sarà definito insieme durante la sessione di codesign con il team CVE.",
    indicators: ["Da definire", "Da definire", "Da definire"],
  },
  {
    id: "comportamento_3",
    name: "Comportamento 3",
    category: "team",
    description: "Questo comportamento sarà definito insieme durante la sessione di codesign con il team CVE.",
    indicators: ["Da definire", "Da definire", "Da definire"],
  },
  {
    id: "comportamento_4",
    name: "Comportamento 4",
    category: "team",
    description: "Questo comportamento sarà definito insieme durante la sessione di codesign con il team CVE.",
    indicators: ["Da definire", "Da definire", "Da definire"],
  },
];

// ─── INITIAL STATE (simula backend) ───────────────────────────────────────────
const INITIAL_NOTES = {
  chiara: {
    comportamento_1: [
      {
        id: 1,
        date: "15 Gen",
        text: "Chiusura mese di dicembre: ha gestito le scadenze payroll con precisione anche con l'assenza di un collega.",
        author: "manager",
        level: "example",
      },
      {
        id: 2,
        date: "08 Gen",
        text: "Risoluzione anomalia contratto: ha identificato subito l'errore e proposto correttivo prima della scadenza.",
        author: "manager",
        level: "on_track",
      },
    ],
    comportamento_2: [
      {
        id: 3,
        date: "22 Dic",
        text: "Nella riunione di allineamento annuale non ha condiviso feedback su processi migliorabili.",
        author: "manager",
        level: "training",
      },
    ],
    comportamento_3: [],
    comportamento_4: [
      {
        id: 4,
        date: "10 Gen",
        text: "Ha anticipato un problema tecnico sul software stipendi e coordinato con IT per risolverlo prima della run.",
        author: "manager",
        level: "example",
      },
    ],
  },
  elena: {
    comportamento_1: [
      {
        id: 10,
        date: "18 Gen",
        text: "Pagamento fornitori: ha verificato tutte le fatture con attenzione, intercettando due duplicati.",
        author: "manager",
        level: "on_track",
      },
    ],
    comportamento_2: [
      {
        id: 11,
        date: "12 Gen",
        text: "Ha supportato Francesca durante il picco di fatturazione attiva, gestendo anche parte della riconciliazione.",
        author: "manager",
        level: "example",
      },
    ],
    comportamento_3: [
      {
        id: 12,
        date: "05 Gen",
        text: "Report scadenze fornitori: ha utilizzato il template esistente senza proporre miglioramenti sulla leggibilità.",
        author: "manager",
        level: "training",
      },
    ],
    comportamento_4: [],
  },
  francesca: {
    comportamento_1: [
      {
        id: 20,
        date: "20 Gen",
        text: "Chiusura trimestrale: ha emesso tutte le fatture nei tempi, coordinando con commerciale per le specifiche cliente.",
        author: "manager",
        level: "on_track",
      },
      {
        id: 21,
        date: "14 Gen",
        text: "Sollecito cliente Rossi: ha gestito la comunicazione in modo diretto ma professionale, ottenendo pagamento.",
        author: "manager",
        level: "example",
      },
    ],
    comportamento_2: [],
    comportamento_3: [
      {
        id: 22,
        date: "09 Gen",
        text: "Nella call con cliente Bianchi per sollecito non ha riformulato la richiesta dopo obiezione iniziale.",
        author: "manager",
        level: "training",
      },
    ],
    comportamento_4: [
      {
        id: 23,
        date: "16 Gen",
        text: "Blocco su software fatturazione: ha segnalato il problema in ritardo, impattando le scadenze.",
        author: "manager",
        level: "training",
      },
    ],
  },
  giulia: {
    comportamento_1: [
      {
        id: 30,
        date: "17 Gen",
        text: "Negoziazione fornitore materiali: ha ottenuto condizioni migliori mantenendo relazione positiva.",
        author: "manager",
        level: "example",
      },
    ],
    comportamento_2: [
      {
        id: 31,
        date: "11 Gen",
        text: "Ha condiviso con il team le nuove condizioni negoziate con fornitore X, creando valore per tutti.",
        author: "manager",
        level: "on_track",
      },
    ],
    comportamento_3: [],
    comportamento_4: [
      {
        id: 32,
        date: "13 Gen",
        text: "Scadenza contratto fornitore Y: non ha comunicato per tempo il rischio interruzione servizio.",
        author: "manager",
        level: "training",
      },
    ],
  },
  sofia: {
    comportamento_1: [
      {
        id: 40,
        date: "19 Gen",
        text: "Coordinamento chiusura anno: ha gestito tutte le scadenze cross-funzionali con comunicazione efficace.",
        author: "manager",
        level: "example",
      },
    ],
    comportamento_2: [
      {
        id: 41,
        date: "10 Gen",
        text: "Durante il meeting di pianificazione ha facilitato il confronto tra payroll e fatturazione su priorità.",
        author: "manager",
        level: "example",
      },
    ],
    comportamento_3: [
      {
        id: 42,
        date: "07 Gen",
        text: "Report mensile attività: ha usato formato standard senza adattarlo alle esigenze del nuovo responsabile.",
        author: "manager",
        level: "training",
      },
    ],
    comportamento_4: [],
  },
};

const INITIAL_EVALS = {
  chiara: {
    comportamento_1: "example",
    comportamento_2: "training",
    comportamento_3: null,
    comportamento_4: "example",
  },
  elena: {
    comportamento_1: "on_track",
    comportamento_2: "example",
    comportamento_3: "training",
    comportamento_4: null,
  },
  francesca: {
    comportamento_1: "on_track",
    comportamento_2: null,
    comportamento_3: "training",
    comportamento_4: "training",
  },
  giulia: {
    comportamento_1: "example",
    comportamento_2: "on_track",
    comportamento_3: null,
    comportamento_4: "training",
  },
  sofia: { comportamento_1: "example", comportamento_2: "example", comportamento_3: "training", comportamento_4: null },
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
function getLevelCfg(level) {
  if (level === "training") return { ...T.training, label: "Da allenare", icon: "↗" };
  if (level === "on_track") return { ...T.onTrack, label: "In linea", icon: "◆" };
  if (level === "example") return { ...T.example, label: "Di esempio", icon: "★" };
  return null;
}

function hasPositiveHistory(notes) {
  return notes && notes.some((n) => n.level === "on_track" || n.level === "example");
}

function getAIInsight(notes) {
  if (!notes || notes.length === 0) return null;
  const positive = notes.filter((n) => n.level === "on_track" || n.level === "example");
  const negative = notes.filter((n) => n.level === "training");
  if (positive.length > 0 && negative.length > 0)
    return "Questo comportamento è stato osservato in altre situazioni. Il contesto potrebbe fare la differenza.";
  if (positive.length > 0 && negative.length === 0)
    return "Comportamento consistentemente forte nelle situazioni passate.";
  return null;
}

function getTeamInsights(team, evals, notes) {
  const behaviorStats = BEHAVIORS.map((b) => {
    let trainingCount = 0,
      exampleCount = 0,
      onTrackCount = 0;
    team.forEach((m) => {
      const lvl = evals[m.id]?.[b.id];
      if (lvl === "training") trainingCount++;
      if (lvl === "example") exampleCount++;
      if (lvl === "on_track") onTrackCount++;
    });
    const insight = trainingCount > 0 
      ? `${trainingCount} di ${team.length} persone nel team stanno lavorando su questo comportamento.`
      : exampleCount > 0
      ? `Comportamento più forte nel team con ${exampleCount} persone di esempio.`
      : `${onTrackCount} persone in linea su questo comportamento.`;
    return { ...b, trainingCount, exampleCount, onTrackCount, total: trainingCount + exampleCount + onTrackCount, insight };
  });
  const mostCritical = [...behaviorStats].sort((a, b) => b.trainingCount - a.trainingCount)[0];
  const strongest = [...behaviorStats].sort((a, b) => b.exampleCount - a.exampleCount)[0];
  return { mostCritical, strongest, behaviorStats };
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Avatar({ initials, size = 36, color = "#22C9AC", style = {} }: { initials: string; size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: size * 0.36,
        fontWeight: 700,
        fontFamily: T.fontBody,
        flexShrink: 0,
        boxShadow: T.shadowSoft,
        ...style,
      }}
    >
      {initials}
    </div>
  );
}

// ─── TOOLTIPS ─────────────────────────────────────────────────────────────────
const TOOLTIPS = {
  registraNota:
    "Scrivi una cosa che hai osservato sul tuo collaboratore. Non serve essere precisi — una frase sulla situazione è sufficiente.",
  ilTuoTeam: 'Sono le persone che hai confermato durante il setup. Puoi modificarle dal bottone "✎ Modifica" in alto.',
  cosaHaiOsservato:
    'Descrivi la situazione specifica in cui hai visto quel comportamento. Esempio: "Nel meeting con il cliente Rossi ha guidato la conversazione in modo efficace."',
  livelloOsservato:
    "Da allenare: il comportamento non si vede ancora in questa situazione. In linea: si vede nel modo atteso per il ruolo. Di esempio: va oltre le aspettative.",
  comportamentiChiave:
    "I comportamenti sono le abilità che contano per questo ruolo. Per ogni uno hai una valutazione e uno storico delle situazioni osservate.",
  dnaAziendale: "Comportamenti che contano per tutti nell'azienda, indipendentemente dal ruolo.",
  teamVendite:
    "Comportamenti specifici per il ruolo di vendita — quelli che differenziano chi lo fa bene da chi lo fa meglio.",
  valutazione:
    "Scegli il livello basandoti su quello che hai osservato nelle situazioni reali. Non è un voto finale — si aggiorna nel tempo.",
  aiCounter:
    "Lo storico delle situazioni precedenti mostra un comportamento diverso. Vale la pena controllare prima di confermare.",
  tuaPerspettiva:
    "Aggiungi il tuo punto di vista sulla situazione. Il manager lo vedrà accanto alla sua osservazione — è un confronto, non una contestazione.",
  insightAI:
    "Analisi automatica dei pattern nel tuo team. Ti aiuta a vedere tendenze che magari non emergerti dai singoli casi.",
  mappaComportamenti:
    "Ogni cella è una persona × un comportamento. ↗ significa in sviluppo, ◆ in linea, ★ di esempio. Le celle vuote non sono ancora state valutate.",
};

function Tip({ id, position = "bottom" }) {
  const [visible, setVisible] = useState(false);
  const text = TOOLTIPS[id];
  if (!text) return null;

  // position logic: bottom default, top se specificato
  const isTop = position === "top";

  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6, flexShrink: 0 }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          borderRadius: 8,
          border: `1.5px solid ${visible ? T.ai.color : T.textLight}`,
          color: visible ? T.ai.color : T.textLight,
          fontSize: 10,
          fontWeight: 700,
          cursor: "help",
          background: visible ? T.ai.bg : "transparent",
          transition: "all 0.15s",
          userSelect: "none",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
        }}
      >
        i
      </span>

      {visible && (
        <div
          style={{
            position: "absolute",
            [isTop ? "bottom" : "top"]: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: 220,
            background: T.text,
            color: "#fff",
            fontSize: 12,
            lineHeight: 1.5,
            padding: "10px 12px",
            borderRadius: 10,
            zIndex: 300,
            pointerEvents: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            animation: "fadeIn 0.15s ease",
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position: "absolute",
              [isTop ? "bottom" : "top"]: -5,
              left: "50%",
              width: 10,
              height: 10,
              background: T.text,
              transform: "translateX(-50%) rotate(45deg)",
              [isTop ? "marginBottom" : "marginTop"]: -3,
            }}
          />
          {text}
        </div>
      )}
    </span>
  );
}
function QuickNoteModal({ team, onClose, onSave, selectedPerson, selectedBehavior }) {
  const [person, setPerson] = useState(selectedPerson || team[0].id);
  const [behavior, setBehavior] = useState(selectedBehavior || BEHAVIORS[0].id);
  const [text, setText] = useState("");
  const [level, setLevel] = useState(null);
  const personObj = team.find((t) => t.id === person);
  const behaviorObj = BEHAVIORS.find((b) => b.id === behavior);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: T.surface,
          borderRadius: "20px 20px 0 0",
          padding: 24,
          maxHeight: "85vh",
          overflowY: "auto",
          animation: "slideUp 0.22s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* Handle */}
        <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 20px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: 0 }}>Nota rapida</h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 22, color: T.textLight, cursor: "pointer" }}
          >
            ×
          </button>
        </div>

        {/* Person selector */}
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: T.textLight,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 6,
            display: "block",
          }}
        >
          Persona
        </label>
        <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
          {team.map((m) => (
            <button
              key={m.id}
              onClick={() => setPerson(m.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 22,
                border: person === m.id ? `2px solid ${T.text}` : `2px solid ${T.border}`,
                background: person === m.id ? T.accentSoft : T.surface,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Avatar initials={m.initials} size={24} color={person === m.id ? T.text : "#A3A8B5"} />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: person === m.id ? 700 : 500,
                  color: person === m.id ? T.text : T.textMuted,
                }}
              >
                {m.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Behavior selector */}
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: T.textLight,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 6,
            display: "block",
          }}
        >
          Comportamento
        </label>
        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {BEHAVIORS.map((b) => (
            <button
              key={b.id}
              onClick={() => setBehavior(b.id)}
              style={{
                padding: "6px 14px",
                borderRadius: 18,
                border: behavior === b.id ? `2px solid ${T.text}` : `2px solid ${T.border}`,
                background: behavior === b.id ? T.accentSoft : T.surface,
                fontSize: 13,
                fontWeight: behavior === b.id ? 700 : 500,
                color: behavior === b.id ? T.text : T.textMuted,
                cursor: "pointer",
              }}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Situazione */}
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: T.textLight,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
          }}
        >
          Cosa hai osservato
          <Tip id="cosaHaiOsservato" />
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Descriva la situazione con ${personObj?.name.split(" ")[0]}...`}
          style={{
            width: "100%",
            minHeight: 100,
            padding: "14px 16px",
            border: `1.5px solid ${T.border}`,
            borderRadius: T.radiusMd,
            fontSize: 14,
            color: T.text,
            fontFamily: T.fontBody,
            resize: "none",
            outline: "none",
            background: T.bg,
            boxSizing: "border-box",
            lineHeight: 1.6,
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = T.accent;
            e.target.style.boxShadow = `0 0 0 3px ${T.accentRing}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = T.border;
            e.target.style.boxShadow = "none";
          }}
        />

        {/* AI suggestion if text is judgmental */}
        {text.length > 20 &&
          (text.toLowerCase().includes("passiv") ||
            text.toLowerCase().includes("timid") ||
            text.toLowerCase().includes("pigr") ||
            text.toLowerCase().includes("scarso")) && (
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                marginTop: 10,
                padding: "10px 12px",
                background: T.ai.bg,
                borderRadius: 10,
                border: `1px solid ${T.ai.color}22`,
              }}
            >
              <span style={{ fontSize: 14 }}>✦</span>
              <span style={{ fontSize: 12.5, color: T.ai.color, lineHeight: 1.5 }}>
                Il tuo testo contiene un giudizio sulla persona. Prova a descrivere il comportamento osservato nella
                situazione specifica.
              </span>
            </div>
          )}

        {/* Level */}
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: T.textLight,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          Livello osservato
          <Tip id="livelloOsservato" />
        </label>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["training", "on_track", "example"].map((lvl) => {
            const cfg = getLevelCfg(lvl);
            const active = level === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                style={{
                  flex: 1,
                  padding: "9px 4px",
                  borderRadius: 10,
                  border: active ? `2px solid ${cfg.color}` : `2px solid ${T.border}`,
                  background: active ? cfg.bg : T.surface,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 15, color: active ? cfg.color : T.textLight }}>{cfg.icon}</span>
                <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? cfg.color : T.textMuted }}>
                  {cfg.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Save */}
        <button
          onClick={() => {
            if (text && level) onSave(person, behavior, text, level);
          }}
          disabled={!text || !level}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: T.radiusMd,
            border: "none",
            background: text && level ? T.accent : T.border,
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: text && level ? "pointer" : "default",
            transition: "all 0.2s ease",
            boxShadow: text && level ? T.shadowMedium : "none",
            fontFamily: T.fontBody,
          }}
          onMouseEnter={(e) => {
            if (text && level) e.currentTarget.style.background = T.accentHover;
          }}
          onMouseLeave={(e) => {
            if (text && level) e.currentTarget.style.background = T.accent;
          }}
        >
          Salva nota
        </button>
      </div>
    </div>
  );
}

// History Drawer
function HistoryDrawer({ notes, behaviorName, personName, onClose }) {
  const managerNotes = notes.filter((n) => n.author === "manager");
  const employeeNotes = notes.filter((n) => n.author === "employee");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 150, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ flex: 1, background: "rgba(0,0,0,0.35)" }} onClick={onClose} />
      <div
        style={{
          width: Math.min(420, typeof window !== "undefined" ? window.innerWidth : 420),
          background: T.surface,
          boxShadow: "-4px 0 30px rgba(0,0,0,0.1)",
          overflowY: "auto",
          padding: 24,
          animation: "slideIn 0.22s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>{behaviorName}</h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 22, color: T.textLight, cursor: "pointer" }}
          >
            ×
          </button>
        </div>
        {notes.length === 0 && (
          <p style={{ color: T.textLight, fontSize: 13, fontStyle: "italic" }}>Nessuna situazione registrata.</p>
        )}
        {[
          { label: "Osservazioni del manager", items: managerNotes },
          { label: `Prospettiva di ${personName || "Chiara"}`, items: employeeNotes },
        ].map((group) =>
          group.items.length > 0 ? (
            <div key={group.label} style={{ marginBottom: 18 }}>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: T.textLight,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {group.label}
              </span>
              {group.items.map((note) => {
                const cfg = getLevelCfg(note.level);
                return (
                  <div
                    key={note.id}
                    style={{
                      borderLeft: `3px solid ${cfg.color}`,
                      background: cfg.bg,
                      borderRadius: "0 10px 10px 0",
                      padding: "12px 14px",
                      marginTop: 8,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <span style={{ fontSize: 11, color: T.textLight }}>{note.date}</span>
                    </div>
                    <p style={{ fontSize: 13, color: T.text, margin: 0, lineHeight: 1.5 }}>{note.text}</p>
                  </div>
                );
              })}
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

// Team Dashboard
function TeamDashboard({ team, evals, notes, onClose }) {
  const { mostCritical, strongest, behaviorStats } = getTeamInsights(team, evals, notes);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        background: T.bg,
        overflowY: "auto",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 20, color: T.textMuted, cursor: "pointer" }}
          >
            ←
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>Vista Team</h2>
        </div>

        {/* AI Insights */}
        <div
          style={{
            background: T.ai.bg,
            borderRadius: 14,
            padding: 18,
            marginBottom: 18,
            border: `1px solid ${T.ai.color}22`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 15, color: T.ai.color }}>✦</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.ai.color,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Insight AI
            </span>
            <Tip id="insightAI" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                style={{
                  fontSize: 13,
                  background: T.training.bg,
                  color: T.training.color,
                  padding: "2px 10px",
                  borderRadius: 10,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Area critica
              </span>
              <span style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>
                <strong>{mostCritical.name}</strong> — {mostCritical.insight}
              </span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                style={{
                  fontSize: 13,
                  background: T.example.bg,
                  color: T.example.color,
                  padding: "2px 10px",
                  borderRadius: 10,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Punto di forza
              </span>
              <span style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>
                <strong>{strongest.name}</strong> — {strongest.insight}
              </span>
            </div>
          </div>
        </div>

        {/* Behavior heatmap */}
        <div
          style={{
            background: T.surface,
            borderRadius: 14,
            border: `1px solid ${T.border}`,
            padding: 18,
            marginBottom: 18,
          }}
        >
          <h4
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: T.text,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            Mappa comportamenti
            <Tip id="mappaComportamenti" />
          </h4>
          {/* Header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `1fr repeat(${team.length}, 48px)`,
              gap: 4,
              marginBottom: 8,
            }}
          >
            <div />
            {team.map((m) => (
              <div key={m.id} style={{ textAlign: "center" }}>
                <Avatar initials={m.initials} size={28} color="#A3A8B5" style={{ margin: "0 auto" }} />
              </div>
            ))}
          </div>
          {BEHAVIORS.map((b) => {
            return (
              <div
                key={b.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: `1fr repeat(${team.length}, 48px)`,
                  gap: 4,
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{b.name}</span>
                {team.map((m) => {
                  const lvl = evals[m.id]?.[b.id];
                  const cfg = lvl ? getLevelCfg(lvl) : null;
                  return (
                    <div
                      key={m.id}
                      style={{
                        width: 40,
                        height: 40,
                        margin: "0 auto",
                        borderRadius: 10,
                        background: cfg ? cfg.bg : T.bg,
                        border: `1px solid ${cfg ? cfg.color + "33" : T.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {cfg && <span style={{ fontSize: 16, color: cfg.color }}>{cfg.icon}</span>}
                      {!cfg && <span style={{ fontSize: 16, color: T.border }}>·</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {/* Legend */}
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 16,
              paddingTop: 12,
              borderTop: `1px solid ${T.border}`,
              flexWrap: "wrap",
            }}
          >
            {["training", "on_track", "example"].map((lvl) => {
              const cfg = getLevelCfg(lvl);
              return (
                <div key={lvl} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, color: cfg.color }}>{cfg.icon}</span>
                  <span style={{ fontSize: 11, color: T.textMuted }}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual cards */}
        {team.map((member) => {
          const memberEvals = evals[member.id] || {};
          const strengths = Object.entries(memberEvals)
            .filter(([, v]) => v === "example")
            .map(([k]) => BEHAVIORS.find((b) => b.id === k)?.name)
            .filter(Boolean);
          const critical = Object.entries(memberEvals)
            .filter(([, v]) => v === "training")
            .map(([k]) => BEHAVIORS.find((b) => b.id === k)?.name)
            .filter(Boolean);
          return (
            <div
              key={member.id}
              style={{
                background: T.surface,
                borderRadius: 14,
                border: `1px solid ${T.border}`,
                padding: 18,
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Avatar initials={member.initials} size={34} color="#1A1A1A" />
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{member.name}</span>
                  <span style={{ fontSize: 12, color: T.textMuted, display: "block" }}>{member.role}</span>
                </div>
              </div>
              {strengths.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: T.onTrack.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Punti di forza
                  </span>
                  <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                    {strengths.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 12,
                          background: T.onTrack.bg,
                          color: T.onTrack.color,
                          padding: "3px 10px",
                          borderRadius: 12,
                          fontWeight: 600,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {critical.length > 0 && (
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: T.training.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Da sviluppare
                  </span>
                  <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                    {critical.map((c) => (
                      <span
                        key={c}
                        style={{
                          fontSize: 12,
                          background: T.training.bg,
                          color: T.training.color,
                          padding: "3px 10px",
                          borderRadius: 12,
                          fontWeight: 600,
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TEAM VALIDATION SCREEN ──────────────────────────────────────────────────
function TeamValidationScreen({ initialSelection, isFirstTime, onValidate }) {
  const [selected, setSelected] = useState(initialSelection || SUGGESTED_TEAM);
  const [showAdd, setShowAdd] = useState(false);
  const available = ORG_ALL.filter((p) => !selected.includes(p.id));

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: ${T.bg}; min-height: 100vh; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); opacity:0; } to { transform: translateY(0); opacity:1; } }
        button { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>
      <div
        style={{
          maxWidth: 540,
          margin: "0 auto",
          padding: "48px 20px 100px",
          minHeight: "100vh",
          animation: "fadeIn 0.3s ease",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          {/* CVE Logo */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#1A1A1A",
              borderRadius: 12,
              padding: "10px 16px",
              marginBottom: 16,
            }}
          >
            <img src={cveLogo} alt="CVE" style={{ height: 28, objectFit: "contain" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: T.ai.bg,
                border: `1px solid ${T.ai.color}22`,
                borderRadius: 20,
                padding: "5px 12px",
              }}
            >
              <span style={{ fontSize: 13, color: T.ai.color }}>✦</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: T.ai.color }}>
                {isFirstTime ? "Setup iniziale" : "Modifica team"}
              </span>
            </div>
          </div>
          <h1
            style={{
              fontFamily: T.fontHeading,
              fontSize: 28,
              color: T.text,
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: 10,
            }}
          >
            {isFirstTime ? "Configura il tuo team" : "Il tuo team attuale"}
          </h1>
          <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.5 }}>
            {isFirstTime
              ? "Il sistema ha suggerito le persone di sotto basandosi sulla struttura aziendale. Conferma, rimuovi o aggiungi chi serve."
              : "Aggiungi o rimuovi persone dal tuo team. Le modifiche entrano subito in effetto."}
          </p>
        </div>

        {/* Suggested team */}
        <div style={{ marginBottom: 10 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.textLight,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Il tuo team ({selected.length})
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {ORG_ALL.filter((p) => selected.includes(p.id)).map((person) => (
            <div
              key={person.id}
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Avatar initials={person.initials} size={40} color={T.accent} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.text, display: "block" }}>{person.name}</span>
                <span style={{ fontSize: 12, color: T.textMuted }}>{person.role}</span>
              </div>
              {/* Remove button */}
              <button
                onClick={() => toggle(person.id)}
                style={{
                  background: T.bg,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: T.textMuted,
                  fontSize: 16,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.training.bg;
                  e.currentTarget.style.color = T.training.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.bg;
                  e.currentTarget.style.color = T.textMuted;
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add button */}
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{
            width: "100%",
            background: "transparent",
            border: `1.5px dashed ${T.border}`,
            borderRadius: 14,
            padding: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: showAdd ? 12 : 20,
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.text)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
        >
          <span style={{ fontSize: 18, color: T.textMuted }}>+</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.textMuted }}>Aggiungi persona</span>
        </button>

        {/* Dropdown: persone disponibili */}
        {showAdd && available.length > 0 && (
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: 12,
              marginBottom: 20,
              animation: "fadeIn 0.15s ease",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.textLight,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
                display: "block",
              }}
            >
              Altre persone nell'organizzazione
            </span>
            {available.map((person) => (
              <button
                key={person.id}
                onClick={() => {
                  toggle(person.id);
                }}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  padding: "10px 8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderRadius: 10,
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Avatar initials={person.initials} size={32} color="#A3A8B5" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text, display: "block" }}>{person.name}</span>
                  <span style={{ fontSize: 11.5, color: T.textMuted }}>
                    {person.role} · {person.department}
                  </span>
                </div>
                <span style={{ fontSize: 16, color: T.onTrack.color, fontWeight: 700 }}>+</span>
              </button>
            ))}
          </div>
        )}
        {showAdd && available.length === 0 && (
          <p style={{ fontSize: 13, color: T.textLight, fontStyle: "italic", marginBottom: 20 }}>
            Tutte le persone sono già nel tuo team.
          </p>
        )}

        {/* Conferma */}
        {isFirstTime && (
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: 18,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, color: T.textMuted, marginTop: 2 }}>◇</span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text, display: "block", marginBottom: 2 }}>
                  Prima di confermare
                </span>
                <span style={{ fontSize: 12.5, color: T.textMuted, lineHeight: 1.5 }}>
                  Questa configurazione può essere modificata in futuro, ma per ora il sistema userà questa lista come
                  base per le valutazioni e la vista team.
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => onValidate(selected)}
          disabled={selected.length === 0}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: T.radiusMd,
            border: "none",
            background: selected.length > 0 ? T.accent : T.border,
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: selected.length > 0 ? "pointer" : "default",
            transition: "all 0.2s ease",
            boxShadow: selected.length > 0 ? T.shadowMedium : "none",
            fontFamily: T.fontBody,
          }}
          onMouseEnter={(e) => {
            if (selected.length > 0) e.currentTarget.style.background = T.accentHover;
          }}
          onMouseLeave={(e) => {
            if (selected.length > 0) e.currentTarget.style.background = T.accent;
          }}
        >
          {isFirstTime ? `Conferma team (${selected.length} persone)` : `Salva modifiche (${selected.length} persone)`}
        </button>
      </div>
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState("manager");
  const [screen, setScreen] = useState("home"); // home | profile | behaviors | team
  const [selectedPerson, setSelectedPerson] = useState("chiara");
  const [quickNote, setQuickNote] = useState(false);
  const [quickNoteContext, setQuickNoteContext] = useState<{ person?: string; behavior?: string }>({});
  const [historyOpen, setHistoryOpen] = useState(null);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [evals, setEvals] = useState(INITIAL_EVALS);
  const [employeeNotes, setEmployeeNotes] = useState({});
  const [profileOk, setProfileOk] = useState({ manager: false, employee: false });

  // ── Team validation (primo accesso manager) ──────────────────────────────
  const [teamValidated, setTeamValidated] = useState(false);
  const [hasEverValidated, setHasEverValidated] = useState(false);
  const [activeTeam, setActiveTeam] = useState(TEAM); // team attivo dopo validazione

  const handleTeamValidate = (selectedIds) => {
    const validated = ORG_ALL.filter((p) => selectedIds.includes(p.id));
    setActiveTeam(validated);
    setTeamValidated(true);
    setHasEverValidated(true);
  };

  // Se il manager non ha ancora validato il team, mostra la schermata di validazione
  if (role === "manager" && !teamValidated) {
    return (
      <TeamValidationScreen
        initialSelection={hasEverValidated ? activeTeam.map((p) => p.id) : null}
        isFirstTime={!hasEverValidated}
        onValidate={handleTeamValidate}
      />
    );
  }

  // Usa activeTeam ovunque al posto di TEAM (per il resto dell'app)
  const currentTeam = role === "manager" ? activeTeam : [activeTeam.find((t) => t.id === "chiara") || activeTeam[0]];
  const isManager = role === "manager";
  const personObj = activeTeam.find((t) => t.id === selectedPerson) || activeTeam[0];
  const personNotes = notes[personObj?.id] || {};

  const handleSaveNote = (personId, behaviorId, text, level) => {
    const newNote = { id: Date.now(), date: "Oggi", text, author: "manager", level };
    setNotes((prev) => ({
      ...prev,
      [personId]: { ...prev[personId], [behaviorId]: [...(prev[personId]?.[behaviorId] || []), newNote] },
    }));
    setEvals((prev) => ({ ...prev, [personId]: { ...prev[personId], [behaviorId]: level } }));
    setQuickNote(false);
  };

  const handleEvalChange = (behaviorId, level) => {
    setEvals((prev) => ({ ...prev, [selectedPerson]: { ...prev[selectedPerson], [behaviorId]: level } }));
  };

  const handleEmployeeNote = (behaviorId, text) => {
    const newNote = { id: Date.now(), date: "Oggi", text, author: "employee", level: "on_track" };
    setNotes((prev) => ({
      ...prev,
      [selectedPerson]: {
        ...prev[selectedPerson],
        [behaviorId]: [...(prev[selectedPerson]?.[behaviorId] || []), newNote],
      },
    }));
  };

  // ── SCREENS ──────────────────────────────────────────────────────────────

  // HOME
  if (screen === "home") {
    return (
      <>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', system-ui, sans-serif; background: ${T.bg}; min-height: 100vh; }
          @keyframes slideUp { from { transform: translateY(100%); opacity:0; } to { transform: translateY(0); opacity:1; } }
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes stagger0 { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
          textarea::-webkit-scrollbar { width: 4px; } textarea::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
          button { font-family: 'Inter', system-ui, sans-serif; }
        `}</style>
        <div
          style={{
            maxWidth: 540,
            margin: "0 auto",
            padding: "32px 20px 100px",
            minHeight: "100vh",
            animation: "fadeIn 0.3s ease",
          }}
        >
          {/* CVE Logo */}
          <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#1A1A1A",
                borderRadius: 12,
                padding: "12px 20px",
              }}
            >
              <img src={cveLogo} alt="CVE" style={{ height: 36, objectFit: "contain" }} />
            </div>
          </div>

          {/* Role switcher */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                gap: 3,
                background: T.surface,
                borderRadius: 20,
                padding: 3,
                border: `1px solid ${T.border}`,
              }}
            >
              {[
                { id: "manager", label: "Dalila" },
                { id: "employee", label: "Chiara" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 18,
                    border: "none",
                    background: role === r.id ? T.accent : "transparent",
                    color: role === r.id ? "#fff" : T.textMuted,
                    fontSize: 13,
                    fontWeight: role === r.id ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: T.fontBody,
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
            {isManager && (
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setTeamValidated(false)}
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 20,
                    padding: "6px 12px",
                    fontSize: 11,
                    color: T.textMuted,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ✎ Modifica
                </button>
                <button
                  onClick={() => setScreen("team")}
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 12,
                    color: T.text,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span>👥</span> Team
                </button>
              </div>
            )}
          </div>

          {/* Greeting */}
          <h1
            style={{
              fontFamily: T.fontHeading,
              fontSize: 26,
              color: T.text,
              fontWeight: 700,
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            Buongiorno, {isManager ? "Dalila" : "Chiara"}
          </h1>
          <p style={{ fontSize: 14, color: T.textMuted, marginBottom: 28, lineHeight: 1.6, fontFamily: T.fontBody }}>
            {isManager ? "Segui la crescita del tuo team" : "Segui il tuo percorso di crescita"}
          </p>

          {/* Quick note CTA - manager only */}
          {isManager && (
            <button
              onClick={() => {
                setQuickNote(true);
                setQuickNoteContext({});
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: T.accent,
                borderRadius: T.radiusLg,
                border: "none",
                padding: "18px 22px",
                cursor: "pointer",
                marginBottom: 20,
                boxShadow: T.shadowMedium,
                transition: "all 0.2s ease",
                fontFamily: T.fontBody,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.accentHover;
                e.currentTarget.style.transform = "scale(1.01)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.accent;
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: T.radiusSm,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>+</span>
              </div>
              <div style={{ textAlign: "left", flex: 1 }}>
                <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, display: "block", fontFamily: T.fontBody }}>
                  Registra una nota
                </span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Aggiungi un'osservazione rapida</span>
              </div>
              <Tip id="registraNota" position="top" />
            </button>
          )}

          {/* Team members / or own profile */}
          <div style={{ marginBottom: 10 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.textLight,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {isManager ? "Il tuo team" : "Il tuo profilo"}
              {isManager && <Tip id="ilTuoTeam" />}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(isManager ? currentTeam : currentTeam.filter((t) => t.id === "chiara")).map((member, i) => {
              const memberEvals = evals[member.id] || {};
              const trainingCount = Object.values(memberEvals).filter((v) => v === "training").length;
              const exampleCount = Object.values(memberEvals).filter((v) => v === "example").length;
              return (
                <div key={member.id} style={{ animation: `stagger0 0.3s ease ${i * 0.06}s both` }}>
                  <button
                    onClick={() => {
                      setSelectedPerson(member.id);
                      setScreen("profile");
                    }}
                    style={{
                      width: "100%",
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: T.radiusLg,
                      padding: "18px 20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      textAlign: "left",
                      boxShadow: T.shadowSoft,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.01)";
                      e.currentTarget.style.boxShadow = T.shadowMedium;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = T.shadowSoft;
                    }}
                  >
                    <Avatar initials={member.initials} size={44} color={T.accent} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: T.text, display: "block" }}>
                        {member.name}
                      </span>
                      <span style={{ fontSize: 12, color: T.textMuted }}>{member.role}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {exampleCount > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            background: T.example.bg,
                            color: T.example.color,
                            padding: "3px 8px",
                            borderRadius: 8,
                            fontWeight: 700,
                          }}
                        >
                          ★ {exampleCount}
                        </span>
                      )}
                      {trainingCount > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            background: T.training.bg,
                            color: T.training.color,
                            padding: "3px 8px",
                            borderRadius: 8,
                            fontWeight: 700,
                          }}
                        >
                          ↗ {trainingCount}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Note Modal */}
        {quickNote && (
          <QuickNoteModal
            team={activeTeam}
            onClose={() => setQuickNote(false)}
            onSave={handleSaveNote}
            selectedPerson={quickNoteContext.person}
            selectedBehavior={quickNoteContext.behavior}
          />
        )}
      </>
    );
  }

  // PROFILE
  if (screen === "profile") {
    return (
      <>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', system-ui, sans-serif; background: ${T.bg}; min-height: 100vh; }
          @keyframes slideUp { from { transform: translateY(100%); opacity:0; } to { transform: translateY(0); opacity:1; } }
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes expandDown { from { opacity:0; max-height:0; } to { opacity:1; max-height:600px; } }
          textarea::-webkit-scrollbar { width: 4px; } textarea::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
          button { font-family: 'Inter', system-ui, sans-serif; }
        `}</style>
        <div
          style={{
            maxWidth: 540,
            margin: "0 auto",
            padding: "24px 20px 100px",
            minHeight: "100vh",
            animation: "fadeIn 0.25s ease",
          }}
        >
          {/* Back */}
          <button
            onClick={() => setScreen("home")}
            style={{
              background: "none",
              border: "none",
              color: T.textMuted,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginBottom: 16,
            }}
          >
            ← Indietro
          </button>

          {/* Profile header */}
          <div
            style={{
              background: T.surface,
              borderRadius: 16,
              border: `1px solid ${T.border}`,
              padding: 22,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar initials={personObj.initials} size={50} color={T.accent} />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>{personObj.name}</h2>
                <p style={{ fontSize: 13, color: T.textMuted, margin: "2px 0 0" }}>{personObj.role}</p>
              </div>
            </div>
            {/* Ruolo summary */}
            <div style={{ marginTop: 16, padding: "12px 14px", background: T.bg, borderRadius: 10 }}>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, margin: 0 }}>
                <strong>Obiettivo:</strong> Gestire e sviluppare il portfolio clienti nel territorio, generando nuovo
                fatturato con approcci consultivi personalizzati.
              </p>
            </div>
            {/* Double OK */}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              {[
                { key: "manager", label: "Dalila" },
                { key: "employee", label: "Chiara" },
              ].map((p) => {
                const ok = profileOk[p.key];
                const canToggle = (isManager && p.key === "manager") || (!isManager && p.key === "employee");
                return (
                  <button
                    key={p.key}
                    onClick={() => canToggle && setProfileOk((prev) => ({ ...prev, [p.key]: !prev[p.key] }))}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: ok ? `2px solid ${T.accent}` : `2px solid ${T.border}`,
                      background: ok ? T.accentSoft : T.surface,
                      color: ok ? T.text : T.textMuted,
                      fontSize: 12.5,
                      fontWeight: ok ? 700 : 500,
                      cursor: canToggle ? "pointer" : "default",
                      opacity: canToggle ? 1 : 0.6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      transition: "all 0.2s",
                    }}
                  >
                    <span>{ok ? "✓" : "○"}</span> {p.label} {ok ? "OK" : "conferma"}
                  </button>
                );
              })}
            </div>
            {profileOk.manager && profileOk.employee && (
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  background: T.onTrack.bg,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ color: T.onTrack.color }}>✓</span>
                <span style={{ fontSize: 12.5, color: T.onTrack.color, fontWeight: 600 }}>Profilo condiviso</span>
              </div>
            )}
          </div>

          {/* Quick note CTA — conversazionale, sempre visibile in alto */}
          {isManager && (
            <button
              onClick={() => {
                setQuickNote(true);
                setQuickNoteContext({ person: selectedPerson });
              }}
              style={{
                width: "100%",
                marginBottom: 18,
                background: T.surface,
                border: `1.5px dashed ${T.border}`,
                borderRadius: 14,
                padding: "13px 18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.ai.color;
                e.currentTarget.style.background = T.ai.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.background = T.surface;
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: T.accentSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                +
              </span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text, display: "block" }}>
                  Hai qualcosa da scrivere su {personObj.name.split(" ")[0]}?
                </span>
                <span style={{ fontSize: 12, color: T.textMuted }}>Registra un'osservazione rapida</span>
              </div>
            </button>
          )}

          {/* Comportamenti Chiave — inline */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{ fontSize: 13, fontWeight: 700, color: T.text, display: "inline-flex", alignItems: "center" }}
            >
              Comportamenti Chiave
              <Tip id="comportamentiChiave" />
            </span>
          </div>

          {["dna", "team"].map((cat) => (
            <div key={cat}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  marginTop: cat === "team" ? 20 : 8,
                }}
              >
                <div style={{ flex: 1, height: 1, background: T.border }} />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: cat === "dna" ? T.accent : "#0D9488",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {cat === "dna" ? "DNA Aziendale" : "Team Vendite"}
                  <Tip id={cat === "dna" ? "dnaAziendale" : "teamVendite"} />
                </span>
                <div style={{ flex: 1, height: 1, background: T.border }} />
              </div>

              {BEHAVIORS.filter((b) => b.category === cat).map((behavior) => {
                const behaviorNotes = personNotes[behavior.id] || [];
                const currentLevel = evals[selectedPerson]?.[behavior.id];
                const cfg = currentLevel ? getLevelCfg(currentLevel) : null;
                const aiInsight = getAIInsight(behaviorNotes);
                const showCounter = isManager && currentLevel === "training" && hasPositiveHistory(behaviorNotes);

                return (
                  <BehaviorCardNew
                    key={behavior.id}
                    behavior={behavior}
                    isManager={isManager}
                    currentLevel={currentLevel}
                    cfg={cfg}
                    behaviorNotes={behaviorNotes}
                    aiInsight={aiInsight}
                    showCounter={showCounter}
                    onEvalChange={handleEvalChange}
                    onHistoryOpen={() => setHistoryOpen(behavior.id)}
                    onEmployeeNote={(text) => handleEmployeeNote(behavior.id, text)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* History Drawer */}
        {historyOpen && (
          <HistoryDrawer
            notes={personNotes[historyOpen] || []}
            behaviorName={BEHAVIORS.find((b) => b.id === historyOpen)?.name}
            personName={personObj?.name?.split(" ")[0]}
            onClose={() => setHistoryOpen(null)}
          />
        )}
        {quickNote && (
          <QuickNoteModal
            team={activeTeam}
            onClose={() => setQuickNote(false)}
            onSave={handleSaveNote}
            selectedPerson={quickNoteContext.person}
            selectedBehavior={quickNoteContext.behavior}
          />
        )}
      </>
    );
  }

  // BEHAVIORS
  if (screen === "behaviors") {
    return (
      <>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', system-ui, sans-serif; background: ${T.bg}; min-height: 100vh; }
          @keyframes slideUp { from { transform: translateY(100%); opacity:0; } to { transform: translateY(0); opacity:1; } }
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes expandDown { from { opacity:0; max-height:0; } to { opacity:1; max-height:600px; } }
          textarea::-webkit-scrollbar { width: 4px; } textarea::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
          button { font-family: 'Inter', system-ui, sans-serif; }
        `}</style>
        <div
          style={{
            maxWidth: 540,
            margin: "0 auto",
            padding: "24px 20px 100px",
            minHeight: "100vh",
            animation: "fadeIn 0.25s ease",
          }}
        >
          <button
            onClick={() => setScreen("profile")}
            style={{
              background: "none",
              border: "none",
              color: T.textMuted,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginBottom: 8,
            }}
          >
            ← Indietro
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 18 }}>Comportamenti Chiave</h2>

          {/* Category groups */}
          {["dna", "team"].map((cat) => (
            <div key={cat}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  marginTop: cat === "team" ? 20 : 0,
                }}
              >
                <div style={{ flex: 1, height: 1, background: T.border }} />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: cat === "dna" ? T.accent : "#0D9488",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {cat === "dna" ? "DNA Aziendale" : "Team Vendite"}
                  <Tip id={cat === "dna" ? "dnaAziendale" : "teamVendite"} />
                </span>
                <div style={{ flex: 1, height: 1, background: T.border }} />
              </div>

              {BEHAVIORS.filter((b) => b.category === cat).map((behavior) => {
                const behaviorNotes = personNotes[behavior.id] || [];
                const currentLevel = evals[selectedPerson]?.[behavior.id];
                const cfg = currentLevel ? getLevelCfg(currentLevel) : null;
                const aiInsight = getAIInsight(behaviorNotes);
                const showCounter = isManager && currentLevel === "training" && hasPositiveHistory(behaviorNotes);

                return (
                  <BehaviorCardNew
                    key={behavior.id}
                    behavior={behavior}
                    isManager={isManager}
                    currentLevel={currentLevel}
                    cfg={cfg}
                    behaviorNotes={behaviorNotes}
                    aiInsight={aiInsight}
                    showCounter={showCounter}
                    onEvalChange={handleEvalChange}
                    onHistoryOpen={() => setHistoryOpen(behavior.id)}
                    onEmployeeNote={(text) => handleEmployeeNote(behavior.id, text)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* History Drawer */}
        {historyOpen && (
          <HistoryDrawer
            notes={personNotes[historyOpen] || []}
            behaviorName={BEHAVIORS.find((b) => b.id === historyOpen)?.name}
            personName={personObj?.name?.split(" ")[0]}
            onClose={() => setHistoryOpen(null)}
          />
        )}
        {quickNote && (
          <QuickNoteModal
            team={activeTeam}
            onClose={() => setQuickNote(false)}
            onSave={handleSaveNote}
            selectedPerson={quickNoteContext.person}
            selectedBehavior={quickNoteContext.behavior}
          />
        )}
      </>
    );
  }

  // TEAM
  if (screen === "team") {
    return (
      <>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', system-ui, sans-serif; background: ${T.bg}; min-height: 100vh; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          button { font-family: 'Inter', system-ui, sans-serif; }
        `}</style>
        <TeamDashboard team={activeTeam} evals={evals} notes={notes} onClose={() => setScreen("home")} />
      </>
    );
  }

  return null;
}

// ─── BEHAVIOR CARD (used in behaviors screen) ────────────────────────────────
function BehaviorCardNew({
  behavior,
  isManager,
  currentLevel,
  cfg,
  behaviorNotes,
  aiInsight,
  showCounter,
  onEvalChange,
  onHistoryOpen,
  onEmployeeNote,
}) {
  const [expanded, setExpanded] = useState(false);
  const [empText, setEmpText] = useState("");

  return (
    <div
      style={{
        background: T.surface,
        borderRadius: 14,
        border: `1px solid ${T.border}`,
        marginBottom: 10,
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "15px 18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: behavior.category === "dna" ? T.accent : "#0D9488",
                background: behavior.category === "dna" ? T.accentSoft : "#E6FFFA",
                padding: "2px 8px",
                borderRadius: 8,
              }}
            >
              {behavior.category === "dna" ? "DNA" : "Vendite"}
            </span>
            {cfg && (
              <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>
                {cfg.icon} {cfg.label}
              </span>
            )}
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{behavior.name}</span>
        </div>
        <span
          style={{
            color: T.textLight,
            fontSize: 18,
            transition: "transform 0.2s",
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          ▾
        </span>
      </button>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: "0 18px 18px", animation: "expandDown 0.2s ease" }}>
          {/* Description */}
          <p
            style={{
              fontSize: 13,
              color: "#555",
              lineHeight: 1.55,
              margin: "0 0 10px",
              background: T.bg,
              padding: "10px 12px",
              borderRadius: 10,
              borderLeft: `3px solid ${T.border}`,
            }}
          >
            {behavior.description}
          </p>
          {/* Indicators */}
          <div style={{ marginBottom: 14 }}>
            {behavior.indicators.map((ind, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 3 }}>
                <span style={{ color: T.textLight, fontSize: 12, marginTop: 1 }}>·</span>
                <span style={{ fontSize: 12.5, color: T.textMuted }}>{ind}</span>
              </div>
            ))}
          </div>

          {/* Manager actions */}
          {isManager && (
            <>
              {/* Level selector */}
              <label
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: T.textLight,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Valutazione
                <Tip id="valutazione" />
              </label>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {["training", "on_track", "example"].map((lvl) => {
                  const c = getLevelCfg(lvl);
                  const active = currentLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => onEvalChange(behavior.id, lvl)}
                      style={{
                        flex: 1,
                        padding: "8px 4px",
                        borderRadius: 10,
                        border: active ? `2px solid ${c.color}` : `2px solid ${T.border}`,
                        background: active ? c.bg : T.surface,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: 15, color: active ? c.color : T.textLight }}>{c.icon}</span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: active ? 700 : 500,
                          color: active ? c.color : T.textMuted,
                        }}
                      >
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* AI Counter indicator - discreto */}
              {showCounter && (
                <button
                  onClick={onHistoryOpen}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    background: T.ai.bg,
                    borderRadius: 10,
                    border: `1px solid ${T.ai.color}22`,
                    cursor: "pointer",
                    marginBottom: 12,
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 13, color: T.ai.color }}>✦</span>
                  <span style={{ fontSize: 12, color: T.ai.color, fontWeight: 600, flex: 1 }}>
                    Questo comportamento è stato osservato in altre situazioni
                  </span>
                  <Tip id="aiCounter" position="top" />
                  <span style={{ fontSize: 11, color: T.ai.color }}>vedi →</span>
                </button>
              )}

              {/* Storico */}
              <button
                onClick={onHistoryOpen}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  background: T.surface,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  color: T.textMuted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span>📋</span> Storico ({behaviorNotes.length})
              </button>
            </>
          )}

          {/* Employee view */}
          {!isManager && (
            <>
              {/* Manager's eval visible to Chiara */}
              {currentLevel && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    background: T.bg,
                    borderRadius: 10,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 11, color: T.textMuted }}>Valutazione di Dalila:</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>
              )}
              <label
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: T.textLight,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                La tua prospettiva
                <Tip id="tuaPerspettiva" />
              </label>
              <textarea
                value={empText}
                onChange={(e) => setEmpText(e.target.value)}
                placeholder="Aggiungi il tuo punto di vista su una situazione..."
                style={{
                  width: "100%",
                  minHeight: 70,
                  padding: "12px 14px",
                  border: `1.5px solid ${T.border}`,
                  borderRadius: T.radiusSm,
                  fontSize: 13,
                  color: T.text,
                  fontFamily: T.fontBody,
                  resize: "none",
                  outline: "none",
                  background: T.bg,
                  boxSizing: "border-box",
                  lineHeight: 1.6,
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = T.accent;
                  e.target.style.boxShadow = `0 0 0 3px ${T.accentRing}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = T.border;
                  e.target.style.boxShadow = "none";
                }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {empText && (
                  <button
                    onClick={() => {
                      onEmployeeNote(empText);
                      setEmpText("");
                    }}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: T.radiusSm,
                      border: "none",
                      background: T.accent,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = T.accentHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = T.accent)}
                  >
                    Salva
                  </button>
                )}
                <button
                  onClick={onHistoryOpen}
                  style={{
                    flex: empText ? 1 : "unset",
                    padding: "8px 14px",
                    borderRadius: 10,
                    border: `1px solid ${T.border}`,
                    background: T.surface,
                    cursor: "pointer",
                    fontSize: 13,
                    color: T.textMuted,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>📋</span> Storico ({behaviorNotes.length})
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
