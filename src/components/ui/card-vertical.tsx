/** @format */

import { Box, Card, HStack, Image, Link } from "@chakra-ui/react";

const CardVertical = ({
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
}) => {
    return (
        <Link href={href} variant="plain" _hover={{ textDecoration: "none", boxShadow: "md" }}>
            <Card.Root maxW="sm" overflow="hidden" variant="elevated" asChild>
                <Box>
                    <Image src={img} alt={alt} width="100%" height="auto" />
                    <Card.Body>
                        <Card.Title mb="2">{title}</Card.Title>
                        <Card.Description>{description}</Card.Description>

                        {!!badges && <HStack mt="4">{badges}</HStack>}
                    </Card.Body>
                </Box>
            </Card.Root>
        </Link>
    );
};
export default CardVertical;
