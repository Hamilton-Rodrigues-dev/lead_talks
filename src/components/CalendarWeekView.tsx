import { CalendarEvent } from "@/lib/mockData";
import { format, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, FileText, Users } from "lucide-react";

interface CalendarWeekViewProps {
  weekStart: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date, time: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

/** 06:00 até 21:30 (intervalo de 30min) */
const timeSlots = Array.from({ length: 32 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

const eventIcons = {
  tarefa: CheckCircle2,
  nota: FileText,
  reuniao: Users,
};

const eventColors = {
  tarefa: "bg-emerald-500 hover:bg-emerald-600",
  nota: "bg-amber-500 hover:bg-amber-600",
  reuniao: "bg-blue-500 hover:bg-blue-600",
};

/** abreviações PT-BR curtas sem ponto */
const shortWeekday = (d: Date) => {
  const map = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  return map[d.getDay()];
};

const TIME_COL_PX = 44; // coluna de horários: mínima possível
const DAY_MIN_PX = 120; // largura mínima de cada dia em telas estreitas
const ROW_MIN_H = 48; // altura da célula (múltiplo de 4pt)

export default function CalendarWeekView({
  weekStart,
  events,
  onTimeSlotClick,
  onEventClick,
}: CalendarWeekViewProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hoje = new Date();

  const getEventsForSlot = (date: Date, time: string) =>
    events.filter((event) => {
      if (!isSameDay(new Date(event.data), date)) return false;
      if (!event.horaInicio) return false;
      return event.horaInicio.substring(0, 5) === time;
    });

  /** largura mínima total para nunca “sumir” o 7º dia */
  const gridMinWidth = TIME_COL_PX + 7 * DAY_MIN_PX; // px

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
  {/* Wrapper geral com grid único */}
  <div
    className="overflow-x-auto"
    style={{
      minWidth: gridMinWidth,
    }}
  >
    <div
      className="grid"
      style={{
        gridTemplateColumns: `minmax(${TIME_COL_PX}px, ${TIME_COL_PX}px) repeat(7, minmax(${DAY_MIN_PX}px, 1fr))`,
        gridTemplateRows: `auto repeat(${timeSlots.length}, minmax(${ROW_MIN_H}px, auto))`,
      }}
    >
      {/* Cabeçalho */}
      <div className="border-b border-border bg-muted/30" />
      {days.map((day, i) => {
        const isToday = isSameDay(day, hoje);
        return (
          <div
            key={`head-${i}`}
            className={`flex flex-col items-center justify-center p-2 text-center border-l border-border ${
              isToday ? "bg-primary/10" : ""
            }`}
          >
            <div className="text-xs leading-none text-muted-foreground font-medium">
              {shortWeekday(day)}
            </div>
            <div
              className={`text-base md:text-lg font-semibold leading-tight ${
                isToday ? "text-primary" : ""
              }`}
            >
              {format(day, "dd", { locale: ptBR })}
            </div>
          </div>
        );
      })}

      {/* Linhas de horários */}
     {timeSlots.map((time, rowIndex) => (
  <>
    {/* Coluna de horários */}
    <div
      key={`time-${rowIndex}`}
      className="flex items-center justify-center text-[10px] md:text-xs text-muted-foreground border-t border-r border-border select-none bg-background"
    >
      {time}
    </div>

    {/* Células de dias */}
    {days.map((day, i) => {
      const slotEvents = getEventsForSlot(day, time);
      const isToday = isSameDay(day, hoje);
      return (
        <div
          key={`cell-${rowIndex}-${i}`}
          className={`relative border-t border-l border-border cursor-pointer hover:bg-muted/10 transition-colors`}
          onClick={() => onTimeSlotClick(day, time)}
        >
          {isToday && (
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          )}

          <div className="relative z-[1] p-1">
            {slotEvents.map((event) => {
              const Icon = eventIcons[event.tipo];
              return (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  className={`${eventColors[event.tipo]} text-white w-full max-w-full p-1.5 rounded-md text-[11px] leading-tight cursor-pointer transition-colors shadow-sm`}
                >
                  <div className="flex items-start gap-1">
                    <Icon className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {event.titulo}
                      </div>
                      {event.nomeLead && (
                        <div className="text-[10px] opacity-90 truncate">
                          {event.nomeLead}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    })}
  </>
))}

    </div>
  </div>
</div>

  );
}
