/** @format */

import ReactLayout from "@/layouts/ReactLayout";
import { Button, HStack, Text } from "@chakra-ui/react";

const Test = () => <div>test</div>;

const TroopsPage = () => {
    return (
        <ReactLayout>
            <Text>Troops</Text>
            <HStack>
                <Button>Click me</Button>
                <Button>Click me</Button>
            </HStack>
        </ReactLayout>
    );
};

export default TroopsPage;
