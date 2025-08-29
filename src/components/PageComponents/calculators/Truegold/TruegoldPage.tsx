/** @format */

import ComingSoon from "@/components/PageComponents/ComingSoonPage";
import ReactLayout from "@/layouts/ReactLayout";
import { Text } from "@chakra-ui/react";

const TruegoldPage = () => {
    return (
        <ReactLayout>
            <Text textStyle="3xl" fontWeight="bold">
                Truegold Calculator
            </Text>

            <ComingSoon />
        </ReactLayout>
    );
};

export default TruegoldPage;
