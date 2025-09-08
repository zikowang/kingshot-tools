/** @format */

export function getResultTimeText(seconds: number) {
    const days = new Intl.NumberFormat(undefined, {
        style: "unit",
        unit: "day",
        unitDisplay: "narrow",
        minimumFractionDigits: 0,
    }).format(Math.floor(seconds / 86400));
    const hrs = new Intl.NumberFormat(undefined, {
        style: "unit",
        unit: "hour",
        unitDisplay: "narrow",
        minimumFractionDigits: 0,
    }).format(Math.floor((seconds % 86400) / 3600));
    const mins = new Intl.NumberFormat(undefined, {
        style: "unit",
        unit: "minute",
        unitDisplay: "narrow",
        minimumFractionDigits: 0,
    }).format(Math.floor((seconds % 3600) / 60));
    const secs = new Intl.NumberFormat(undefined, {
        style: "unit",
        unit: "second",
        unitDisplay: "narrow",
        minimumFractionDigits: 0,
    }).format(seconds % 60);

    return `${days} ${hrs} ${mins} ${secs}`;
}

export function getResultMinutesText(seconds: number) {
    const mins = new Intl.NumberFormat(undefined, {
        style: "unit",
        unit: "minute",
        unitDisplay: "narrow",
        minimumFractionDigits: 0,
    }).format(Math.floor(seconds / 60));

    return mins;
}
