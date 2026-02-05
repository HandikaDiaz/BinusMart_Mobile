import { Link } from 'expo-router';
import { ShoppingCart, TrendingUp } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CartEmptyState() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Shopping Cart</Text>
                <Text style={styles.headerSubtitle}>Your cart is waiting to be filled</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Your cart is empty</Text>
                    <Text style={styles.cardDescription}>
                        Looks like you haven't added any items to your cart yet.
                    </Text>
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                        <ShoppingCart size={48} color="#3b82f6" />
                    </View>

                    <View style={styles.buttonsContainer}>
                        <Link href="/" asChild>
                            <TouchableOpacity style={styles.primaryButton}>
                                <TrendingUp size={16} color="white" />
                                <Text style={styles.primaryButtonText}>Continue Shopping</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
    cardContent: {
        alignItems: 'center',
        gap: 24,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#dbeafe',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#3b82f6',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 6,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 6,
    },
    secondaryButtonText: {
        fontSize: 16,
        color: '#374151',
    },
});