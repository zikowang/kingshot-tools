/** @format */

import { Toaster } from "@/components/ui/toaster";
import ReactLayout from "@/layouts/ReactLayout";
import type { TruegoldCalculatorResult } from "@/types/result";
import { Box, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import TruegoldForm from "./TruegoldForm";
import TruegoldResults from "./TruegoldResults";

const defaultResultValue: TruegoldCalculatorResult = {
    showResult: false,

    buildingList: [],

    time: 0,
    bread: 0,
    wood: 0,
    stone: 0,
    iron: 0,
    truegold: 0,
};

const TruegoldPage = () => {
    const [result, setResult] = useState<TruegoldCalculatorResult>(defaultResultValue);

    return (
        <ReactLayout>
            <Text textStyle="3xl" fontWeight="bold">
                Truegold Calculator
            </Text>

            <Stack gap={8} alignItems="flex-start" direction="row" wrap="wrap" mt={8}>
                <Box width={{ base: "100%", md: "320px" }}>
                    <TruegoldForm setResult={setResult} />
                </Box>

                <VStack alignItems="flex-start" width={{ base: "100%", md: "320px" }}>
                    <TruegoldResults result={result} />
                </VStack>
            </Stack>

            <Toaster />
        </ReactLayout>
    );
};

export default TruegoldPage;
