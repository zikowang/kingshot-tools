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
                px={{ base: 4 }}
                maxW="1280px"
                pb={8}
            >
                <Navigation />
                {children}
            </Box>
        </Provider>
    );
};

export default ReactLayout;
