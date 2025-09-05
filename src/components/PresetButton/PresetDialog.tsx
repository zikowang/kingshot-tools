/** @format */

import { toaster } from "@/components//ui/toaster";
import type { TroopsFormValues, TruegoldFormValues } from "@/types/forms";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import type { Dispatch } from "react";

const PresetDialog = ({
    open,
    setOpen,
    type,
    formValues,
    setFormValues,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    type: "troop" | "truegold";
    formValues: TroopsFormValues | TruegoldFormValues;
    setFormValues:
        | Dispatch<React.SetStateAction<TroopsFormValues>>
        | Dispatch<React.SetStateAction<TruegoldFormValues>>;
}) => {
    const hasPresets = !!localStorage.getItem(`presets.${type}`);

    const handleSave = () => {
        let presets = JSON.parse(localStorage.getItem(`presets.${type}`) || "{}");
        presets = formValues;
        localStorage.setItem(`presets.${type}`, JSON.stringify(presets));

        toaster.create({
            description: "Preset saved",
            type: "success",
        });

        setOpen(false);
    };

    const handleLoad = () => {
        const presets = JSON.parse(localStorage.getItem(`presets.${type}`) || "{}");
        if (presets) {
            setFormValues(presets);

            toaster.create({
                description: "Preset Loaded",
                type: "success",
            });

            setOpen(false);
        }
    };

    return (
        <Dialog.Root size="sm" open={open} onOpenChange={(details) => setOpen(details.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>My {type} preset</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>
                                A preset is saved locally in your browser. It will not be available
                                if you switch browsers or devices.
                            </p>
                        </Dialog.Body>
                        <Dialog.Footer justifyContent="space-between">
                            <Button
                                variant="ghost"
                                colorPalette="orange"
                                onClick={handleLoad}
                                disabled={!hasPresets}
                            >
                                Load
                            </Button>

                            <Button colorPalette="green" onClick={handleSave}>
                                Save
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default PresetDialog;
