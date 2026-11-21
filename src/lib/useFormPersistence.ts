/** @format */

import { toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { toSearchParams } from "./formParams";

/** Show "Preset loaded" once, and mirror form values into the URL. */
export function useFormPersistence(
    formValues: Record<string, string | string[]>,
    presetLoaded: boolean
) {
    useEffect(() => {
        if (!presetLoaded) return;

        const timeout = setTimeout(() => toaster.success({ description: "Preset loaded" }), 300);

        return () => clearTimeout(timeout);
    }, [presetLoaded]);

    useEffect(() => {
        const params = toSearchParams(formValues);

        window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    }, [formValues]);
}
