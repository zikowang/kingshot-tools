/** @format */

import { HStack, Link } from "@chakra-ui/react";

const Navigation = () => {
    return (
        <HStack>
            <Link href="/">Home</Link>
            <Link href="/calendar">Calendar</Link>
            <Link href="/calculators/troops">Troops Calculator</Link>
        </HStack>
    );
};

export default Navigation;
