/** @format */

import type { TroopsFormValues, TruegoldFormValues } from "@/types/forms";
import { Button } from "@chakra-ui/react";
import { useState, type Dispatch } from "react";
import PresetDialog from "./PresetDialog";

const PresetButton = ({
    formValues,
    type,
    setFormValues,
}: {
    formValues: TroopsFormValues | TruegoldFormValues;
    setFormValues:
        | Dispatch<React.SetStateAction<TroopsFormValues>>
        | Dispatch<React.SetStateAction<TruegoldFormValues>>;
    type: "troop" | "truegold";
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [isLoadOpen, setIsLoadOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleOpenSave = () => {
        setIsSaveOpen(true);
    };

    return (
        <>
            <Button
                type="button"
                onClick={handleOpenSave}
                variant="ghost"
                colorPalette="blue"
                size="md"
            >
                Preset
            </Button>

            <PresetDialog
                open={isSaveOpen}
                setOpen={setIsSaveOpen}
                type={type}
                formValues={formValues}
                setFormValues={setFormValues}
            />
        </>
    );
};

export default PresetButton;
