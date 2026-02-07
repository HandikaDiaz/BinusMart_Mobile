import { Link } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function NavbarLogo() {
    return (
        <View style={styles.container}>
            <Link href={'/(tabs)'} style={styles.logoContainer}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoIcon}>
                        <Image source={require('../../assets/images/android-icon-foreground.png')} style={{ width: 50, height: 50, backgroundColor: 'transparent' }}  />
                    </View>
                    <Text style={styles.logoText}>BINUSmart</Text>
                </View>
            </Link>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        borderRadius: 8,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
});