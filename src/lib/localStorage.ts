/** @format */

import type { TroopsFormValues, TruegoldFormValues } from "@/types/forms";

/** Read and parse JSON from localStorage. Returns null on missing or broken data. */
export function readJson<T>(key: string): T | null {
    try {
        const storageData = localStorage.getItem(key);

        return storageData ? (JSON.parse(storageData) as T) : null;
    } catch (e) {
        console.error(`Failed to read "${key}" from localStorage:`, e);
        return null;
    }
}

export function writeJson(key: string, value: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Failed to write "${key}" to localStorage:`, e);
    }
}

export function getTroopsPreset(): TroopsFormValues | null {
    return readJson<TroopsFormValues>(`presets.troop`);
}

export function getTruegoldPreset(): TruegoldFormValues | null {
    return readJson<TruegoldFormValues>(`presets.truegold`);
}
