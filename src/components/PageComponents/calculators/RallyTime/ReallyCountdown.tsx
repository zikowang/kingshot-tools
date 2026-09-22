/** @format */

import { useEffect, useMemo, useState } from "react";
import { getUTC } from "../../Calendar/CalendarPage";

const ReallyCountdown = ({ targetTime }: { targetTime: Date }) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = getUTC(new Date()).getTime();
            const distance = (targetTime.getTime() - now) / 1000; // in seconds

            setTimeLeft(distance);
        }, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    const color = useMemo(() => {
        if (timeLeft === null) return "grey";
        if (timeLeft > 60) return "green";
        if (timeLeft > 30) return "orange";
        if (timeLeft > 0) return "red";

        return "grey";
    }, [timeLeft]);

    const formattedTimeLeft = useMemo(() => {
        if (timeLeft === null) return "";

        const remainingSeconds = Math.round(Math.abs(timeLeft));
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        const prefix = timeLeft < 0 && remainingSeconds > 0 ? "-" : "";

        return `${prefix}${minutes}:${String(seconds).padStart(2, "0")}`;
    }, [timeLeft]);

    return <strong style={{ color }}>{formattedTimeLeft}</strong>;
};

export default ReallyCountdown;
