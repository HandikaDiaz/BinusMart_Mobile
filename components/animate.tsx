import { RefreshCw } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface SpinningIconProps {
    size: number;
    color: string;
    spinning: boolean;
}

export const SpinningIcon: React.FC<SpinningIconProps> = ({ size, color, spinning }) => {
    const spinAnimation = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        if (spinning) {
            animationRef.current = Animated.loop(
                Animated.timing(spinAnimation, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            );
            animationRef.current.start();
        } else {
            if (animationRef.current) {
                animationRef.current.stop();
            }
            spinAnimation.setValue(0);
        }

        return () => {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, [spinning, spinAnimation]);

    const spin = spinAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <RefreshCw size={size} color={color} />
        </Animated.View>
    );
};
