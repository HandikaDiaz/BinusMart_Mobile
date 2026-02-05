import { useRouter } from 'expo-router';
import { ShoppingBag, ShoppingCart } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OrdersHeader() {
    const router = useRouter();

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.title}>My Orders</Text>
                        <Text style={styles.description}>
                            Track, return, or buy things again from your orders
                        </Text>
                    </View>
                    <View style={styles.buttonCard}>
                        <TouchableOpacity
                            style={styles.buttonCart}
                            onPress={() => router.push('/')}
                        >
                            <ShoppingCart size={16} color="white" />
                            <Text style={styles.buttonText}>My Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonShopping}
                            onPress={() => router.push('/')}
                        >
                            <ShoppingBag size={16} color="white" />
                            <Text style={styles.buttonText}>Continue Shopping</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    content: {
        padding: 20,
    },
    headerRow: {
        gap: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
    },
    buttonCard: {
        width: '100%',
        flexDirection: 'row',
        gap: 12,
    },
    buttonCart: {
        width: '48.5%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonShopping: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
});