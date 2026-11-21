/** @format */

import { formatUtcTime } from "@/lib/time";
import { Button, Field, HStack, Input } from "@chakra-ui/react";
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import {
    getSegmentAt,
    maskTimeInput,
    parseTimeInput,
    resolveClockTime,
    SEGMENT_SECONDS,
} from "./rallyTime";

const NUDGES = [-10, -1, 1, 10] as const;

/**
 * One HH:MM:SS field (UTC).
 * - Phone: numeric keypad, colons added for you, auto-commit at 6 digits.
 * - Desktop: arrow up/down steps the part under the caret (Shift = ×10).
 * - Enter commits, Escape reverts, blur commits or reverts if invalid.
 */
const TimeInput = ({
    label,
    value,
    onChange,
}: {
    label: string;
    value: Date;
    onChange: (value: Date) => void;
}) => {
    const [draft, setDraft] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    // Selection to restore after React re-renders the value (which moves the caret).
    const pendingSelection = useRef<[number, number] | null>(null);
    // First mouseup after focus would collapse our select-all; skip it.
    const skipNextMouseUp = useRef(false);

    useLayoutEffect(() => {
        const input = inputRef.current;

        if (input && pendingSelection.current && input === document.activeElement) {
            input.setSelectionRange(...pendingSelection.current);
        }
        pendingSelection.current = null;
    });

    const formatted = formatUtcTime(value);
    const display = draft ?? formatted;
    const isInvalid = draft !== null && draft.length >= 2 && parseTimeInput(draft) === null;

    const commit = (text: string) => {
        const parsed = parseTimeInput(text);

        if (!parsed) return false;

        onChange(resolveClockTime(parsed));
        return true;
    };

    const shift = (seconds: number) => {
        const next = new Date(value.getTime() + seconds * 1000);

        onChange(next);
        if (draft !== null) setDraft(formatUtcTime(next));
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;

        if (e.key === "Enter") {
            e.preventDefault();
            if (draft !== null && commit(draft)) setDraft(null);
            input.select();
            return;
        }

        if (e.key === "Escape") {
            setDraft(null);
            input.blur();
            return;
        }

        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();

            const caret = input.selectionStart ?? 0;
            const segment = getSegmentAt(caret);
            const step = SEGMENT_SECONDS[segment] * (e.shiftKey ? 10 : 1);

            // Commit pending typing first, then step from it.
            const parsed = draft !== null ? parseTimeInput(draft) : null;
            const base = parsed ? resolveClockTime(parsed) : value;
            const next = new Date(base.getTime() + (e.key === "ArrowUp" ? step : -step) * 1000);

            onChange(next);
            setDraft(formatUtcTime(next));

            // Keep the same segment selected so repeated presses feel natural.
            const start = segment === "hour" ? 0 : segment === "minute" ? 3 : 6;
            pendingSelection.current = [start, start + 2];
        }
    };

    return (
        <Field.Root invalid={isInvalid} width="100%" maxWidth="420px">
            <Field.Label>{label} (UTC)</Field.Label>
            <HStack gap={1} width="100%">
                {NUDGES.slice(0, 2).map((s) => (
                    <NudgeButton key={s} seconds={s} onClick={() => shift(s)} />
                ))}
                <Input
                    ref={inputRef}
                    value={display}
                    inputMode="numeric"
                    autoComplete="off"
                    enterKeyHint="done"
                    aria-label={`${label} in UTC, format hours minutes seconds`}
                    placeholder="HH:MM:SS"
                    // 8 chars + 1ch slack (bold/fallback fonts) + both paddings.
                    width="calc(9ch + 16px)"
                    flexShrink={0}
                    px="8px"
                    height="44px"
                    fontSize="xl"
                    fontFamily="mono"
                    textAlign="center"
                    fontWeight="bold"
                    onFocus={(e) => {
                        setDraft(formatted);
                        skipNextMouseUp.current = true;
                        e.currentTarget.select();
                    }}
                    onMouseUp={(e) => {
                        if (skipNextMouseUp.current) e.preventDefault();
                        skipNextMouseUp.current = false;
                    }}
                    onChange={(e) => {
                        const raw = e.target.value;
                        const isGrowing = raw.length > display.length;
                        const masked = maskTimeInput(raw, isGrowing);

                        setDraft(masked);

                        // Full HH:MM:SS typed: apply now, no need to leave the field.
                        if (/^\d{2}:\d{2}:\d{2}$/.test(masked)) commit(masked);
                    }}
                    onKeyDown={onKeyDown}
                    onBlur={() => {
                        skipNextMouseUp.current = false;
                        if (draft !== null) commit(draft);
                        setDraft(null);
                    }}
                />
                {NUDGES.slice(2).map((s) => (
                    <NudgeButton key={s} seconds={s} onClick={() => shift(s)} />
                ))}
            </HStack>
            {!isInvalid && (
                <Field.HelperText>
                    Just type the numbers, e.g. 140530 → 14:05:30. Colons are added for you.
                </Field.HelperText>
            )}
            <Field.ErrorText>Use HH:MM:SS, e.g. 140530 or 14:05:30</Field.ErrorText>
        </Field.Root>
    );
};

const NudgeButton = ({ seconds, onClick }: { seconds: number; onClick: () => void }) => (
    <Button
        type="button"
        // Filled, so it reads as a button next to the outlined time field.
        variant="subtle"
        colorPalette="blue"
        size="md"
        height="44px"
        // Share the space left by the time field; stay tappable on 320px phones.
        flex="1"
        minWidth="36px"
        maxWidth="64px"
        px={0}
        fontSize={{ base: "xs", sm: "sm" }}
        fontWeight="bold"
        fontVariantNumeric="tabular-nums"
        _active={{ transform: "scale(0.94)" }}
        aria-label={`${seconds > 0 ? "Add" : "Subtract"} ${Math.abs(seconds)} seconds`}
        // Keep focus in the input on desktop so arrow keys keep working.
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
    >
        {seconds > 0 ? `+${seconds}` : `−${Math.abs(seconds)}`}s
    </Button>
);

export default TimeInput;
