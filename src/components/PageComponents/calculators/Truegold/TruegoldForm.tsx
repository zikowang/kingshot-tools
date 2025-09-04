/** @format */

import { allBuildings, barracks, embassy, range, stable, townCenter } from "@/data/buildings";
import type { TruegoldFormValues } from "@/types/forms";
import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SelectTier from "./SelectTier/SelectTier";

const defaultFormValues: TruegoldFormValues = {
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
        const currentTcLevel = parseInt(formValues.currentTcLevel);
        const targetTcLevel = parseInt(formValues.targetTcLevel);
        const currentEmLevel = parseInt(formValues.currentEmLevel);
        const targetEmLevel = parseInt(formValues.targetEmLevel);
        const currentBaLevel = parseInt(formValues.currentBaLevel);
        const targetBaLevel = parseInt(formValues.targetBaLevel);
        const currentStLevel = parseInt(formValues.currentStLevel);
        const targetStLevel = parseInt(formValues.targetStLevel);
        const currentRaLevel = parseInt(formValues.currentRaLevel);
        const targetRaLevel = parseInt(formValues.targetRaLevel);

        const buildingSpeed = parseFloat(formValues.buildingSpeed);
        const kingdomBuffSpeed = parseFloat(formValues.kingdomBuffSpeed);
        const positionBuffSpeed = parseFloat(formValues.positionBuffSpeed);
        const doubleTime = formValues.doubleTime === "true";

        const currentTc = townCenter.find((t) => t.level === currentTcLevel);
        const targetTc = townCenter.find((t) => t.level === targetTcLevel);
        const currentEm = embassy.find((e) => e.level === currentEmLevel);
        const targetEm = embassy.find((e) => e.level === targetEmLevel);
        const currentBa = barracks.find((b) => b.level === currentBaLevel);
        const targetBa = barracks.find((b) => b.level === targetBaLevel);
        const currentSt = stable.find((s) => s.level === currentStLevel);
        const targetSt = stable.find((s) => s.level === targetStLevel);
        const currentRa = range.find((r) => r.level === currentRaLevel);
        const targetRa = range.find((r) => r.level === targetRaLevel);

        // calculation for TC
        if (
            !currentTc ||
            !targetTc ||
            !currentEm ||
            !targetEm ||
            !currentBa ||
            !targetBa ||
            !currentSt ||
            !targetSt ||
            !currentRa ||
            !targetRa
        ) {
            console.error("nothing");
            return;
        }

        const tcToBuild = townCenter.filter(
            (t) => t.level > currentTcLevel && t.level <= targetTcLevel
        );

        const allBaseRequirements = [
            ...allBuildings.filter((elem) => targetTc.requirements.includes(elem.id)),
            ...allBuildings.filter((elem) => targetEm.requirements.includes(elem.id)),
            ...allBuildings.filter((elem) => targetBa.requirements.includes(elem.id)),
            ...allBuildings.filter((elem) => targetSt.requirements.includes(elem.id)),
            ...allBuildings.filter((elem) => targetRa.requirements.includes(elem.id)),
        ];

        console.log(allBaseRequirements);
    }, [formValues]);

    useEffect(() => {
        const params = new URLSearchParams();

        Object.entries(formValues).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (value.length > 0) params.set(key, value.join(","));
            } else if (value !== "0" && value !== "" && value !== undefined) {
                params.set(key, value);
            }
        });

        window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    }, [formValues]);

    return (
        <Box style={{ width: "100%" }}>
            <Stack gap={4} width="100%">
                <Box width="100%">
                    <SelectTier
                        formValues={formValues}
                        fromKey="currentTcLevel"
                        toKey="targetTcLevel"
                        options={townCenter}
                        onChange={(value) => setFormValues((prev) => ({ ...prev, ...value }))}
                        label={"Town Center Level"}
                        placeholder={"Select Town Center Level"}
                    />
                </Box>

                <Box width="100%">
                    <SelectTier
                        formValues={formValues}
                        fromKey="currentEmLevel"
                        toKey="targetEmLevel"
                        options={embassy}
                        onChange={(value) => setFormValues((prev) => ({ ...prev, ...value }))}
                        label={"Embassy Level"}
                        placeholder={"Select Embassy Level"}
                    />
                </Box>

                <Box width="100%">
                    <SelectTier
                        formValues={formValues}
                        fromKey="currentBaLevel"
                        toKey="targetBaLevel"
                        options={barracks}
                        onChange={(value) => setFormValues((prev) => ({ ...prev, ...value }))}
                        label={"Barracks Level"}
                        placeholder={"Select Barracks Level"}
                    />
                </Box>

                <Box width="100%">
                    <SelectTier
                        formValues={formValues}
                        fromKey="currentStLevel"
                        toKey="targetStLevel"
                        options={stable}
                        onChange={(value) => setFormValues((prev) => ({ ...prev, ...value }))}
                        label={"Stables Level"}
                        placeholder={"Select Stables Level"}
                    />
                </Box>

                <Box width="100%">
                    <SelectTier
                        formValues={formValues}
                        fromKey="currentRaLevel"
                        toKey="targetRaLevel"
                        options={range}
                        onChange={(value) => setFormValues((prev) => ({ ...prev, ...value }))}
                        label={"Range Level"}
                        placeholder={"Select Range Level"}
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default TruegoldForm;
