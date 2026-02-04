import type { Variants } from '@/constants/type';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import VariantInput from './variant-input';

interface ProductVariantsSectionProps {
    variants: Variants[];
    onRemoveVariant: (index: number) => void;
    onVariantChange: (index: number, field: keyof Variants, value: string | number) => void;
};

export default function ProductVariantsSection({
    variants,
    onRemoveVariant,
    onVariantChange,
}: ProductVariantsSectionProps) {
    return (
        <View style={styles.container}>
            {variants.map((variant, index) => (
                <VariantInput
                    key={index}
                    index={index}
                    variant={variant}
                    canRemove={variants.length > 1}
                    onRemoveVariant={onRemoveVariant}
                    onVariantChange={onVariantChange}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
});