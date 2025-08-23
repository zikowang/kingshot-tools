/** @format */

import ReactLayout from "@/layouts/ReactLayout";
import { Alert } from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";

const TroopsPage = () => {
    return (
        <ReactLayout>
            <Alert.Root status="info">
                <Alert.Indicator>
                    <LuInfo />
                </Alert.Indicator>
                <Alert.Title>Troop calculator coming soon!</Alert.Title>
            </Alert.Root>
        </ReactLayout>
    );
};

export default TroopsPage;
