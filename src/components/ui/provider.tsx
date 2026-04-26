/** @format */

"use client";

import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

const config = defineConfig({
    globalCss: {
        "html, body": {
            bg: {
                base: "#f4efe5",
                _dark: "#181818",
            },
            color: {
                base: "#2b2218",
                _dark: "#e0e0e0",
            },
        },
    },
    theme: {
        semanticTokens: {
            colors: {
                bg: {
                    DEFAULT: {
                        value: {
                            _light: "#fffaf0",
                            _dark: "#181818",
                        },
                    },
                    subtle: {
                        value: {
                            _light: "#f3eadb",
                            _dark: "#232323",
                        },
                    },
                    muted: {
                        value: {
                            _light: "#e7d9c0",
                            _dark: "#2d2d2d",
                        },
                    },
                    panel: {
                        value: {
                            _light: "#ffffff",
                            _dark: "#1f1f1f",
                        },
                    },
                },
                fg: {
                    DEFAULT: {
                        value: {
                            _light: "#2b2218",
                            _dark: "#f5f5f5",
                        },
                    },
                    muted: {
                        value: {
                            _light: "#6f5b45",
                            _dark: "#a3a3a3",
                        },
                    },
                    subtle: {
                        value: {
                            _light: "#8d7459",
                            _dark: "#8a8a8a",
                        },
                    },
                },
                border: {
                    DEFAULT: {
                        value: {
                            _light: "#d8c6a8",
                            _dark: "#353535",
                        },
                    },
                    emphasized: {
                        value: {
                            _light: "#c2aa82",
                            _dark: "#4a4a4a",
                        },
                    },
                },
            },
        },
    },
});

const system = createSystem(defaultConfig, config);

export function Provider(props: ColorModeProviderProps) {
    return (
        <ChakraProvider value={system}>
            <ColorModeProvider {...props} />
        </ChakraProvider>
    );
}
