import { useRouter } from 'expo-router';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Mock cart data
const initialCartItems = [
    { id: '1', name: 'Laptop Gaming', price: 15000000, quantity: 1, image: 'https://via.placeholder.com/100' },
    { id: '2', name: 'Smartphone', price: 8000000, quantity: 2, image: 'https://via.placeholder.com/100' },
    { id: '3', name: 'Headphone', price: 1200000, quantity: 1, image: 'https://via.placeholder.com/100' },
];

export default function CartScreen() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState(initialCartItems);

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // const proceedToCheckout = () => {
    //     router.push('/orders');
    // };

    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <ShoppingBag size={64} color="#9ca3af" />
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <TouchableOpacity
                    style={styles.shopButton}
                    // onPress={() => router.push('/product')}
                >
                    <Text style={styles.shopButtonText}>Start Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.cartList}>
                {cartItems.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />

                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>
                                Rp {item.price.toLocaleString('id-ID')}
                            </Text>

                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, -1)}
                                    style={styles.quantityButton}
                                >
                                    <Minus size={16} color="#6b7280" />
                                </TouchableOpacity>

                                <Text style={styles.quantityText}>{item.quantity}</Text>

                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, 1)}
                                    style={styles.quantityButton}
                                >
                                    <Plus size={16} color="#6b7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.itemActions}>
                            <Text style={styles.itemTotal}>
                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => removeItem(item.id)}
                                style={styles.deleteButton}
                            >
                                <Trash2 size={20} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Checkout Summary */}
            <View style={styles.checkoutContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>
                        Rp {getTotal().toLocaleString('id-ID')}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>Rp 20,000</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                        Rp {(getTotal() + 20000).toLocaleString('id-ID')}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.checkoutButton}
                    // onPress={proceedToCheckout}
                >
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#6b7280',
        marginVertical: 16,
    },
    shopButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    shopButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cartList: {
        flex: 1,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '500',
        marginHorizontal: 12,
        minWidth: 24,
        textAlign: 'center',
    },
    itemActions: {
        alignItems: 'flex-end',
        gap: 8,
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    deleteButton: {
        padding: 4,
    },
    checkoutContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    summaryValue: {
        fontSize: 14,
        color: '#111827',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e40af',
    },
    checkoutButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});