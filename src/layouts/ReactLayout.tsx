/** @format */

import Navigation from "@/components/Navigation/Navigation";
import { Provider } from "@/components/ui/provider";
import type { PropsWithChildren } from "react";

const ReactLayout = ({ children }: PropsWithChildren) => {
    return (
        <Provider>
            <Navigation />
            {children}
        </Provider>
    );
};

export default ReactLayout;
