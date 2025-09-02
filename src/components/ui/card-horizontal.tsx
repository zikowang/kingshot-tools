/** @format */

import { Box, Card, HStack, Image, Link } from "@chakra-ui/react";

export const CardHorizontal = ({
    title,
    description,
    img,
    alt,
    href,
    badges,
}: {
    title: string;
    description: string;
    img: string;
    alt: string;
    href: string;
    badges?: React.ReactNode;
}) => (
    <Link
        href={href}
        variant="plain"
        width="100%"
        _hover={{ textDecoration: "none", boxShadow: "md" }}
    >
        <Card.Root flexDirection="row" overflow="hidden" width="100%" asChild variant="elevated">
            <Box>
                <Image objectFit="cover" maxW="150px" src={img} alt={alt} />
                <Box>
                    <Card.Body>
                        <Card.Title mb="2">{title}</Card.Title>
                        <Card.Description>{description}</Card.Description>

                        {!!badges && <HStack mt="4">{badges}</HStack>}
                    </Card.Body>
                </Box>
            </Box>
        </Card.Root>
    </Link>
);
