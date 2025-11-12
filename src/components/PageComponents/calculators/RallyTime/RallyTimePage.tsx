/** @format */

import ReactLayout from "@/layouts/ReactLayout";
import { Text } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { getUTC } from "../../Calendar/CalendarPage";
import RallyTimeForm from "./RallyTimeForm";
import { type RallyStarterResult, type RallyTimerResult } from "./RallyTimerResult";

const { MODE } = import.meta.env;
const KINGDOMS = ["298", "351"];
const QUICK_SET_MINUTES = 7;
const DEFAULT_RALLY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

function getHitTimeData(value?: Date) {
    const now = getUTC(value ?? new Date());
    const defaultSet = new Date(now.getTime() + QUICK_SET_MINUTES * 60000); // 7 minutes later
    const hour = defaultSet.getHours();
    const minute = defaultSet.getMinutes();
    const second = defaultSet.getSeconds();

    return { datetime: defaultSet, hour, minute, second };
}

const defaultRallyStarter: RallyStarterResult = {
    name: "Starter 1",
    marchTimeSec: 60,
    rallyStartTime: new Date(),
    active: true,
};

function loadPreset() {
    const preset = JSON.parse(localStorage.getItem(`presets.rallyTime`) || "[]");

    if (!preset?.length) {
        return null;
    }

    try {
        const fixedPreset = preset.map((item: any, index: number) => ({
            ...item,
            name: item.name || `Starter ${index + 1}`,
            marchTimeSec: Number(item.marchTimeSec) >= 0 ? Number(item.marchTimeSec) : 60,
            rallyStartTime: item.rallyStartTime ? new Date(item.rallyStartTime) : new Date(),
            active: typeof item.active === "boolean" ? item.active : true,
        }));

        return fixedPreset as RallyStarterResult[];
    } catch (e) {
        console.error("Failed to load preset:", e);
        return null;
    }
}

function savePreset(starters: RallyStarterResult[]) {
    localStorage.setItem(`presets.rallyTime`, JSON.stringify(starters));
}

const RallyTimePage = () => {
    const [result, setResult] = useState<RallyTimerResult>(() => {
        const hitTime = getHitTimeData();
        const loadedStarters = loadPreset();
        const rallyStarters = loadedStarters?.length
            ? loadedStarters.map((starter) => {
                  const rallyStartTime = new Date(
                      hitTime.datetime.getTime() - starter.marchTimeSec * 1000 - DEFAULT_RALLY_TIME
                  );
                  return { ...starter, rallyStartTime };
              })
            : [defaultRallyStarter];

        return {
            hitTime,
            rallyStarters,
        };
    });

    // # AUTHORIZATION CHECK
    const validAuth = KINGDOMS.map((kingdom) => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return btoa(`${kingdom}-${date.toISOString().split("T")[0]}`);
        });
    }).flat();
    const searchParam = new URLSearchParams(window.location.search);
    const isValidAuth = validAuth.includes(searchParam.get("auth") || "") || MODE === "development";

    const updateResult = (newResult: RallyTimerResult) => {
        const updatedStarters = newResult.rallyStarters.map((starter) => {
            const rallyStartTime = new Date(
                newResult.hitTime.datetime.getTime() -
                    starter.marchTimeSec * 1000 -
                    DEFAULT_RALLY_TIME
            );
            return { ...starter, rallyStartTime };
        });

        setResult({ ...newResult, rallyStarters: updatedStarters });
    };

    useEffect(() => {
        savePreset(result.rallyStarters);
    }, [result]);

    return (
        <ReactLayout>
            {isValidAuth ? (
                <>
                    <Text textStyle="3xl" fontWeight="bold">
                        Rally Timer
                    </Text>

                    <RallyTimeForm data={result} updateData={updateResult} />
                </>
            ) : null}
        </ReactLayout>
    );
};

export default RallyTimePage;
