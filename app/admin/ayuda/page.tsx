"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useState } from "react";
import {
  LogIn, LayoutDashboard, FileText, ArrowRight, MessageSquare,
  BarChart3, Settings, ChevronDown, ChevronUp, CheckCircle2,
  AlertTriangle, Clock, Shield, Eye, Send, RefreshCw,
  BookOpen, Info, Star,
} from "lucide-react";

/* ── Types ── */
interface Section {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

/* ── Status badge helper ── */
function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 border ${color}`}>
      {label}
    </span>
  );
}

/* ── Urgency badge helper ── */
function UrgencyBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 border ${color}`}>
      {label}
    </span>
  );
}

/* ── Step item ── */
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="shrink-0 w-8 h-8 bg-crimson-600 text-white flex items-center justify-center text-sm font-bold">
        {n}
      </div>
      <div className="pt-0.5 flex-1">
        <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
        <div className="text-sm text-gray-600 leading-relaxed space-y-1">{children}</div>
      </div>
    </div>
  );
}

/* ── Callout ── */
function Callout({ type, children }: { type: "info" | "warning" | "tip"; children: React.ReactNode }) {
  const styles = {
    info:    { bg: "bg-blue-50 border-blue-200",   icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> },
    warning: { bg: "bg-amber-50 border-amber-200", icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> },
    tip:     { bg: "bg-green-50 border-green-200", icon: <Star className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 border px-4 py-3 mt-4 ${s.bg}`}>
      {s.icon}
      <p className="text-sm text-gray-700 leading-relaxed">{children}</p>
    </div>
  );
}

/* ── Divider ── */
function Divider() {
  return <div className="border-t border-gray-100 my-6" />;
}

/* ── Accordion section ── */
function AccordionSection({ section, open, onToggle }: { section: Section; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-crimson-50 border border-crimson-100 flex items-center justify-center text-crimson-600">
            {section.icon}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">{section.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{section.subtitle}</p>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        }
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-100">
          {section.content}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function AyudaPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["acceso"]));

  function toggle(id: string) {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function openAndScroll(id: string) {
    setOpenSections(prev => new Set(Array.from(prev).concat(id)));
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  const sections: Section[] = [
    /* ─── 1. Acceso ─── */
    {
      id: "acceso",
      icon: <LogIn className="w-4 h-4" />,
      title: "Cómo acceder al panel",
      subtitle: "Inicio de sesión paso a paso",
      content: (
        <div className="space-y-5 pt-2">
          <div className="space-y-4">
            <Step n={1} title="Abre la página principal del buzón">
              <p>Entra a la URL de VozEscolar desde cualquier navegador. En el pie de página encontrarás el enlace <span className="font-mono bg-gray-100 px-1.5 py-0.5 text-xs">Portal admin</span>.</p>
            </Step>
            <Step n={2} title='Haz clic en "Portal admin"'>
              <p>El enlace está en la esquina inferior derecha de la página, discreto por seguridad. Te llevará a la pantalla de acceso.</p>
            </Step>
            <Step n={3} title="Escribe la contraseña de acceso">
              <p>Ingresa el PIN que te proporcionó el administrador del sistema. Puedes usar el ícono del ojo para ver lo que escribes.</p>
            </Step>
            <Step n={4} title='Presiona "Ingresar" o la tecla Enter'>
              <p>Si la contraseña es correcta, entrarás directamente a la <strong>Bandeja de Reportes</strong>. Si es incorrecta, la pantalla se sacudirá y podrás intentarlo de nuevo.</p>
            </Step>
          </div>
          <Callout type="info">
            La sesión se mantiene activa mientras el navegador esté abierto. Al cerrar el navegador, deberás ingresar la contraseña nuevamente. Para cerrar sesión manualmente, usa el botón <strong>&ldquo;Cerrar sesión&rdquo;</strong> en la parte inferior del menú lateral.
          </Callout>
        </div>
      ),
    },

    /* ─── 2. Bandeja ─── */
    {
      id: "bandeja",
      icon: <LayoutDashboard className="w-4 h-4" />,
      title: "Bandeja de reportes",
      subtitle: "Cómo leer y filtrar los reportes recibidos",
      content: (
        <div className="space-y-5 pt-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            La bandeja es la primera pantalla al entrar. Muestra todos los reportes recibidos, del más reciente al más antiguo.
          </p>

          <Divider />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Indicadores de urgencia</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Crítico",  color: "bg-red-50 text-red-700 border-red-300",    desc: "Requiere atención inmediata. Seguridad o acoso grave." },
              { label: "Alto",     color: "bg-orange-50 text-orange-700 border-orange-300", desc: "Situación seria que no puede esperar más de 24 h." },
              { label: "Medio",    color: "bg-yellow-50 text-yellow-700 border-yellow-300", desc: "Caso importante, atender en los próximos días." },
              { label: "Bajo",     color: "bg-green-50 text-green-700 border-green-300",    desc: "Observación o sugerencia sin urgencia inmediata." },
            ].map(({ label, color, desc }) => (
              <div key={label} className="border border-gray-100 p-3">
                <UrgencyBadge label={label} color={color} />
                <p className="text-xs text-gray-500 mt-2 leading-snug">{desc}</p>
              </div>
            ))}
          </div>

          <Divider />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Estados del reporte</p>
          <div className="space-y-2">
            {[
              { label: "Recibida",    color: "bg-gray-100 text-gray-600 border-gray-200",   desc: "Reporte nuevo, aún no revisado." },
              { label: "En revisión", color: "bg-blue-50 text-blue-700 border-blue-200",    desc: "El personal lo está analizando." },
              { label: "En proceso",  color: "bg-amber-50 text-amber-700 border-amber-200", desc: "Se están tomando acciones." },
              { label: "Resuelta",    color: "bg-green-50 text-green-700 border-green-200", desc: "Caso cerrado y atendido." },
            ].map(({ label, color, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <StatusBadge label={label} color={color} />
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>

          <Divider />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Cómo usar los filtros</p>
          <div className="space-y-4 mt-3">
            <Step n={1} title="Busca por texto">
              <p>El campo de búsqueda encuentra reportes que contengan palabras específicas en el contenido.</p>
            </Step>
            <Step n={2} title="Filtra por categoría">
              <p>Usa el menú <strong>Categoría</strong> para ver solo reportes de un tipo: acoso, docente, infraestructura, administrativo, seguridad u otro.</p>
            </Step>
            <Step n={3} title="Filtra por urgencia o estado">
              <p>Combina filtros para ver, por ejemplo, solo los <strong>críticos pendientes</strong>: Urgencia = Crítico + Estado = Recibida.</p>
            </Step>
          </div>
          <Callout type="tip">
            Al inicio de cada semana, filtra por <strong>Estado = Recibida</strong> para identificar reportes que aún no han sido atendidos.
          </Callout>
        </div>
      ),
    },

    /* ─── 3. Ver un reporte ─── */
    {
      id: "ver-reporte",
      icon: <FileText className="w-4 h-4" />,
      title: "Ver el detalle de un reporte",
      subtitle: "Qué contiene cada expediente y cómo interpretarlo",
      content: (
        <div className="space-y-5 pt-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            Haz clic en cualquier reporte de la bandeja para ver su expediente completo.
          </p>
          <div className="space-y-4">
            <Step n={1} title="Cabecera del expediente">
              <p>Muestra el <strong>folio único</strong> (ej. VE-2026-0001), la <strong>categoría</strong>, el <strong>rol del reportante</strong> (alumno, padre, docente o personal), la <strong>urgencia</strong> y la fecha de recepción.</p>
            </Step>
            <Step n={2} title="Contenido del reporte">
              <p>Es el texto completo que el reportante describió. Puede incluir nombres, lugares o situaciones específicas. Léelo con atención antes de tomar cualquier acción.</p>
            </Step>
            <Step n={3} title="Evidencia adjunta">
              <p>Si el reportante subió una imagen o documento, aparecerá en el expediente. Solo el personal autorizado puede verlo.</p>
            </Step>
            <Step n={4} title="Progreso del caso">
              <p>Muestra en qué estado está el reporte: <strong>Recibida → En revisión → En proceso → Resuelta</strong>. El paso actual está resaltado en rojo.</p>
            </Step>
          </div>
          <Callout type="warning">
            Los reportes anónimos no incluyen datos del reportante. No intentes identificar al alumno o persona con la información del reporte — la confidencialidad es obligatoria.
          </Callout>
        </div>
      ),
    },

    /* ─── 4. Avanzar estado ─── */
    {
      id: "estados",
      icon: <ArrowRight className="w-4 h-4" />,
      title: "Avanzar el estado de un caso",
      subtitle: "Flujo de trabajo: de recibido a resuelto",
      content: (
        <div className="space-y-5 pt-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            Cada reporte sigue un flujo de 4 estados. Tú decides cuándo avanzar al siguiente.
          </p>

          {/* Flow diagram */}
          <div className="border border-gray-200 p-5 bg-gray-50">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "1. Recibida",    color: "bg-gray-100 text-gray-700 border-gray-300" },
                { label: "→", color: "" },
                { label: "2. En revisión", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { label: "→", color: "" },
                { label: "3. En proceso",  color: "bg-amber-50 text-amber-700 border-amber-200" },
                { label: "→", color: "" },
                { label: "4. Resuelta",    color: "bg-green-50 text-green-700 border-green-200" },
              ].map((item, i) =>
                item.label === "→"
                  ? <span key={i} className="text-gray-400 font-bold text-sm">{item.label}</span>
                  : <StatusBadge key={i} label={item.label} color={item.color} />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Step n={1} title='Abre el reporte y localiza "Progreso del caso"'>
              <p>En la parte inferior izquierda del expediente verás el stepper visual con los 4 estados.</p>
            </Step>
            <Step n={2} title='Haz clic en el botón de avance'>
              <p>El botón cambia según el estado actual: <em>&ldquo;Marcar en revisión&rdquo;</em>, <em>&ldquo;Marcar en proceso&rdquo;</em> o <em>&ldquo;Marcar como resuelta&rdquo;</em>. Haz clic cuando hayas completado las acciones de ese estado.</p>
            </Step>
            <Step n={3} title="Confirma el cambio">
              <p>Aparecerá un mensaje verde <strong>&ldquo;Estado actualizado&rdquo;</strong>. El reportante verá el cambio en tiempo real en su página de seguimiento.</p>
            </Step>
          </div>

          <Divider />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">¿Cuándo avanzar cada estado?</p>
          <div className="space-y-3">
            {[
              { from: "Recibida → En revisión",  when: "Cuando hayas leído el reporte y comenzado a investigar." },
              { from: "En revisión → En proceso", when: "Cuando hayas convocado a las partes o iniciado acciones formales." },
              { from: "En proceso → Resuelta",    when: "Cuando el caso esté cerrado y hayas enviado la respuesta oficial." },
            ].map(({ from, when }) => (
              <div key={from} className="flex gap-3 items-start">
                <CheckCircle2 className="w-4 h-4 text-crimson-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{from}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{when}</p>
                </div>
              </div>
            ))}
          </div>
          <Callout type="tip">
            No es obligatorio avanzar todos los estados en un solo día. Cada cambio queda registrado en la línea de tiempo con fecha y hora exacta.
          </Callout>
        </div>
      ),
    },

    /* ─── 5. Respuesta oficial ─── */
    {
      id: "respuesta",
      icon: <MessageSquare className="w-4 h-4" />,
      title: "Enviar respuesta oficial",
      subtitle: "Cómo comunicarte con el reportante",
      content: (
        <div className="space-y-5 pt-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            El panel de IA a la derecha del expediente te ayuda a redactar y enviar una respuesta oficial que el reportante verá en su página de seguimiento.
          </p>
          <div className="space-y-4">
            <Step n={1} title="Revisa el análisis de sentimiento">
              <p>La IA analiza el tono emocional del reporte (escala 0–100). Un puntaje alto indica angustia o urgencia elevada — considera esto al redactar tu respuesta.</p>
            </Step>
            <Step n={2} title="Lee la respuesta sugerida por la IA">
              <p>La IA genera automáticamente un borrador de respuesta basado en la categoría y urgencia. Es un punto de partida, no una respuesta final.</p>
            </Step>
            <Step n={3} title="Edita el texto al gusto">
              <p>Modifica el borrador con el tono y los detalles específicos del caso. Puedes escribir tu respuesta completamente desde cero si lo prefieres.</p>
            </Step>
            <Step n={4} title='Haz clic en "Enviar respuesta oficial"'>
              <p>La respuesta quedará vinculada al expediente y será visible para el reportante de inmediato. El estado avanzará automáticamente a <strong>En proceso</strong>.</p>
            </Step>
          </div>
          <Callout type="warning">
            La respuesta es visible para el reportante. Evita incluir nombres de terceros, datos sensibles o información que pueda comprometer la investigación. Usa un lenguaje formal, empático y claro.
          </Callout>
          <Callout type="tip">
            Aunque el reporte sea anónimo, siempre responde con el mismo nivel de seriedad. El reportante puede ser un alumno en una situación difícil.
          </Callout>
        </div>
      ),
    },

    /* ─── 6. Seguimiento en tiempo real ─── */
    {
      id: "realtime",
      icon: <RefreshCw className="w-4 h-4" />,
      title: "Seguimiento en tiempo real",
      subtitle: "Cómo ve el reportante el progreso de su caso",
      content: (
        <div className="space-y-5 pt-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            El reportante puede consultar el estado de su caso en cualquier momento usando su <strong>número de folio</strong>. No necesita crear una cuenta.
          </p>
          <div className="space-y-4">
            <Step n={1} title="El reportante guarda su folio">
              <p>Al enviar el reporte, la plataforma genera un folio único (ej. <span className="font-mono bg-gray-100 px-1.5 py-0.5 text-xs">VE-2026-A1B2C3</span>). El reportante debe guardarlo para dar seguimiento.</p>
            </Step>
            <Step n={2} title='El reportante entra a "Consultar folio"'>
              <p>Desde la página principal puede ingresar su folio y ver la línea de tiempo completa del caso.</p>
            </Step>
            <Step n={3} title="La página se actualiza automáticamente">
              <p>Cuando tú avanzas un estado o envías una respuesta, la página del reportante se actualiza en tiempo real — sin necesidad de recargar.</p>
            </Step>
          </div>
          <Callout type="info">
            El folio es el único identificador del reporte. Si un reportante dice que perdió su folio, no existe manera de recuperarlo — es parte del diseño de privacidad de la plataforma.
          </Callout>
        </div>
      ),
    },

    /* ─── 7. Analíticas ─── */
    {
      id: "analiticas",
      icon: <BarChart3 className="w-4 h-4" />,
      title: "Analíticas",
      subtitle: "Cómo interpretar las estadísticas del buzón",
      content: (
        <div className="space-y-5 pt-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            La sección de Analíticas ofrece una visión global del estado del buzón escolar.
          </p>
          <div className="space-y-4">
            <Step n={1} title="Tarjetas de resumen">
              <p>Las tarjetas superiores muestran: total de reportes, sin atender, en proceso, críticos, resueltos, tiempo promedio de resolución y reportes con más de 7 días sin atención.</p>
            </Step>
            <Step n={2} title="Gráfica de categorías">
              <p>Muestra la distribución de reportes por tipo. Si acoso escolar domina, es una señal de que se requiere una intervención más amplia.</p>
            </Step>
            <Step n={3} title="Gráfica de urgencia">
              <p>Muestra la proporción crítico / alto / medio / bajo. Un alto porcentaje de críticos indica que el sistema está siendo usado para situaciones reales urgentes.</p>
            </Step>
            <Step n={4} title="Gráfica de los últimos 30 días">
              <p>Muestra la tendencia diaria. Los picos pueden coincidir con eventos escolares, cambios de ciclo o situaciones específicas.</p>
            </Step>
            <Step n={5} title="Resumen mensual con IA">
              <p>La IA genera un párrafo narrativo que resume los patrones del mes. Úsalo para redactar informes a las autoridades escolares o para el consejo técnico.</p>
            </Step>
          </div>
          <Callout type="tip">
            Revisa las analíticas al inicio de cada mes para identificar tendencias antes de que escalen. Una categoría en crecimiento sostenido requiere atención preventiva.
          </Callout>
        </div>
      ),
    },

    /* ─── 8. Configuración ─── */
    {
      id: "configuracion",
      icon: <Settings className="w-4 h-4" />,
      title: "Configuración",
      subtitle: "Personalizar la apariencia del buzón",
      content: (
        <div className="space-y-5 pt-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            Desde Configuración puedes ajustar los datos de la institución que aparecen en el buzón público.
          </p>
          <div className="space-y-4">
            <Step n={1} title="Nombre de la institución">
              <p>El nombre que aparece en el encabezado y footer de todas las páginas del buzón.</p>
            </Step>
            <Step n={2} title="URL del logotipo">
              <p>Puedes ingresar la URL de una imagen para reemplazar el logo actual. Usa una imagen cuadrada en formato SVG o PNG de al menos 64×64 px.</p>
            </Step>
            <Step n={3} title='Guardar cambios'>
              <p>Haz clic en <strong>&ldquo;Guardar cambios&rdquo;</strong>. Los cambios se sincronizan en la nube y son visibles en todos los dispositivos de inmediato.</p>
            </Step>
          </div>
          <Callout type="info">
            Los cambios de configuración se guardan en la base de datos del sistema. Son globales y permanentes — cualquier dispositivo que abra el panel reflejará los cambios.
          </Callout>
        </div>
      ),
    },

    /* ─── 9. Seguridad ─── */
    {
      id: "seguridad",
      icon: <Shield className="w-4 h-4" />,
      title: "Seguridad y privacidad",
      subtitle: "Qué protege el sistema y tus responsabilidades",
      content: (
        <div className="space-y-5 pt-2">
          <div className="space-y-3">
            {[
              {
                icon: <Eye className="w-4 h-4 text-crimson-600 shrink-0 mt-0.5" />,
                title: "Reportes anónimos",
                desc: "El sistema no registra la dirección IP ni el nombre del reportante si eligió anonimato. Nunca podrás saber quién envió un reporte anónimo.",
              },
              {
                icon: <Shield className="w-4 h-4 text-crimson-600 shrink-0 mt-0.5" />,
                title: "Acceso al panel",
                desc: "El panel de administración está protegido por contraseña y por una cookie segura de servidor. No compartas la contraseña con personas no autorizadas.",
              },
              {
                icon: <Clock className="w-4 h-4 text-crimson-600 shrink-0 mt-0.5" />,
                title: "Sesión automática",
                desc: "La sesión expira al cerrar el navegador. Si usas una computadora compartida, siempre usa \"Cerrar sesión\" antes de salir.",
              },
              {
                icon: <Send className="w-4 h-4 text-crimson-600 shrink-0 mt-0.5" />,
                title: "Confidencialidad de reportes",
                desc: "Los reportes son confidenciales. No compartas el contenido con personas ajenas al proceso de atención. Las evidencias adjuntas solo son accesibles desde el panel.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3 border border-gray-100 p-4">
                {icon}
                <div>
                  <p className="text-sm font-semibold text-gray-800">{title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Callout type="warning">
            Si sospechas que la contraseña del panel ha sido comprometida, solicita al administrador técnico que la cambie de inmediato en la configuración del servidor.
          </Callout>
        </div>
      ),
    },

    /* ─── 10. FAQ ─── */
    {
      id: "faq",
      icon: <BookOpen className="w-4 h-4" />,
      title: "Preguntas frecuentes",
      subtitle: "Respuestas a las dudas más comunes",
      content: (
        <div className="space-y-4 pt-2">
          {[
            {
              q: "¿Qué hago si un reporte es falso o malicioso?",
              a: "Márcalo como Resuelta con una respuesta que indique que fue revisado y no se encontró fundamento. No elimines el reporte — queda como registro.",
            },
            {
              q: "¿Puedo ver reportes de otros años?",
              a: "Sí. Todos los reportes se almacenan permanentemente en la base de datos. No hay fecha de expiración.",
            },
            {
              q: "¿Qué pasa si el reportante perdió su folio?",
              a: "No es posible recuperarlo. El sistema fue diseñado así para proteger la privacidad. El reportante deberá enviar un nuevo reporte si lo considera necesario.",
            },
            {
              q: "¿Puedo responder un reporte más de una vez?",
              a: "Sí. Puedes editar y reenviar la respuesta oficial todas las veces que necesites desde el panel de IA en el expediente.",
            },
            {
              q: "¿Los reportes se eliminan automáticamente?",
              a: "No. Los reportes son permanentes a menos que el administrador técnico los elimine directamente desde la base de datos.",
            },
            {
              q: "¿Puedo usar el panel desde mi celular?",
              a: "Sí, el panel es responsivo. Sin embargo, para una experiencia óptima se recomienda usar una computadora o tablet.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border border-gray-100 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-1.5">{q}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="px-4 py-6 sm:p-6 max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <span className="block w-8 h-0.5 bg-crimson-600 mb-4" />
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Guía de uso</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
            Todo lo que necesitas saber para gestionar el Buzón Escolar VozEscolar del CETIS 52. Lee cada sección haciendo clic para expandirla.
          </p>
        </div>

        {/* Quick index */}
        <div className="border border-crimson-100 bg-crimson-50 p-5 mb-8">
          <p className="text-xs font-bold text-crimson-700 uppercase tracking-wide mb-3">Contenido de esta guía</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => openAndScroll(s.id)}
                className="flex items-center gap-2 text-xs text-crimson-700 hover:text-crimson-900 font-medium transition-colors text-left"
              >
                <span className="w-4 h-4 bg-crimson-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} id={section.id}>
              <AccordionSection
                section={section}
                open={openSections.has(section.id)}
                onToggle={() => toggle(section.id)}
              />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 border-t border-gray-100 pt-6 flex items-start gap-3">
          <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Esta guía corresponde a la versión actual de VozEscolar para CETIS 52 Hermenegildo Galeana.
            Para soporte técnico o cambios en la configuración del sistema, contacta al administrador técnico.
          </p>
        </div>

      </div>
    </AdminLayout>
  );
}
