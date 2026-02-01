import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PromotionCard() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Special Weekend Sale!</Text>
                <Text style={styles.description}>
                    Get up to 50% off on selected items. Limited time offer. Shop now before it's gone!
                </Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Shop the Sale</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#8b5cf6',
        borderRadius: 16,
        margin: 16,
        marginTop: 8,
        overflow: 'hidden',
    },
    content: {
        padding: 24,
        maxWidth: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 20,
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8b5cf6',
    },
});