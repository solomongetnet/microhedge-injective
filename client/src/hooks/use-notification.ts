import { useEffect, useRef } from "react";

export const useNotificationSound = (soundSrc: string = "/sound-2.mp3") => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(soundSrc);
    audioRef.current.preload = "auto";
  }, [soundSrc]);

  const playNotification = () => {
    // Read the saved settings from localStorage
    const settingsStr = localStorage.getItem("notificationSettings");
    const settings = settingsStr ? JSON.parse(settingsStr) : { sound: true };

    if (settings.sound && audioRef.current) {
      audioRef.current.currentTime = 0; // rewind
      audioRef.current.play().catch((err) => {
        console.error("Failed to play notification sound:", err);
      });
    }
  };

  return { playNotification };
};
