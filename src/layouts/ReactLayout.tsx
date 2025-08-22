/** @format */

import Navigation from "@/components/Navigation/Navigation";
import { Provider } from "@/components/ui/provider";
import { Box } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

const ReactLayout = ({ children }: PropsWithChildren) => {
    return (
        <Provider>
            <Box
                display="flex"
                flexDirection="column"
                mx="auto"
                mb={4}
                px={{ base: 4 }}
                maxW="1280px"
            >
                <Navigation />
                {children}
            </Box>
        </Provider>
    );
};

export default ReactLayout;
