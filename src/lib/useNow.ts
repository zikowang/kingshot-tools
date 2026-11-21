/** @format */

import { useEffect, useState } from "react";

/** Current timestamp (ms), refreshed every `intervalMs`. One timer per caller. */
export function useNow(intervalMs = 1000) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), intervalMs);

        return () => clearInterval(interval);
    }, [intervalMs]);

    return now;
}
