import { useRouter } from 'expo-router';
import { MessageSquare, RefreshCw, Truck } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HelpSection() {
    const router = useRouter();

    const helpItems = [
        {
            icon: Truck,
            title: 'Track Your Order',
            description: 'Use the track button next to shipped orders to see real-time delivery updates.',
            buttonText: 'Learn More',
            onPress: () => router.push('/tracking'),
        },
        {
            icon: RefreshCw,
            title: 'Return or Exchange',
            description: 'Most items can be returned within 30 days of delivery.',
            buttonText: 'Start a Return',
            onPress: () => router.push('/returns'),
        },
        {
            icon: MessageSquare,
            title: 'Contact Seller',
            description: 'Have questions about your order? Contact the seller directly.',
            buttonText: 'Contact Support',
            onPress: () => router.push('/contact'),
        },
    ];

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Need Help with Your Orders?</Text>
                <Text style={styles.description}>
                    We're here to help you with any questions about your orders
                </Text>
            </View>
            <View style={styles.content}>
                <View style={styles.grid}>
                    {helpItems.map((item, index) => (
                        <View key={index} style={styles.helpItem}>
                            <View style={styles.iconContainer}>
                                <item.icon size={20} color="#3b82f6" />
                            </View>
                            <Text style={styles.helpTitle}>{item.title}</Text>
                            <Text style={styles.helpDescription}>{item.description}</Text>
                            <TouchableOpacity
                                style={styles.helpButton}
                                onPress={item.onPress}
                            >
                                <Text style={styles.helpButtonText}>{item.buttonText}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
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
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
    },
    content: {
        padding: 20,
    },
    grid: {
        gap: 24,
    },
    helpItem: {
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    helpDescription: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    helpButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
    },
    helpButtonText: {
        fontSize: 14,
        color: '#374151',
    },
});