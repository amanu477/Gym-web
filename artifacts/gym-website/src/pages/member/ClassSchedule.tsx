import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Button } from "@/components/ui/LuxuryComponents";
import { CheckCircle2, Clock, Users, Dumbbell, Zap, Heart, Activity, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type ClassType = "hiit" | "yoga" | "strength" | "cardio" | "cycling" | "boxing" | "pilates" | "crossfit";

interface GymClass {
  id: string;
  name: string;
  type: ClassType;
  time: string;
  duration: number;
  trainer: string;
  capacity: number;
  booked: number;
  day: number;
  slot: number;
}

const CLASS_COLORS: Record<ClassType, string> = {
  hiit: "bg-orange-500/20 border-orange-500/40 text-orange-400",
  yoga: "bg-purple-500/20 border-purple-500/40 text-purple-400",
  strength: "bg-primary/20 border-primary/40 text-primary",
  cardio: "bg-red-500/20 border-red-500/40 text-red-400",
  cycling: "bg-cyan-500/20 border-cyan-500/40 text-cyan-400",
  boxing: "bg-yellow-500/20 border-yellow-500/40 text-yellow-400",
  pilates: "bg-pink-500/20 border-pink-500/40 text-pink-400",
  crossfit: "bg-green-500/20 border-green-500/40 text-green-400",
};

const CLASS_ICONS: Record<ClassType, typeof Zap> = {
  hiit: Zap,
  yoga: Heart,
  strength: Dumbbell,
  cardio: Activity,
  cycling: Activity,
  boxing: Zap,
  pilates: Heart,
  crossfit: Star,
};

const SCHEDULE: GymClass[] = [
  // Monday
  { id: "m1", name: "Morning HIIT", type: "hiit", time: "6:00 AM", duration: 45, trainer: "Marcus Reid", capacity: 15, booked: 12, day: 0, slot: 0 },
  { id: "m2", name: "Power Yoga", type: "yoga", time: "9:00 AM", duration: 60, trainer: "Sophia Chen", capacity: 20, booked: 14, day: 0, slot: 1 },
  { id: "m3", name: "Strength & Conditioning", type: "strength", time: "12:00 PM", duration: 60, trainer: "Marcus Reid", capacity: 12, booked: 10, day: 0, slot: 2 },
  { id: "m4", name: "Cycling Blast", type: "cycling", time: "6:00 PM", duration: 45, trainer: "Diego Vega", capacity: 18, booked: 18, day: 0, slot: 3 },
  { id: "m5", name: "Boxing Basics", type: "boxing", time: "7:30 PM", duration: 60, trainer: "Marcus Reid", capacity: 10, booked: 7, day: 0, slot: 4 },
  // Tuesday
  { id: "t1", name: "Cardio Kickstart", type: "cardio", time: "6:00 AM", duration: 45, trainer: "Elena Brooks", capacity: 16, booked: 9, day: 1, slot: 0 },
  { id: "t2", name: "CrossFit WOD", type: "crossfit", time: "9:00 AM", duration: 60, trainer: "Diego Vega", capacity: 12, booked: 11, day: 1, slot: 1 },
  { id: "t3", name: "Pilates Core", type: "pilates", time: "12:00 PM", duration: 45, trainer: "Sophia Chen", capacity: 15, booked: 8, day: 1, slot: 2 },
  { id: "t4", name: "Evening HIIT", type: "hiit", time: "6:00 PM", duration: 45, trainer: "Marcus Reid", capacity: 15, booked: 14, day: 1, slot: 3 },
  // Wednesday
  { id: "w1", name: "Power Yoga", type: "yoga", time: "6:00 AM", duration: 60, trainer: "Sophia Chen", capacity: 20, booked: 16, day: 2, slot: 0 },
  { id: "w2", name: "Strength Training", type: "strength", time: "9:00 AM", duration: 60, trainer: "Marcus Reid", capacity: 12, booked: 12, day: 2, slot: 1 },
  { id: "w3", name: "HIIT Circuits", type: "hiit", time: "12:00 PM", duration: 45, trainer: "Elena Brooks", capacity: 15, booked: 6, day: 2, slot: 2 },
  { id: "w4", name: "Cycling Pro", type: "cycling", time: "6:00 PM", duration: 45, trainer: "Diego Vega", capacity: 18, booked: 13, day: 2, slot: 3 },
  { id: "w5", name: "Boxing Advanced", type: "boxing", time: "7:30 PM", duration: 60, trainer: "Marcus Reid", capacity: 10, booked: 9, day: 2, slot: 4 },
  // Thursday
  { id: "th1", name: "CrossFit WOD", type: "crossfit", time: "6:00 AM", duration: 60, trainer: "Diego Vega", capacity: 12, booked: 10, day: 3, slot: 0 },
  { id: "th2", name: "Cardio Dance", type: "cardio", time: "9:00 AM", duration: 45, trainer: "Elena Brooks", capacity: 20, booked: 17, day: 3, slot: 1 },
  { id: "th3", name: "Pilates Stretch", type: "pilates", time: "12:00 PM", duration: 45, trainer: "Sophia Chen", capacity: 15, booked: 11, day: 3, slot: 2 },
  { id: "th4", name: "Strength & Power", type: "strength", time: "6:00 PM", duration: 60, trainer: "Marcus Reid", capacity: 12, booked: 8, day: 3, slot: 3 },
  // Friday
  { id: "f1", name: "Morning HIIT", type: "hiit", time: "6:00 AM", duration: 45, trainer: "Elena Brooks", capacity: 15, booked: 13, day: 4, slot: 0 },
  { id: "f2", name: "Yoga Flow", type: "yoga", time: "9:00 AM", duration: 60, trainer: "Sophia Chen", capacity: 20, booked: 15, day: 4, slot: 1 },
  { id: "f3", name: "CrossFit Friday", type: "crossfit", time: "12:00 PM", duration: 60, trainer: "Diego Vega", capacity: 12, booked: 12, day: 4, slot: 2 },
  { id: "f4", name: "Boxing Cardio", type: "boxing", time: "6:00 PM", duration: 60, trainer: "Marcus Reid", capacity: 10, booked: 4, day: 4, slot: 3 },
  { id: "f5", name: "Cycling Enduro", type: "cycling", time: "7:30 PM", duration: 60, trainer: "Diego Vega", capacity: 18, booked: 16, day: 4, slot: 4 },
  // Saturday
  { id: "s1", name: "Weekend Warriors", type: "crossfit", time: "8:00 AM", duration: 90, trainer: "Marcus Reid", capacity: 20, booked: 19, day: 5, slot: 0 },
  { id: "s2", name: "Vinyasa Yoga", type: "yoga", time: "10:00 AM", duration: 75, trainer: "Sophia Chen", capacity: 20, booked: 12, day: 5, slot: 1 },
  { id: "s3", name: "HIIT & Burn", type: "hiit", time: "12:00 PM", duration: 45, trainer: "Elena Brooks", capacity: 15, booked: 11, day: 5, slot: 2 },
  { id: "s4", name: "Strength Basics", type: "strength", time: "2:00 PM", duration: 60, trainer: "Marcus Reid", capacity: 12, booked: 7, day: 5, slot: 3 },
  // Sunday
  { id: "su1", name: "Sunrise Yoga", type: "yoga", time: "8:00 AM", duration: 60, trainer: "Sophia Chen", capacity: 20, booked: 10, day: 6, slot: 0 },
  { id: "su2", name: "Active Recovery", type: "pilates", time: "10:00 AM", duration: 60, trainer: "Sophia Chen", capacity: 15, booked: 8, day: 6, slot: 1 },
  { id: "su3", name: "Sunday Cycling", type: "cycling", time: "12:00 PM", duration: 45, trainer: "Diego Vega", capacity: 18, booked: 14, day: 6, slot: 2 },
];

export default function ClassSchedule() {
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
  });
  const [filter, setFilter] = useState<ClassType | "all">("all");

  const toggleBook = (classId: string, isFull: boolean) => {
    if (isFull && !bookedIds.has(classId)) return;
    setBookedIds((prev) => {
      const next = new Set(prev);
      if (next.has(classId)) next.delete(classId);
      else next.add(classId);
      return next;
    });
  };

  const classTypes: { type: ClassType | "all"; label: string }[] = [
    { type: "all", label: "All Classes" },
    { type: "hiit", label: "HIIT" },
    { type: "yoga", label: "Yoga" },
    { type: "strength", label: "Strength" },
    { type: "crossfit", label: "CrossFit" },
    { type: "cycling", label: "Cycling" },
    { type: "boxing", label: "Boxing" },
    { type: "pilates", label: "Pilates" },
  ];

  const dayClasses = SCHEDULE.filter(
    (c) => c.day === selectedDay && (filter === "all" || c.type === filter)
  ).sort((a, b) => a.slot - b.slot);

  const totalBooked = bookedIds.size;

  return (
    <DashboardLayout requiredRole="member">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-black uppercase">Class Schedule</h1>
          <p className="text-muted-foreground mt-1">Browse and book weekly fitness classes.</p>
        </div>
        {totalBooked > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">{totalBooked} class{totalBooked !== 1 ? "es" : ""} booked this week</span>
          </div>
        )}
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {DAYS.map((day, idx) => {
          const dayBookings = SCHEDULE.filter((c) => c.day === idx && bookedIds.has(c.id)).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(idx)}
              className={cn(
                "flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all font-display",
                selectedDay === idx
                  ? "bg-primary border-primary text-background font-black"
                  : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              <span className="text-xs uppercase tracking-wider">{SHORT_DAYS[idx]}</span>
              {dayBookings > 0 && (
                <span className={cn("mt-1 text-xs font-bold", selectedDay === idx ? "text-background" : "text-primary")}>
                  {dayBookings} booked
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Class Type Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 flex-wrap">
        {classTypes.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold border transition-all uppercase tracking-wider",
              filter === type
                ? "bg-primary/20 border-primary text-primary"
                : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      {dayClasses.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No classes match your filter on {DAYS[selectedDay]}.</p>
          <button onClick={() => setFilter("all")} className="mt-3 text-primary text-sm font-bold hover:underline">
            Clear filter
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {dayClasses.map((cls) => {
            const isBooked = bookedIds.has(cls.id);
            const isFull = cls.booked >= cls.capacity && !isBooked;
            const spotsLeft = cls.capacity - cls.booked + (isBooked ? 0 : 0);
            const Icon = CLASS_ICONS[cls.type];
            return (
              <div
                key={cls.id}
                className={cn(
                  "group relative rounded-xl border p-5 transition-all",
                  isBooked
                    ? "bg-primary/5 border-primary/40 shadow-[0_0_20px_rgba(var(--primary)/0.1)]"
                    : isFull
                    ? "bg-secondary/30 border-border opacity-60"
                    : "bg-card border-border hover:border-primary/30"
                )}
              >
                {isBooked && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                )}
                {isFull && !isBooked && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-bold text-destructive bg-destructive/10 border border-destructive/20 px-2 py-0.5 rounded-full uppercase">Full</span>
                  </div>
                )}

                {/* Class Type Badge */}
                <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border mb-3 uppercase tracking-wide", CLASS_COLORS[cls.type])}>
                  <Icon className="w-3 h-3" />
                  {cls.type}
                </div>

                <h3 className="text-lg font-display font-black uppercase text-foreground mb-1">{cls.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">with {cls.trainer}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {cls.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    {cls.duration} min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {isFull && !isBooked ? "Full" : `${cls.capacity - cls.booked + (isBooked ? 1 : 0)} left`}
                  </span>
                </div>

                {/* Capacity bar */}
                <div className="mb-4">
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", isFull ? "bg-destructive" : "bg-primary")}
                      style={{ width: `${Math.min(100, (cls.booked / cls.capacity) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{cls.booked}/{cls.capacity} spots filled</p>
                </div>

                <Button
                  size="sm"
                  variant={isBooked ? "outline" : isFull ? "outline" : "primary"}
                  className={cn("w-full", isFull && !isBooked && "cursor-not-allowed opacity-50")}
                  onClick={() => toggleBook(cls.id, isFull)}
                >
                  {isBooked ? "Cancel Booking" : isFull ? "Class Full" : "Book Class"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
