/** @format */

import ReactLayout from "@/layouts/ReactLayout";
import { Text } from "@chakra-ui/react";

import ShortLinks from "./ShortLinks";

const HomePage = () => {
    return (
        <ReactLayout>
            <Text textStyle="3xl" fontWeight="bold">
                Welcome to Kingdom 351!
            </Text>

            {/* <Alert.Root status="warning" mt={4}>
                <Alert.Indicator>
                    <LuConstruction />
                </Alert.Indicator>
                <Alert.Title>This is a website under construction.</Alert.Title>
            </Alert.Root> */}

            <ShortLinks />
        </ReactLayout>
    );
};

export default HomePage;
