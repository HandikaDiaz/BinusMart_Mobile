import { OrderStatusT, type Cart } from '@/constants/type';
import { formatDate } from '@/utils/index';
import { Clock } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import * as Progress from 'react-native-progress';

interface OrderTimelineProps {
    order: Cart;
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
    const getStatusSteps = () => {
        const statusOrder = [
            OrderStatusT.PENDING,
            OrderStatusT.PROCESSING,
            OrderStatusT.SHIPPED,
            OrderStatusT.DELIVERED,
        ];

        const currentStatusIndex = statusOrder.findIndex(status => status === order.status);
        const isCancelled = order.status === OrderStatusT.CANCELLED;

        const steps = [
            {
                status: OrderStatusT.PENDING,
                label: 'Order Placed',
                date: order.createdAt,
                completed: true,
                cancelled: false,
            },
            {
                status: OrderStatusT.PROCESSING,
                label: 'Processing',
                date: order.paidAt || undefined,
                completed: currentStatusIndex >= 1 || isCancelled,
                cancelled: isCancelled,
            },
            {
                status: OrderStatusT.SHIPPED,
                label: 'Shipped',
                date: order.updatedAt || order.deliveredAt || undefined,
                completed: currentStatusIndex >= 2,
                cancelled: isCancelled,
            },
            {
                status: OrderStatusT.DELIVERED,
                label: 'Delivered',
                date: order.deliveredAt || undefined,
                completed: currentStatusIndex >= 3,
                cancelled: isCancelled,
            },
        ];

        return steps;
    };

    const steps = getStatusSteps();
    const completedSteps = steps.filter(step => step.completed).length;
    const totalSteps = steps.length;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) : 0;
    const isCancelled = order.status === OrderStatusT.CANCELLED;

    return (
        <View>
            <View style={styles.header}>
                <Clock size={16} color="#4b5563" />
                <Text style={styles.title}>Order Timeline</Text>
            </View>

            {isCancelled ? (
                <View style={styles.cancelledContainer}>
                    <Text style={styles.cancelledTitle}>Order Cancelled</Text>
                    {order.updatedAt && (
                        <Text style={styles.cancelledDate}>
                            Cancelled on {formatDate(new Date(order.updatedAt))}
                        </Text>
                    )}
                </View>
            ) : (
                <Progress.Bar
                    progress={progress}
                    width={null}
                    height={6}
                    color="#3b82f6"
                    unfilledColor="#e5e7eb"
                    borderWidth={0}
                    style={styles.progress}
                />
            )}

            <View style={styles.timeline}>
                {steps.map((step, index) => {
                    const isCompleted = step.completed && !step.cancelled;
                    const isCurrent = step.status === order.status && !isCancelled;

                    return (
                        <View key={step.status} style={styles.step}>
                            <View style={[
                                styles.stepIndicator,
                                isCancelled && styles.stepCancelled,
                                isCompleted && styles.stepCompleted,
                                isCurrent && styles.stepCurrent,
                            ]}>
                                <Text style={[
                                    styles.stepNumber,
                                    isCancelled && styles.stepNumberCancelled,
                                    isCompleted && styles.stepNumberCompleted,
                                    isCurrent && styles.stepNumberCurrent,
                                ]}>
                                    {isCancelled ? '✕' : isCompleted ? '✓' : index + 1}
                                </Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={[
                                    styles.stepLabel,
                                    isCancelled && styles.stepLabelCancelled,
                                    isCompleted && styles.stepLabelCompleted,
                                ]}>
                                    {step.label}
                                    {step.cancelled && step.status !== OrderStatusT.PENDING && " (Cancelled)"}
                                </Text>
                                {step.date && !step.cancelled && (
                                    <Text style={styles.stepDate}>
                                        {formatDate(new Date(step.date))}
                                    </Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>

            {order.status === OrderStatusT.SHIPPED && !order.deliveredAt && (
                <View style={styles.shippedContainer}>
                    <Text style={styles.shippedTitle}>Your order is on the way!</Text>
                    <Text style={styles.shippedText}>
                        Estimated delivery: {order.deliveredAt
                            ? formatDate(new Date(order.deliveredAt))
                            : "Within 3-5 business days"}
                    </Text>
                </View>
            )}

            {order.status === OrderStatusT.DELIVERED && order.deliveredAt && (
                <View style={styles.deliveredContainer}>
                    <Text style={styles.deliveredTitle}>Order delivered successfully!</Text>
                    <Text style={styles.deliveredText}>
                        Delivered on {formatDate(new Date(order.deliveredAt))}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    progress: {
        marginBottom: 16,
    },
    cancelledContainer: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    cancelledTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#991b1b',
        marginBottom: 4,
    },
    cancelledDate: {
        fontSize: 12,
        color: '#dc2626',
    },
    timeline: {
        gap: 16,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    stepIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepCancelled: {
        backgroundColor: '#fee2e2',
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    stepCompleted: {
        backgroundColor: '#3b82f6',
    },
    stepCurrent: {
        backgroundColor: '#3b82f6',
        borderWidth: 2,
        borderColor: '#1d4ed8',
    },
    stepNumber: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
    },
    stepNumberCancelled: {
        color: '#dc2626',
    },
    stepNumberCompleted: {
        color: 'white',
    },
    stepNumberCurrent: {
        color: 'white',
    },
    stepContent: {
        flex: 1,
    },
    stepLabel: {
        fontSize: 14,
        color: '#111827',
        marginBottom: 2,
    },
    stepLabelCancelled: {
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },
    stepLabelCompleted: {
        fontWeight: '500',
    },
    stepDate: {
        fontSize: 12,
        color: '#6b7280',
    },
    shippedContainer: {
        backgroundColor: '#eff6ff',
        borderWidth: 1,
        borderColor: '#dbeafe',
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
    },
    shippedTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1e40af',
        marginBottom: 4,
    },
    shippedText: {
        fontSize: 12,
        color: '#3b82f6',
    },
    deliveredContainer: {
        backgroundColor: '#f0fdf4',
        borderWidth: 1,
        borderColor: '#bbf7d0',
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
    },
    deliveredTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#065f46',
        marginBottom: 4,
    },
    deliveredText: {
        fontSize: 12,
        color: '#10b981',
    },
});