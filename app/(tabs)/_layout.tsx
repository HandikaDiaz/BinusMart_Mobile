import NavbarMobileMenu from "@/components/navbar/nav-mobile-menu";
import Navbar from "@/components/navbar/navbar";
import { useAuth } from "@/hooks/auth/use-auth";
import { Tabs } from 'expo-router';
import { Home, Package, ShoppingBag, ShoppingCart } from 'lucide-react-native';
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
    const { user, logout } = useAuth();
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    return (
        <View style={styles.container}>
            <Navbar />

            <Tabs
                screenOptions={{
                    tabBarStyle: { display: 'none' },
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="product/index"
                    options={{
                        title: 'Products',
                        tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="cart/index"
                    options={{
                        title: 'Cart',
                        tabBarIcon: ({ color, size }) => <ShoppingCart size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="orders/index"
                    options={{
                        title: 'Orders',
                        tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
                    }}
                />
            </Tabs>

            <NavbarMobileMenu
                visible={mobileMenuVisible}
                user={user}
                onClose={() => setMobileMenuVisible(false)}
                onLogout={logout}
                onOpenAuthModal={(tab) => {
                    setMobileMenuVisible(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
});