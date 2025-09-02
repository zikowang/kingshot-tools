/** @format */

import { Portal, Select, type ListCollection } from "@chakra-ui/react";

const CustomSelect = ({
    label,
    placeholder,
    value,
    options,
    onChange,
}: {
    label: string;
    placeholder: string;
    value: string;
    options: ListCollection<{ label: string; value: string }>;
    onChange: (value: string) => void;
}) => {
    return (
        <Select.Root
            value={[value]}
            onValueChange={(e) => {
                const [value] = e.value;

                onChange(value);
            }}
            collection={options}
            required
        >
            <Select.HiddenSelect />
            <Select.Label>{label}</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder={placeholder} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content maxHeight="200px" overflowY="auto">
                        {options.items.map((tier) => {
                            return (
                                <Select.Item item={tier} key={tier.value}>
                                    {tier.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            );
                        })}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

export default CustomSelect;
