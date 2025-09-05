/** @format */

import type { BuildingStage } from "@/types/building";
import type { TruegoldFormValues } from "@/types/forms";
import { ChevronRightIcon } from "@chakra-ui/icons/ChevronRight";
import { InfoOutlineIcon } from "@chakra-ui/icons/InfoOutline";

import { Alert, Button, CloseButton, Drawer, Grid, Portal } from "@chakra-ui/react";
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

        setNewValue((prev) => {
            if (String(item.level) < prev.from) {
                setIsFirstClick(false);

                return { from: String(item.level), to: String(item.level) };
            }

            setIsFirstClick(true);

            return { ...prev, to: String(item.level) };
        });
    };

    useEffect(() => {
        onChange({ [fromKey]: newValue.from, [toKey]: newValue.to });
    }, [newValue]);

    return (
        <>
            <Drawer.Root
                size={{ smDown: "lg", md: "md", lg: "lg" }}
                placement={{ mdDown: "bottom", md: "end" }}
                open={open}
                onOpenChange={(e) => handleOnOpenChange(e.open)}
            >
                <Drawer.Trigger asChild>
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
                </Drawer.Trigger>
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content>
                            <Drawer.CloseTrigger />
                            <Drawer.Header flexDirection="column" alignItems="flex-start">
                                <Drawer.Title>{label}</Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body>
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
                                                height="100%"
                                            >
                                                {item.id
                                                    .replace("-", " ")
                                                    .split(" ")[1]
                                                    .toUpperCase()}
                                            </Button>
                                        );
                                    })}
                                </Grid>

                                <Alert.Root size="sm" status="info" mt={4}>
                                    <Alert.Indicator as={InfoOutlineIcon} />
                                    <Alert.Title>Info</Alert.Title>
                                    <Alert.Description>
                                        Use it to select a range. Your first click will set the
                                        start of the range.
                                    </Alert.Description>
                                </Alert.Root>
                            </Drawer.Body>

                            <Drawer.Footer>
                                <Drawer.ActionTrigger asChild>
                                    <Button variant="outline">Close</Button>
                                </Drawer.ActionTrigger>
                            </Drawer.Footer>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
        </>
    );
};

export default SelectTier;
