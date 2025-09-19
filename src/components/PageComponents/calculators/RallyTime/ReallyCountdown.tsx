/** @format */

import { useEffect, useMemo, useState } from "react";
import { getUTC } from "../../Calendar/CalendarPage";

const ReallyCountdown = ({ targetTime }: { targetTime: Date }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = getUTC(new Date()).getTime();
            const distance = (targetTime.getTime() - now) / 1000; // in seconds

            setTimeLeft(distance > 0 ? distance : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    const color = useMemo(() => {
        if (timeLeft > 60) return "green";
        if (timeLeft > 30) return "orange";
        if (timeLeft > 0) return "red";
        return "grey";
    }, [timeLeft]);

    return <strong style={{ color }}>{timeLeft.toFixed(0)} s</strong>;
};

export default ReallyCountdown;
