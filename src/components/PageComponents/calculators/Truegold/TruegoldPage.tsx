/** @format */

import ReactLayout from "@/layouts/ReactLayout";
import { Text } from "@chakra-ui/react";
import TruegoldForm from "./TruegoldForm";

const TruegoldPage = () => {
    return (
        <ReactLayout>
            <Text textStyle="3xl" fontWeight="bold">
                Truegold Calculator
            </Text>

            <TruegoldForm />
        </ReactLayout>
    );
};

export default TruegoldPage;
