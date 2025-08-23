/** @format */

import CardVertical from "@/components/ui/card-vertical";
import { useColorMode } from "@/components/ui/color-mode";
import { Badge, Stack } from "@chakra-ui/react";

const ShortLinks = () => {
    const { colorMode } = useColorMode();

    return (
        <Stack gap={4} alignItems="flex-start" direction="row" wrap="wrap" mt={8}>
            <CardVertical
                title="Calendar"
                img={`/img/kingshot-calendar.png`}
                alt="calender teaser image"
                description="Useful overview of all upcoming events and their schedule."
                href="/calendar"
                badges={
                    <>
                        <Badge colorPalette="blue">Events</Badge>
                        <Badge colorPalette="green">Planning</Badge>
                    </>
                }
            />

            <CardVertical
                title="Troop Calculator"
                img={`/img/kingshot-archer.png`}
                alt="troops calculator teaser image"
                description="Find out how many speed ups and resources you need for your troop training and promotions."
                href="/calculators/troop"
                badges={
                    <>
                        <Badge colorPalette="red">Troops</Badge>
                        <Badge colorPalette="purple">Calculator</Badge>
                    </>
                }
            />
        </Stack>
    );
};

export default ShortLinks;
