/** @format */

import type { TroopsFormValues, TruegoldFormValues } from "@/types/forms";

export function getTroopsPreset(): TroopsFormValues | null {
    const storageData = localStorage.getItem(`presets.troop`);
    const presets = storageData ? JSON.parse(storageData) : null;

    return presets;
}

export function getTruegoldPreset(): TruegoldFormValues | null {
    const storageData = localStorage.getItem(`presets.truegold`);
    const presets = storageData ? JSON.parse(storageData) : null;

    return presets;
}
