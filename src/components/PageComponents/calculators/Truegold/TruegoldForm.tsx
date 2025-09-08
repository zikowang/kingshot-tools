/** @format */

import PresetButton from "@/components/PresetButton/PresetButton";
import { toaster } from "@/components/ui/toaster";
import { ToggleTip } from "@/components/ui/toggle-tip";
import { allBuildings, barracks, embassy, range, stable, townCenter } from "@/data/buildings";
import { getTruegoldPreset } from "@/lib/localStorage";
import type { BuildingStage } from "@/types/building";
import type { TruegoldFormValues } from "@/types/forms";
import type { TruegoldCalculatorResult } from "@/types/result";
import {
    Box,
    Button,
    Field,
    InputGroup,
    NumberInput,
    Stack,
    Switch,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState, type Dispatch } from "react";
import { LuInfo, LuPercent } from "react-icons/lu";
import SelectTier from "./SelectTier/SelectTier";

const defaultFormValues: TruegoldFormValues = {
    currentTcLevel: "30",
    targetTcLevel: "35",

    currentEmLevel: "30",
    targetEmLevel: "30",

    currentBaLevel: "30",
    targetBaLevel: "30",

    currentStLevel: "30",
    targetStLevel: "30",

    currentRaLevel: "30",
    targetRaLevel: "30",

    saulBuff: "0",

    buildingSpeed: "0",
    kingdomBuffSpeed: "0",
    positionBuffSpeed: "0",
    petBuffSpeed: "0",
    kvkBonusSpeed: "0",

    doubleTime: "0",
};

const KING_SKILL = "10";
const POSITION_BUFF = "10";
const DOUBLE_TIME_BUFF = "20";
const KVK_BONUS = "5";

function getRequirementsRecursive(current: BuildingStage[], target: BuildingStage[]) {
    let requirementsIds: string[] = [];

    // recursive function to find all requirements
    const findRequirements = (currentBuilding: BuildingStage) => {
        const building = allBuildings.find((b) => b.id === currentBuilding.id);
        if (building) {
            requirementsIds = Array.from(new Set([...requirementsIds, ...building.requirements]));
            building.requirements.forEach((entry) => {
                findRequirements(allBuildings.find((b) => b.id === entry)!);
            });
        }
    };

    target.forEach((entry) => {
        findRequirements(allBuildings.find((b) => b.id === entry.id)!);
    });

    requirementsIds = Array.from(new Set([...requirementsIds, ...target.map((t) => t.id)]));

    const requiredBuildings = allBuildings
        .filter((b) => requirementsIds.includes(b.id))
        .filter((building) => {
            const type = building.type;

            if (type === "tc") {
                const currentTc = current.find((c) => c.type === "tc");

                if (!currentTc) return true;

                return building.level > currentTc.level;
            }

            if (type === "em") {
                const currentEm = current.find((c) => c.type === "em");

                if (!currentEm) return true;

                return building.level > currentEm.level;
            }

            if (type === "ba") {
                const currentBa = current.find((c) => c.type === "ba");

                if (!currentBa) return true;

                return building.level > currentBa.level;
            }

            if (type === "ra") {
                const currentRa = current.find((c) => c.type === "ra");

                if (!currentRa) return true;

                return building.level > currentRa.level;
            }

            if (type === "st") {
                const currentSt = current.find((c) => c.type === "st");

                if (!currentSt) return true;

                return building.level > currentSt.level;
            }
        });

    return requiredBuildings;
}

const TruegoldForm = ({
    setResult,
}: {
    setResult: Dispatch<React.SetStateAction<TruegoldCalculatorResult>>;
}) => {
    let toasterTimeout: NodeJS.Timeout | null = null;

    const [formValues, setFormValues] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        let initialValues = { ...defaultFormValues };

        if (params.size === 0) {
            const preset = getTruegoldPreset();

            if (preset) {
                initialValues = { ...initialValues, ...preset };
                toasterTimeout = setTimeout(() => {
                    toaster.success({
                        description: "Preset loaded",
                    });
                }, 300);
            }
        } else {
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
        }

        return initialValues;
    });

    useEffect(() => {
        const currentTc = townCenter.find(
            (t) => t.level === parseInt(formValues.currentTcLevel || "30")
        );
        const targetTc = townCenter.find(
            (t) => t.level === parseInt(formValues.targetTcLevel || "30")
        );
        const currentEm = embassy.find(
            (e) => e.level === parseInt(formValues.currentEmLevel || "30")
        );
        const targetEm = embassy.find(
            (e) => e.level === parseInt(formValues.targetEmLevel || "30")
        );
        const currentBa = barracks.find(
            (b) => b.level === parseInt(formValues.currentBaLevel || "30")
        );
        const targetBa = barracks.find(
            (b) => b.level === parseInt(formValues.targetBaLevel || "30")
        );
        const currentSt = stable.find(
            (s) => s.level === parseInt(formValues.currentStLevel || "30")
        );
        const targetSt = stable.find((s) => s.level === parseInt(formValues.targetStLevel || "30"));
        const currentRa = range.find(
            (r) => r.level === parseInt(formValues.currentRaLevel || "30")
        );
        const targetRa = range.find((r) => r.level === parseInt(formValues.targetRaLevel || "30"));

        const saulBuff = parseFloat(formValues.saulBuff);

        const buildingSpeed = parseFloat(formValues.buildingSpeed || "0");
        const kingdomBuffSpeed = parseFloat(formValues.kingdomBuffSpeed || "0");
        const positionBuffSpeed = parseFloat(formValues.positionBuffSpeed || "0");
        const doubleTimeBuffSpeed = parseFloat(formValues.doubleTime || "0");
        const petBuffSpeed = parseFloat(formValues.petBuffSpeed || "0");
        const kvkBonusSpeed = parseFloat(formValues.kvkBonusSpeed || "0");

        // gather Buildings to be build
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
            console.error("Data Error");

            return;
        }

        let resultBuildings = getRequirementsRecursive(
            [currentTc, currentEm, currentBa, currentSt, currentRa],
            [targetTc, targetEm, targetBa, targetSt, targetRa]
        );

        // update build time with buffs
        const buildingBuff = parseFloat(
            (
                (1 + doubleTimeBuffSpeed / 100) *
                (1 +
                    buildingSpeed / 100 +
                    kingdomBuffSpeed / 100 +
                    positionBuffSpeed / 100 +
                    petBuffSpeed / 100 +
                    kvkBonusSpeed / 100)
            ).toFixed(3)
        );
        resultBuildings = resultBuildings.map((building) => {
            return {
                ...building,
                buildTime: Math.ceil(building.buildTime / buildingBuff),
            };
        });

        // update normal resource
        if (saulBuff > 0) {
            resultBuildings = resultBuildings.map((building) => {
                return {
                    ...building,
                    cost: {
                        ...building.cost,
                        bread: Math.ceil(building.cost.bread * (1 - saulBuff / 100)),
                        wood: Math.ceil(building.cost.wood * (1 - saulBuff / 100)),
                        stone: Math.ceil(building.cost.stone * (1 - saulBuff / 100)),
                        iron: Math.ceil(building.cost.iron * (1 - saulBuff / 100)),
                    },
                };
            });
        }

        setResult({
            showResult: true,

            time: resultBuildings.reduce((acc, building) => acc + building.buildTime, 0),
            bread: resultBuildings.reduce((acc, building) => acc + building.cost.bread, 0),
            wood: resultBuildings.reduce((acc, building) => acc + building.cost.wood, 0),
            stone: resultBuildings.reduce((acc, building) => acc + building.cost.stone, 0),
            iron: resultBuildings.reduce((acc, building) => acc + building.cost.iron, 0),
            truegold: resultBuildings.reduce((acc, building) => acc + building.cost.truegold, 0),

            buildingList: resultBuildings,
        });
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

                <NumberInput.Root
                    value={formValues.saulBuff}
                    onValueChange={(e) => setFormValues((prev) => ({ ...prev, saulBuff: e.value }))}
                    min={0}
                    onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                    onBlur={(e) => {
                        if (e.target instanceof HTMLInputElement) {
                            let value = parseFloat(e.target.value.replace(",", "."));
                            if (isNaN(value) || value < 0) value = 0;
                            e.target.value = value.toString();
                            setFormValues((prev) => ({
                                ...prev,
                                quantity: value.toString(),
                            }));
                        }
                    }}
                >
                    <NumberInput.Label>Saul Resource Buff</NumberInput.Label>
                    <NumberInput.Scrubber />
                    <InputGroup startElement={<LuPercent />}>
                        <NumberInput.Input />
                    </InputGroup>
                </NumberInput.Root>

                <Field.Root invalid={parseFloat(formValues.buildingSpeed) <= 0}>
                    <NumberInput.Root
                        value={formValues.buildingSpeed || "0"}
                        onValueChange={(e) => {
                            const value = e.value.replace(",", ".");
                            setFormValues((prev) => ({
                                ...prev,
                                buildingSpeed: value || "0",
                            }));
                        }}
                        step={0.1}
                        min={0}
                        onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                        onBlur={(e) => {
                            if (e.target instanceof HTMLInputElement) {
                                let value = parseFloat(e.target.value.replace(",", "."));
                                if (isNaN(value) || value < 0) value = 0;
                                e.target.value = value.toString();
                                setFormValues((prev) => ({
                                    ...prev,
                                    buildingSpeed: value.toString(),
                                }));
                            }
                        }}
                        width="100%"
                    >
                        <NumberInput.Label>Construction Speed</NumberInput.Label>
                        <InputGroup
                            startElement={<LuPercent />}
                            endElement={
                                <ToggleTip
                                    content={
                                        <VStack
                                            justifyContent="flex-start"
                                            alignItems="flex-start"
                                            p={2}
                                        >
                                            <Text>
                                                You can find your construction speed in the bonus
                                                overview.
                                            </Text>
                                            <Box
                                                as="ul"
                                                listStyleType="circle"
                                                listStylePosition="inside"
                                            >
                                                <li>
                                                    Tap on your Power on the top left (next to your
                                                    profile picture)
                                                </li>
                                                <li>Find "Construction Speed" in the list</li>
                                            </Box>
                                        </VStack>
                                    }
                                >
                                    <Button
                                        size="xs"
                                        colorPalette={
                                            parseFloat(formValues.buildingSpeed) <= 0
                                                ? "red"
                                                : "blue"
                                        }
                                        variant="ghost"
                                    >
                                        <LuInfo />
                                    </Button>
                                </ToggleTip>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                        <NumberInput.Scrubber />
                    </NumberInput.Root>
                    <Field.ErrorText>You should add your Construction Speed!</Field.ErrorText>
                </Field.Root>

                <NumberInput.Root
                    value={formValues.petBuffSpeed}
                    onValueChange={(e) =>
                        setFormValues((prev) => ({ ...prev, petBuffSpeed: e.value }))
                    }
                    min={0}
                    onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                    onBlur={(e) => {
                        if (e.target instanceof HTMLInputElement) {
                            let value = parseFloat(e.target.value.replace(",", "."));
                            if (isNaN(value) || value < 0) value = 0;
                            e.target.value = value.toString();
                            setFormValues((prev) => ({
                                ...prev,
                                quantity: value.toString(),
                            }));
                        }
                    }}
                >
                    <NumberInput.Label>Pet Buff</NumberInput.Label>
                    <NumberInput.Scrubber />
                    <InputGroup startElement={<LuPercent />}>
                        <NumberInput.Input />
                    </InputGroup>
                </NumberInput.Root>

                <Switch.Root
                    checked={formValues.doubleTime !== "0"}
                    onCheckedChange={(e) =>
                        setFormValues((prev) => ({
                            ...prev,
                            doubleTime: e.checked ? DOUBLE_TIME_BUFF : "0",
                        }))
                    }
                    colorPalette="blue"
                    opacity={0.5}
                    _checked={{ opacity: 1 }}
                    _hover={{ opacity: 1 }}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label _hover={{ cursor: "pointer" }}>Double Time</Switch.Label>
                </Switch.Root>

                <Switch.Root
                    checked={formValues.kingdomBuffSpeed !== "0"}
                    onCheckedChange={(e) =>
                        setFormValues((prev) => ({
                            ...prev,
                            kingdomBuffSpeed: e.checked ? KING_SKILL : "0",
                        }))
                    }
                    colorPalette="blue"
                    opacity={0.5}
                    _checked={{ opacity: 1 }}
                    _hover={{ opacity: 1 }}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label _hover={{ cursor: "pointer" }}>
                        Kingdom Skill Buff ({KING_SKILL}%)
                    </Switch.Label>
                </Switch.Root>

                <Switch.Root
                    checked={formValues.positionBuffSpeed !== "0"}
                    onCheckedChange={(e) =>
                        setFormValues((prev) => ({
                            ...prev,
                            positionBuffSpeed: e.checked ? POSITION_BUFF : "0",
                        }))
                    }
                    colorPalette="blue"
                    opacity={0.5}
                    _checked={{ opacity: 1 }}
                    _hover={{ opacity: 1 }}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label _hover={{ cursor: "pointer" }}>
                        Chief Minister Buff ({POSITION_BUFF}%)
                    </Switch.Label>
                </Switch.Root>

                <Switch.Root
                    checked={formValues.kvkBonusSpeed !== "0"}
                    onCheckedChange={(e) =>
                        setFormValues((prev) => ({
                            ...prev,
                            kvkBonusSpeed: e.checked ? KVK_BONUS : "0",
                        }))
                    }
                    colorPalette="blue"
                    opacity={0.5}
                    _checked={{ opacity: 1 }}
                    _hover={{ opacity: 1 }}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label _hover={{ cursor: "pointer" }}>
                        Kingdom of Power Bonus ({KVK_BONUS}%)
                    </Switch.Label>
                </Switch.Root>

                <Box display="flex" justifyContent="flex-end" my={4}>
                    <PresetButton
                        type="truegold"
                        formValues={formValues}
                        setFormValues={setFormValues}
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default TruegoldForm;
