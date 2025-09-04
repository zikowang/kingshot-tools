/** @format */

import type { BuildingStage } from "@/types/building";
import type { TruegoldFormValues } from "@/types/forms";
import { ChevronRightIcon } from "@chakra-ui/icons/ChevronRight";

import { Button, CloseButton, Dialog, Grid, Portal } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function getVariant(
    isStart: boolean,
    isEnd: boolean,
    isBetween: boolean
): "solid" | "subtle" | "surface" | "outline" | "ghost" | "plain" | undefined {
    if (isStart) return "solid";
    if (isEnd) return "solid";
    if (isBetween) return "subtle";
    return "ghost";
}

function getColor(isStart: boolean, isEnd: boolean, isBetween: boolean) {
    if (isStart) return "green";
    if (isEnd) return "orange";
    if (isBetween) return "orange";
    return "transparent";
}

function getSelectButtonColorAndVariant(isStart: boolean, isEnd: boolean, isBetween: boolean) {
    const variant = getVariant(isStart, isEnd, isBetween);
    const color = getColor(isStart, isEnd, isBetween);

    return { variant, color };
}

const SelectTier = ({
    label,
    placeholder,
    formValues,
    fromKey,
    toKey,
    options,
    onChange,
}: {
    label: string;
    placeholder: string;
    formValues: TruegoldFormValues;
    fromKey: keyof TruegoldFormValues;
    toKey: keyof TruegoldFormValues;
    options: BuildingStage[];
    onChange: (value: Partial<TruegoldFormValues>) => void;
}) => {
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [open, setOpen] = useState(false);
    const [newValue, setNewValue] = useState<{ from: string; to: string | null }>({
        from: formValues[fromKey],
        to: formValues[toKey],
    });

    const fromItem = options.find((o) => String(o.level) === formValues[fromKey]);
    const toItem = options.find((o) => String(o.level) === formValues[toKey]);

    const handleOnOpenChange = (open: boolean = true) => {
        if (!open) {
            setIsFirstClick(true);
        }

        setOpen(open);
    };

    const handleClick = (item: BuildingStage) => {
        if (isFirstClick) {
            setNewValue({ from: String(item.level), to: String(item.level) });
            setIsFirstClick(false);

            return;
        }

        setNewValue((prev) => ({ ...prev, to: String(item.level) }));
        setIsFirstClick(true);

        handleOnOpenChange(false);
    };

    useEffect(() => {
        onChange({ [fromKey]: newValue.from, [toKey]: newValue.to });
    }, [newValue]);

    return (
        <>
            <Dialog.Root
                size={{ mdDown: "full", md: "lg" }}
                open={open}
                onOpenChange={(e) => handleOnOpenChange(e.open)}
            >
                <Dialog.Trigger asChild>
                    <Button width="100%" variant="outline">
                        {fromItem === toItem ? (
                            <>{fromItem?.name}</>
                        ) : (
                            <>
                                {fromItem?.name}
                                <ChevronRightIcon />
                                {toItem?.name}
                            </>
                        )}
                    </Button>
                </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.CloseTrigger />
                            <Dialog.Header>
                                <Dialog.Title>{label}</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Grid
                                    width="100%"
                                    gridTemplateColumns={"repeat(5, 1fr)"}
                                    gridTemplateRows={"repeat(6, 50px)"}
                                    gap={1}
                                >
                                    {options.map((item) => {
                                        const isDisabled =
                                            !isFirstClick && String(item.level) < newValue.from;
                                        const isStart = newValue.from === String(item.level);
                                        const isEnd = newValue.to === String(item.level);
                                        const isBetween =
                                            !!newValue.to &&
                                            newValue.from < String(item.level) &&
                                            newValue.to > String(item.level);

                                        const { variant, color } = getSelectButtonColorAndVariant(
                                            isStart,
                                            isEnd,
                                            isBetween
                                        );

                                        return (
                                            <Button
                                                key={item.id}
                                                variant={variant}
                                                colorPalette={color}
                                                onClick={() => handleClick(item)}
                                                disabled={isDisabled}
                                                height="100%"
                                            >
                                                {item.id.replace("-", " ").toUpperCase()}
                                            </Button>
                                        );
                                    })}
                                </Grid>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">Close</Button>
                                </Dialog.ActionTrigger>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
};

export default SelectTier;
