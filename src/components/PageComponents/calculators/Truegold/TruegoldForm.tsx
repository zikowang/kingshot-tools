/** @format */

import CustomSelect from "@/components/ui/select";
import { barracks, embassy, range, stable, townCenter } from "@/data/buildings";
import { Box, createListCollection, HStack, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const defaultFormValues: {
    currentTcLevel: string;
    targetTcLevel: string;

    currentEmLevel: string;
    targetEmLevel: string;

    currentBaLevel: string;
    targetBaLevel: string;

    currentStLevel: string;
    targetStLevel: string;

    currentRaLevel: string;
    targetRaLevel: string;

    buildingSpeed: string;
    kingdomBuffSpeed: string;
    positionBuffSpeed: string;
    doubleTime: string;
} = {
    currentTcLevel: "30",
    targetTcLevel: "35",

    currentEmLevel: "30",
    targetEmLevel: "35",

    currentBaLevel: "30",
    targetBaLevel: "35",

    currentStLevel: "30",
    targetStLevel: "35",

    currentRaLevel: "30",
    targetRaLevel: "35",

    buildingSpeed: "0",
    kingdomBuffSpeed: "0",
    positionBuffSpeed: "0",
    doubleTime: "false",
};

const townCenterCollection = createListCollection({
    items: townCenter.map((t) => ({ label: t.name, value: t.level.toString() })),
});

const embassyCollection = createListCollection({
    items: embassy.map((t) => ({ label: t.name, value: t.level.toString() })),
});

const barracksCollection = createListCollection({
    items: barracks.map((t) => ({ label: t.name, value: t.level.toString() })),
});

const stablesCollection = createListCollection({
    items: stable.map((t) => ({ label: t.name, value: t.level.toString() })),
});

const rangeCollection = createListCollection({
    items: range.map((t) => ({ label: t.name, value: t.level.toString() })),
});

const TruegoldForm = () => {
    const [result, setResult] = useState<any>("");

    const [formValues, setFormValues] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const initialValues = { ...defaultFormValues };

        Object.keys(initialValues).forEach((key) => {
            const value = params.get(key);

            if (key in initialValues && value !== null) {
                if (Array.isArray(defaultFormValues[key as keyof typeof defaultFormValues])) {
                    initialValues[key as keyof typeof initialValues] = value.split(",") as any;
                } else {
                    initialValues[key as keyof typeof initialValues] = value as any;
                }
            }
        });

        return initialValues;
    });

    useEffect(() => {
        console.log("render");
        // calculation for TC
        const currentTcLevel = parseInt(formValues.currentTcLevel);
        const targetTcLevel = parseInt(formValues.targetTcLevel);
        const buildingSpeed = parseFloat(formValues.buildingSpeed);
        const kingdomBuffSpeed = parseFloat(formValues.kingdomBuffSpeed);
        const positionBuffSpeed = parseFloat(formValues.positionBuffSpeed);
        const doubleTime = formValues.doubleTime === "true";

        // Perform calculations here
        const currentTc = townCenter.find((t) => t.level === currentTcLevel);
        const targetTc = townCenter.find((t) => t.level === targetTcLevel);

        if (!currentTc || !targetTc) {
            console.error("nothing");
            return;
        }

        console.log(currentTc);
        console.log(targetTc);

        const buildTimeTc = targetTc.buildTime;
        console.log(buildTimeTc);
    }, [formValues]);

    return (
        <Box style={{ width: "100%" }}>
            <Stack gap={4} width="100%">
                <HStack>
                    <CustomSelect
                        value={formValues.currentTcLevel}
                        options={townCenterCollection}
                        onChange={(value) =>
                            setFormValues((prev) => ({ ...prev, currentTcLevel: value }))
                        }
                        label={"Current Town Center Level"}
                        placeholder={"Select Current Town Center Level"}
                    />

                    <CustomSelect
                        value={formValues.targetTcLevel}
                        options={townCenterCollection}
                        onChange={(value) =>
                            setFormValues((prev) => ({ ...prev, targetTcLevel: value }))
                        }
                        label={"Target Town Center Level"}
                        placeholder={"Select Target Town Center Level"}
                    />
                </HStack>

                <HStack>
                    <CustomSelect
                        value={formValues.currentEmLevel}
                        options={embassyCollection}
                        onChange={(value) =>
                            setFormValues((prev) => ({ ...prev, currentEmLevel: value }))
                        }
                        label={"Current Embassy Level"}
                        placeholder={"Select Current Embassy Level"}
                    />

                    <CustomSelect
                        value={formValues.targetEmLevel}
                        options={embassyCollection}
                        onChange={(value) =>
                            setFormValues((prev) => ({ ...prev, targetEmLevel: value }))
                        }
                        label={"Target Embassy Level"}
                        placeholder={"Select Target Embassy Level"}
                    />
                </HStack>

                <HStack>
                    <CustomSelect
                        value={formValues.currentBaLevel}
                        options={barracksCollection}
                        onChange={(value) =>
                            setFormValues((prev) => ({ ...prev, currentBaLevel: value }))
                        }
                        label={"Current Barracks Level"}
                        placeholder={"Select Current Barracks Level"}
                    />

                    <CustomSelect
                        value={formValues.targetBaLevel}
                        options={barracksCollection}
                        onChange={(value) =>
                            setFormValues((prev) => ({ ...prev, targetBaLevel: value }))
                        }
                        label={"Target Barracks Level"}
                        placeholder={"Select Target Barracks Level"}
                    />
                </HStack>

                <HStack>
                    <CustomSelect
                        value={formValues.currentStLevel}
                        options={stablesCollection}
                        onChange={(value) =>
                            setFormValues((prev) => ({ ...prev, currentStLevel: value }))
                        }
                        label={"Current Stables Level"}
                        placeholder={"Select Current Stables Level"}
                    />

                    <CustomSelect
                        value={formValues.targetStLevel}
                        options={stablesCollection}
                        onChange={(value) =>
                            setFormValues((prev) => ({ ...prev, targetStLevel: value }))
                        }
                        label={"Target Stables Level"}
                        placeholder={"Select Target Stables Level"}
                    />
                </HStack>

                <HStack>
                    <CustomSelect
                        value={formValues.currentRaLevel}
                        options={rangeCollection}
                        onChange={(value) =>
                            setFormValues((prev) => ({ ...prev, currentRaLevel: value }))
                        }
                        label={"Current Range Level"}
                        placeholder={"Select Current Range Level"}
                    />

                    <CustomSelect
                        value={formValues.targetRaLevel}
                        options={rangeCollection}
                        onChange={(value) =>
                            setFormValues((prev) => ({ ...prev, targetRaLevel: value }))
                        }
                        label={"Target Range Level"}
                        placeholder={"Select Target Range Level"}
                    />
                </HStack>
            </Stack>
        </Box>
    );
};

export default TruegoldForm;
