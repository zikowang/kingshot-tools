/** @format */

import { formatCountdown } from "./rallyTime";

function getColor(secondsLeft: number) {
    if (secondsLeft > 60) return "green";
    if (secondsLeft > 30) return "orange";
    if (secondsLeft > 0) return "red";

    return "grey";
}

/** `now` comes from the parent so all rows share one timer. */
const RallyCountdown = ({ targetTime, now }: { targetTime: Date; now: number }) => {
    const secondsLeft = (targetTime.getTime() - now) / 1000;

    return <strong style={{ color: getColor(secondsLeft) }}>{formatCountdown(secondsLeft)}</strong>;
};

export default RallyCountdown;
