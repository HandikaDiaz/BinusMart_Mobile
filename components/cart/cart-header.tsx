import type { Cart } from '@/constants/type';
import { Link } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CartHeaderProps {
    cart: Cart[];
    selectedCount: number;
    onCheckout: () => void;
    isCheckingOut: boolean;
}

export default function CartHeader({
    cart,
    selectedCount,
    onCheckout,
    isCheckingOut,
}: CartHeaderProps) {
    return (
        <View style={styles.card}>
            <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Shopping Cart</Text>
                    <Text style={styles.description}>
                        {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
                        {selectedCount > 0 && ` • ${selectedCount} selected`}
                    </Text>
                </View>

                <View style={styles.actionsContainer}>
                    <Link href="/" asChild>
                        <TouchableOpacity style={styles.continueShoppingButton}>
                            <ArrowLeft size={16} color="#374151" />
                            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
                        </TouchableOpacity>
                    </Link>

                    <TouchableOpacity
                        style={[
                            styles.checkoutButton,
                            (selectedCount === 0 || isCheckingOut) && styles.checkoutButtonDisabled
                        ]}
                        onPress={onCheckout}
                        disabled={selectedCount === 0 || isCheckingOut}
                    >
                        <Lock size={16} color="white" />
                        <Text style={styles.checkoutButtonText}>
                            {isCheckingOut ? 'Processing...' : 'Checkout'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    headerContent: {
        paddingBottom: 12,
    },
    titleContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
    },
    continueShoppingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
    },
    continueShoppingText: {
        fontSize: 14,
        color: '#374151',
    },
    checkoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#3b82f6',
        borderRadius: 6,
    },
    checkoutButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    checkoutButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
});