import Sidebar from "@/components/Sidebar";
import { Bell, Plus, Clock, Square, Trash2, AlarmClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAlarm } from "@/hooks/useAlarm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type Reminder = {
	id: string;
	title: string;
	time: string; // "HH:MM" 24h
	enabled: boolean;
	repeat: "none" | "daily" | "weekly";
	daysOfWeek?: number[]; // 0-6 Sun..Sat for weekly
	lastTriggeredKey?: string; // yyyy-mm-dd-HH:MM
	nextSnoozeAt?: number; // epoch ms
};

const STORAGE_KEY = "reminders_v1";
const repeatOptions: Reminder["repeat"][] = ["none", "daily", "weekly"];

const isRepeatOption = (value: string): value is Reminder["repeat"] =>
	repeatOptions.includes(value as Reminder["repeat"]);

const isReminderArray = (value: unknown): value is Reminder[] =>
	Array.isArray(value) &&
	value.every((item) => {
		if (typeof item !== "object" || item === null) return false;
		const candidate = item as Partial<Reminder>;
		return (
			typeof candidate.id === "string" &&
			typeof candidate.title === "string" &&
			typeof candidate.time === "string" &&
			typeof candidate.enabled === "boolean" &&
			typeof candidate.repeat === "string" &&
			isRepeatOption(candidate.repeat)
		);
	});

const Reminders = () => {
	const { startAlarm, stopAlarm, isPlaying } = useAlarm();

	const [reminders, setReminders] = useState<Reminder[]>([]);
	const [activeReminderId, setActiveReminderId] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [formTitle, setFormTitle] = useState("");
	const [formTime, setFormTime] = useState("");
	const [formEnabled, setFormEnabled] = useState(true);
	const [formRepeat, setFormRepeat] = useState<"none" | "daily" | "weekly">("daily");
	const [formWeekDays, setFormWeekDays] = useState<number[]>([]);

	const addReminder = (event?: FormEvent<HTMLFormElement>) => {
		event?.preventDefault();
		if (!formTitle.trim() || !formTime) return;
		const r: Reminder = {
			id: crypto.randomUUID(),
			title: formTitle.trim(),
			time: formTime,
			enabled: formEnabled,
			repeat: formRepeat,
			daysOfWeek: formRepeat === "weekly" ? [...formWeekDays].sort() : undefined,
		};
		setReminders((prev) => [...prev, r]);
		setFormTitle("");
		setFormTime("");
		setFormEnabled(true);
		setFormRepeat("daily");
		setFormWeekDays([]);
		setDialogOpen(false);
	};

	const handleRepeatChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const { value } = event.target;
		if (!isRepeatOption(value)) {
			return;
		}
		setFormRepeat(value);
		if (value !== "weekly") {
			setFormWeekDays([]);
		}
	};

	const removeReminder = (id: string) => {
		setReminders((prev) => prev.filter((r) => r.id !== id));
	};

	const toggleReminder = (id: string) => {
		setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
	};

	// Persistence: load on mount, save on change
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) {
				return;
			}
			const parsed = JSON.parse(raw) as unknown;
			if (isReminderArray(parsed)) {
				setReminders(parsed);
			}
		} catch (error) {
			console.warn("Failed to load reminders from localStorage", error);
		}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
		} catch (error) {
			console.warn("Failed to save reminders to localStorage", error);
		}
	}, [reminders]);

	const triggerReminder = useCallback(
		(rem: Reminder, currentKey: string) => {
			setActiveReminderId(rem.id);
			startAlarm();
			setReminders((prev) =>
				prev.map((r) => {
					if (r.id !== rem.id) return r;
					const nextEnabled = r.repeat === "none" ? false : r.enabled;
					return { ...r, lastTriggeredKey: currentKey, enabled: nextEnabled };
				}),
			);
		},
		[startAlarm],
	);

	// Scheduler: check every 5s; consider snooze, weekly days, and repeat modes
	useEffect(() => {
		const intervalId = window.setInterval(() => {
			if (reminders.length === 0) return;
			const now = new Date();
			const hh = String(now.getHours()).padStart(2, "0");
			const mm = String(now.getMinutes()).padStart(2, "0");
			const currentTime = `${hh}:${mm}`;
			const dateKey = new Date().toISOString().slice(0, 10);
			const currentKey = `${dateKey}-${currentTime}`;
			const dow = now.getDay(); // 0..6

			for (const r of reminders) {
				if (!r.enabled) continue;
				// Snooze has priority
				if (r.nextSnoozeAt && Date.now() >= r.nextSnoozeAt) {
					triggerReminder(r, currentKey);
					break;
				}
				if (r.time !== currentTime) continue;
				if (r.lastTriggeredKey === currentKey) continue;
				if (r.repeat === "weekly") {
					if (!r.daysOfWeek || !r.daysOfWeek.includes(dow)) continue;
				}
				// daily or none are allowed every day
				triggerReminder(r, currentKey);
				break;
			}
		}, 5000);
		return () => window.clearInterval(intervalId);
	}, [reminders, triggerReminder]);

	const stopActiveAlarm = () => {
		stopAlarm();
		setActiveReminderId(null);
	};

	const snoozeActive = (minutes: number) => {
		if (!activeReminderId) return;
		const snoozeUntil = Date.now() + minutes * 60 * 1000;
		setReminders((prev) => prev.map((r) => (r.id === activeReminderId ? { ...r, nextSnoozeAt: snoozeUntil } : r)));
		stopActiveAlarm();
	};
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 md:ml-64 pt-16 md:pt-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold">Reminders</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-2">Never miss your medication</p>
            </div>
					<div className="flex flex-wrap gap-2">
						{activeReminderId && (
							<div className="flex items-center gap-2 rounded-md border px-3 py-2">
								<AlarmClock className="h-4 w-4 text-primary" />
								<span className="text-sm">Alarm active</span>
								<Button size="sm" variant="secondary" onClick={() => snoozeActive(5)}>Snooze 5m</Button>
								<Button size="sm" variant="secondary" onClick={() => snoozeActive(10)}>10m</Button>
								<Button size="sm" variant="secondary" onClick={() => snoozeActive(15)}>15m</Button>
								<Button size="sm" variant="destructive" onClick={stopActiveAlarm}>Stop</Button>
							</div>
						)}
							<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
								<DialogTrigger asChild>
									<Button className="btn-primary flex items-center gap-2">
										<Plus className="h-4 w-4" />
										Add Reminder
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Add medication reminder</DialogTitle>
										<DialogDescription>Set a name and time (24-hour)</DialogDescription>
									</DialogHeader>
									<form onSubmit={addReminder} className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="title">Medicine name</Label>
											<Input id="title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g., Aspirin 100mg" />
										</div>
										<div className="space-y-2">
											<Label htmlFor="time">Time</Label>
											<Input id="time" type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} />
										</div>
										<div className="flex items-center justify-between">
											<div>
												<Label>Enabled</Label>
											</div>
											<Switch checked={formEnabled} onCheckedChange={setFormEnabled} />
										</div>
										<div className="space-y-2">
											<Label htmlFor="repeat">Repeat</Label>
						<select id="repeat" className="w-full h-10 border rounded-md px-3" value={formRepeat} onChange={handleRepeatChange}>
												<option value="none">None (one-time)</option>
												<option value="daily">Daily</option>
												<option value="weekly">Weekly</option>
											</select>
										</div>
										{formRepeat === "weekly" && (
											<div className="space-y-2">
												<Label>Days</Label>
												<div className="flex flex-wrap gap-2">
									{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, idx) => {
														const selected = formWeekDays.includes(idx);
														return (
															<button
												key={d}
																type="button"
																className={`px-3 py-1 rounded-md border text-sm ${selected ? "bg-primary text-primary-foreground" : "bg-background"}`}
																onClick={() => setFormWeekDays((prev) => selected ? prev.filter((v) => v !== idx) : [...prev, idx])}
															>
																{d}
															</button>
														);
													})}
												</div>
											</div>
										)}
										<div className="flex justify-end gap-2">
											<Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
											<Button type="submit" className="btn-primary">Save</Button>
										</div>
									</form>
								</DialogContent>
							</Dialog>
							<Button variant="secondary" className="flex items-center gap-2" onClick={startAlarm} disabled={isPlaying}>
								<Bell className="h-4 w-4" />
								Test Alarm
							</Button>
							<Button variant="destructive" className="flex items-center gap-2" onClick={stopAlarm} disabled={!isPlaying}>
								<Square className="h-4 w-4" />
								Stop
							</Button>
						</div>
          </div>

					<Card className="card-soft">
            <CardHeader>
							<CardTitle>Your Reminders</CardTitle>
							<CardDescription>Create and manage alerts</CardDescription>
            </CardHeader>
						<CardContent className="space-y-4">
							{reminders.length === 0 ? (
								<p className="text-sm text-muted-foreground">No reminders yet. Click "Add Reminder" to create one.</p>
							) : (
								reminders.map((r) => (
									<div key={r.id} className="flex items-center justify-between p-4 rounded-[13px] bg-muted/50">
										<div className="flex items-center gap-4">
											<div className="bg-muted rounded-full p-3">
												<Bell className="h-5 w-5 text-muted-foreground" />
											</div>
											<div>
												<h3 className="font-medium">{r.title}</h3>
												<p className="text-sm text-muted-foreground flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{r.time}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Switch checked={r.enabled} onCheckedChange={() => toggleReminder(r.id)} />
											<Button size="icon" variant="ghost" onClick={() => removeReminder(r.id)}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))
							)}
						</CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reminders;
