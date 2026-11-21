/** @format */

import { writeJson } from "@/lib/localStorage";
import ReactLayout from "@/layouts/ReactLayout";
import { Text } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import RallyTimeForm from "./RallyTimeForm";
import {
    createRallyStarter,
    DEFAULT_QUICK_SET_MINUTES,
    getTimeFromNow,
    parseRallyPreset,
    PRESET_STORAGE_KEY,
    withStartTimes,
    type RallyTimerResult,
} from "./rallyTime";

const { MODE } = import.meta.env;
const KINGDOMS = ["298", "351"];

// NOTE: client-side gate only. Anyone reading the bundle can build a token.
function hasValidAuth() {
    if (MODE === "development") return true;

    const validAuth = KINGDOMS.flatMap((kingdom) =>
        Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return btoa(`${kingdom}-${date.toISOString().split("T")[0]}`);
        })
    );
    const auth = new URLSearchParams(window.location.search).get("auth") || "";

    return validAuth.includes(auth);
}

function getInitialResult(): RallyTimerResult {
    const hitTime = getTimeFromNow(DEFAULT_QUICK_SET_MINUTES);
    const starters = parseRallyPreset(localStorage.getItem(PRESET_STORAGE_KEY)) ?? [
        createRallyStarter(0),
    ];

    return {
        hitTime,
        selectedQuickSetMinutes: DEFAULT_QUICK_SET_MINUTES,
        rallyStarters: withStartTimes(hitTime.datetime, starters),
    };
}

const RallyTimePage = () => {
    const [isValidAuth] = useState(hasValidAuth);
    const [result, setResult] = useState(getInitialResult);

    const updateResult = (newResult: RallyTimerResult) => {
        setResult({
            ...newResult,
            rallyStarters: withStartTimes(newResult.hitTime.datetime, newResult.rallyStarters),
        });
    };

    useEffect(() => {
        writeJson(PRESET_STORAGE_KEY, result.rallyStarters);
    }, [result.rallyStarters]);

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
