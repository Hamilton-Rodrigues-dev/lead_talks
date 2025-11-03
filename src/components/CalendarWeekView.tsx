import { CalendarEvent } from "@/lib/mockData";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, FileText, Users } from "lucide-react";

interface CalendarWeekViewProps {
  weekStart: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date, time: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

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

export default function CalendarWeekView({ weekStart, events, onTimeSlotClick, onEventClick }: CalendarWeekViewProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hoje = new Date();

  const getEventsForSlot = (date: Date, time: string) => {
    return events.filter(event => {
      if (!isSameDay(new Date(event.data), date)) return false;
      if (!event.horaInicio) return false;
      
      const eventHour = event.horaInicio.substring(0, 5);
      return eventHour === time;
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border bg-muted/30">
        <div className="p-4"></div>
        {days.map((day, i) => {
          const isToday = isSameDay(day, hoje);
          return (
            <div
              key={i}
              className={`p-4 text-center border-l border-border ${
                isToday ? "bg-primary/10" : ""
              }`}
            >
              <div className="text-sm text-muted-foreground">
                {format(day, "EEE", { locale: ptBR })}
              </div>
              <div
                className={`text-2xl font-semibold mt-1 ${
                  isToday ? "text-primary" : ""
                }`}
              >
                {format(day, "dd", { locale: ptBR })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="overflow-y-auto max-h-[600px]">
        {timeSlots.map((time) => (
          <div
            key={time}
            className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border hover:bg-muted/20 transition-colors"
          >
            <div className="p-2 text-xs text-muted-foreground text-right border-r border-border">
              {time}
            </div>
            {days.map((day, i) => {
              const slotEvents = getEventsForSlot(day, time);
              const isToday = isSameDay(day, hoje);

              return (
                <div
                  key={i}
                  className={`min-h-[60px] p-1 border-l border-border cursor-pointer relative ${
                    isToday ? "bg-primary/5" : ""
                  }`}
                  onClick={() => onTimeSlotClick(day, time)}
                >
                  {slotEvents.map((event) => {
                    const Icon = eventIcons[event.tipo];
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={`${eventColors[event.tipo]} text-white p-2 rounded text-xs mb-1 cursor-pointer transition-colors`}
                      >
                        <div className="flex items-start gap-1">
                          <Icon className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{event.titulo}</div>
                            {event.nomeLead && (
                              <div className="text-xs opacity-90 truncate">{event.nomeLead}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
