/** @format */

// @ts-check

import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [],
    },

    integrations: [react()],

    server: {
        open: true,
        allowedHosts: ["localhost", "kingshot-tools-production.up.railway.app", "zikoscheng.de"],
    },
});
