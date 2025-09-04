/** @format */

import type { BuildingStage } from "@/types/building";
import type { TruegoldFormValues } from "@/types/forms";
import { ChevronRightIcon } from "@chakra-ui/icons/ChevronRight";

import { Button, Dialog, Grid } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

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
    const isFirstClick = useRef(true);

    const [open, setOpen] = useState(false);
    const [newValue, setNewValue] = useState<{ from: string; to: string | null }>({
        from: formValues[fromKey],
        to: formValues[toKey],
    });

    const fromItem = options.find((o) => String(o.level) === formValues[fromKey]);
    const toItem = options.find((o) => String(o.level) === formValues[toKey]);

    const handleOnOpenChange = (open: boolean = true) => {
        if (!open) {
            isFirstClick.current = true;
        }

        setOpen(open);
    };

    const handleClick = (item: BuildingStage) => {
        if (isFirstClick.current) {
            setNewValue({ from: String(item.level), to: String(item.level) });
            isFirstClick.current = false;

            return;
        }

        setNewValue((prev) => ({ ...prev, to: String(item.level) }));
        isFirstClick.current = true;

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
                        {fromItem?.name}
                        <ChevronRightIcon />
                        {toItem?.name}
                    </Button>
                </Dialog.Trigger>
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
                                    const isStart = newValue.from === String(item.level);
                                    const isEnd = newValue.to === String(item.level);
                                    const isBetween =
                                        newValue.to &&
                                        newValue.from < String(item.level) &&
                                        newValue.to > String(item.level);

                                    const variant = useMemo(() => {
                                        if (isStart) return "solid";
                                        if (isEnd) return "solid";
                                        if (isBetween) return "subtle";
                                        return "ghost";
                                    }, [isStart, isEnd, isBetween]);

                                    return (
                                        <Button
                                            key={item.id}
                                            variant={variant}
                                            colorPalette={
                                                isStart || isEnd || isBetween
                                                    ? "orange"
                                                    : "transparent"
                                            }
                                            onClick={() => handleClick(item)}
                                            height="100%"
                                        >
                                            {item.id.toUpperCase()}
                                        </Button>
                                    );
                                })}
                            </Grid>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    );
};

export default SelectTier;
