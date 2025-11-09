import { useCallback, useEffect, useRef, useState } from "react";

type AlarmState = {
	context: AudioContext | null;
	oscillator: OscillatorNode | null;
	gainNode: GainNode | null;
	patternIntervalId: number | null;
};

type ExtendedWindow = Window & typeof globalThis & {
	webkitAudioContext?: typeof AudioContext;
};

const getAudioContextConstructor = (): typeof AudioContext | null => {
	if (typeof window === "undefined") {
		return null;
	}
	const { AudioContext: StandardAudioContext, webkitAudioContext } = window as ExtendedWindow;
	return StandardAudioContext ?? webkitAudioContext ?? null;
};

export function useAlarm() {
	const stateRef = useRef<AlarmState>({
		context: null,
		oscillator: null,
		gainNode: null,
		patternIntervalId: null,
	});

	const [isPlaying, setIsPlaying] = useState(false);

	const ensureContext = useCallback(async () => {
		let { context } = stateRef.current;
		if (!context) {
			const AudioContextConstructor = getAudioContextConstructor();
			if (!AudioContextConstructor) {
				throw new Error("Web Audio API is not supported in this browser");
			}
			context = new AudioContextConstructor();
			stateRef.current.context = context;
		}
		if (context.state === "suspended") {
			await context.resume();
		}
		return context;
	}, []);

	const stopAlarm = useCallback(() => {
		const s = stateRef.current;
		if (s.patternIntervalId) {
			window.clearInterval(s.patternIntervalId);
			s.patternIntervalId = null;
		}
		if (s.gainNode) {
			try {
				// Smooth fade out
				s.gainNode.gain.cancelScheduledValues(0);
				s.gainNode.gain.linearRampToValueAtTime(0, (s.context?.currentTime || 0) + 0.1);
			} catch (error) {
				console.warn("Failed to fade out alarm gain node", error);
			}
		}
		if (s.oscillator) {
			try {
				s.oscillator.stop();
			} catch (error) {
				console.warn("Failed to stop oscillator", error);
			}
			s.oscillator.disconnect();
			s.oscillator = null;
		}
		if (s.gainNode) {
			s.gainNode.disconnect();
			s.gainNode = null;
		}
		setIsPlaying(false);
	}, []);

	const startAlarm = useCallback(async () => {
		if (isPlaying) return;
		const context = await ensureContext();
		const oscillator = context.createOscillator();
		const gainNode = context.createGain();

		// Alarm-like tone
		oscillator.type = "sawtooth";
		oscillator.frequency.setValueAtTime(880, context.currentTime); // A5

		// Start muted, we will ramp up in pattern
		gainNode.gain.setValueAtTime(0, context.currentTime);

		oscillator.connect(gainNode);
		gainNode.connect(context.destination);
		oscillator.start();

		stateRef.current.oscillator = oscillator;
		stateRef.current.gainNode = gainNode;

		// Pattern: beep 1s, pause 0.6s, loop
		const runPattern = () => {
			const now = context.currentTime;
			try {
				gainNode.gain.cancelScheduledValues(0);
				gainNode.gain.setValueAtTime(0, now);
				gainNode.gain.linearRampToValueAtTime(0.9, now + 0.05);
				gainNode.gain.setValueAtTime(0.9, now + 1.0);
				gainNode.gain.linearRampToValueAtTime(0, now + 1.1);
			} catch (error) {
				console.warn("Failed to schedule alarm pattern", error);
			}
		};

		runPattern();
		const id = window.setInterval(runPattern, 1700);
		stateRef.current.patternIntervalId = id;
		setIsPlaying(true);
	}, [ensureContext, isPlaying]);

	useEffect(() => {
		const state = stateRef.current;
		return () => {
			stopAlarm();
			const { context } = state;
			if (context && context.state !== "closed") {
				context
					.close()
					.catch((error) => {
						console.warn("Failed to close audio context", error);
					});
			}
			if (state.context) {
				state.context = null;
			}
		};
	}, [stopAlarm]);

	return { startAlarm, stopAlarm, isPlaying };
}


