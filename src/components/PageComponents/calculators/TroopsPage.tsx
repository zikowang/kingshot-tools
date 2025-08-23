/** @format */

import ReactLayout from "@/layouts/ReactLayout";
import { Box, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import TroopsForm, { type TroopCalculatorResult } from "./TroopsForm";
import TroopsResults from "./TroopsResults";

const defaultResultValue: TroopCalculatorResult = {
    showResult: false,
    calculationType: "amount-of-troops",
    quantity: 0,
    time: 0,
    bread: 0,
    wood: 0,
    stone: 0,
    iron: 0,

    kvkPoints: 0,
    strongestGovernorPoints: 0,
};

const TroopsPage = () => {
    const [result, setResult] = useState<TroopCalculatorResult>(defaultResultValue);

    return (
        <ReactLayout>
            <Text textStyle="3xl" fontWeight="bold">
                Troops Calculator
            </Text>

            <Stack gap={8} alignItems="flex-start" direction="row" wrap="wrap" mt={8}>
                <Box width={{ base: "100%", md: "320px" }}>
                    <TroopsForm setResult={setResult} />
                </Box>

                <VStack alignItems="flex-start" width={{ base: "100%", md: "320px" }}>
                    <TroopsResults result={result} />
                </VStack>
            </Stack>
        </ReactLayout>
    );
};

export default TroopsPage;
