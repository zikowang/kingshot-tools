/** @format */

type FormValues = Record<string, string | string[]>;

/**
 * Initial form values: URL params win; with no params, fall back to the saved preset.
 * Pure: pass `search` (e.g. `window.location.search`) so it is testable.
 */
export function getInitialFormValues<T extends FormValues>(
    defaults: T,
    search: string,
    getPreset: () => T | null
): { values: T; presetLoaded: boolean } {
    const params = new URLSearchParams(search);

    if (params.size === 0) {
        const preset = getPreset();

        return preset
            ? { values: { ...defaults, ...preset }, presetLoaded: true }
            : { values: { ...defaults }, presetLoaded: false };
    }

    const values: FormValues = { ...defaults };

    for (const key of Object.keys(defaults)) {
        const value = params.get(key);

        if (value === null) continue;

        values[key] = Array.isArray(defaults[key]) ? value.split(",") : value;
    }

    return { values: values as T, presetLoaded: false };
}

/** Serialize form values to URL params, skipping empty and "0" values. */
export function toSearchParams(values: FormValues) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(values)) {
        if (Array.isArray(value)) {
            if (value.length > 0) params.set(key, value.join(","));
        } else if (value !== "0" && value !== "" && value !== undefined) {
            params.set(key, value);
        }
    }

    return params;
}
