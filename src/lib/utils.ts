/** @format */

function unitFormatter(unit: "day" | "hour" | "minute" | "second") {
    return new Intl.NumberFormat(undefined, {
        style: "unit",
        unit,
        unitDisplay: "narrow",
        minimumFractionDigits: 0,
    });
}

const dayFormat = unitFormatter("day");
const hourFormat = unitFormatter("hour");
const minuteFormat = unitFormatter("minute");
const secondFormat = unitFormatter("second");

export function getResultTimeText(seconds: number) {
    const days = dayFormat.format(Math.floor(seconds / 86400));
    const hrs = hourFormat.format(Math.floor((seconds % 86400) / 3600));
    const mins = minuteFormat.format(Math.floor((seconds % 3600) / 60));
    const secs = secondFormat.format(seconds % 60);

    return `${days} ${hrs} ${mins} ${secs}`;
}

export function getResultMinutesText(seconds: number) {
    return minuteFormat.format(Math.floor(seconds / 60));
}
