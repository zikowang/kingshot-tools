/** @format */

import { HStack, Image, Link, Text, VStack } from "@chakra-ui/react";

const navigationItems = [
    {
        label: "Calendar",
        href: "/calendar",
    },
];

const Navigation = () => {
    const pathname = window.location.pathname;
    console.log(pathname);
    return (
        <HStack justifyContent="space-between" mb={4}>
            <Link href="/" textDecoration="none">
                <VStack gap={0}>
                    <Image src="/img/kingshot-logo.webp" width={200} />
                    <HStack gap={0} alignItems="baseline">
                        <Text fontWeight="bold" color="orange">
                            FAN
                        </Text>
                        <Text>made</Text>
                    </HStack>
                </VStack>
            </Link>

            <HStack gap={4}>
                {navigationItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        fontWeight="bold"
                        color={pathname === item.href ? "orange" : "inherit"}
                    >
                        {item.label}
                    </Link>
                ))}
                {/* <Link href="/calculators/troops">Troops Calculator</Link> */}
            </HStack>
        </HStack>
    );
};

export default Navigation;
