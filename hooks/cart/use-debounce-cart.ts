import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';

type TimeoutId = ReturnType<typeof setTimeout> | number;

export default function useDebouncedCart() {
    const timersRef = useRef<Record<string, TimeoutId>>({});
    const pendingOperationsRef = useRef<Record<string, AbortController>>({});

    const debounce = useCallback((
        cartId: string,
        callback: () => Promise<void>,
        delay = 500
    ): Promise<void> => {
        if (timersRef.current[cartId]) {
            if (Platform.OS === 'web') {
                if (typeof timersRef.current[cartId] === 'number') {
                    throw new Error('timersRef.current[cartId] is not a NodeJS.Timeout');
                }
                clearTimeout(timersRef.current[cartId] as NodeJS.Timeout);
            } else {
                if (typeof timersRef.current[cartId] !== 'number') {
                    throw new Error('timersRef.current[cartId] is not a number');
                }
                clearTimeout(timersRef.current[cartId]);
            }
        }

        if (pendingOperationsRef.current[cartId]) {
            pendingOperationsRef.current[cartId].abort();
        }

        const controller = new AbortController();
        pendingOperationsRef.current[cartId] = controller;

        return new Promise<void>((resolve, reject) => {
            const timerId = setTimeout(async () => {
                try {
                    if (controller.signal.aborted) {
                        reject(new Error('Operation cancelled'));
                        return;
                    }

                    await callback();
                    resolve();
                } catch (error) {
                    if (error instanceof DOMException && error.name === 'AbortError') {
                        reject(new Error('Operation cancelled'));
                    } else {
                        reject(error);
                    }
                } finally {
                    delete timersRef.current[cartId];
                    delete pendingOperationsRef.current[cartId];
                }
            }, delay);

            timersRef.current[cartId] = timerId;
        });
    }, []);

    const cancel = useCallback((cartId: string) => {
        if (timersRef.current[cartId]) {
            if (Platform.OS === 'web') {
                if (typeof timersRef.current[cartId] === 'number') {
                    throw new Error('timersRef.current[cartId] is not a NodeJS.Timeout');
                }
                clearTimeout(timersRef.current[cartId] as NodeJS.Timeout);
            } else {
                if (typeof timersRef.current[cartId] !== 'number') {
                    throw new Error('timersRef.current[cartId] is not a number');
                }
                clearTimeout(timersRef.current[cartId]);
            }
            delete timersRef.current[cartId];
        }

        if (pendingOperationsRef.current[cartId]) {
            pendingOperationsRef.current[cartId].abort();
            delete pendingOperationsRef.current[cartId];
        }
    }, []);

    const cancelAll = useCallback(() => {
        Object.values(timersRef.current).forEach((timerId: unknown) => {
            if (Platform.OS === 'web') {
                clearTimeout(timerId as NodeJS.Timeout);
            } else {
                clearTimeout(timerId as number);
            }
        });
        timersRef.current = {};

        Object.values(pendingOperationsRef.current).forEach(controller => {
            controller.abort();
        });
        pendingOperationsRef.current = {};
    }, []);

    const hasPendingOperation = useCallback((cartId: string): boolean => {
        return cartId in timersRef.current;
    }, []);

    const getPendingOperations = useCallback((): string[] => {
        return Object.keys(timersRef.current);
    }, []);

    return {
        debounce,
        cancel,
        cancelAll,
        hasPendingOperation,
        getPendingOperations
    };
}

export function useAdvancedDebounce() {
    const baseDebounce = useDebouncedCart();
    const retryCountRef = useRef<Record<string, number>>({});
    const maxRetries = 3;

    const debounceWithRetry = useCallback((
        cartId: string,
        callback: () => Promise<void>,
        delay = 500,
        retryDelay = 1000
    ): Promise<void> => {
        return new Promise<void>(async (resolve, reject) => {
            let retryAttempt = retryCountRef.current[cartId] || 0;

            const attempt = async () => {
                try {
                    await baseDebounce.debounce(cartId, callback, delay);
                    delete retryCountRef.current[cartId];
                    resolve();
                } catch (error) {
                    retryAttempt++;
                    retryCountRef.current[cartId] = retryAttempt;

                    if (retryAttempt <= maxRetries) {
                        setTimeout(() => {
                            attempt();
                        }, retryDelay * retryAttempt);
                    } else {
                        delete retryCountRef.current[cartId];
                        reject(error);
                    }
                }
            };

            attempt();
        });
    }, [baseDebounce]);

    return {
        ...baseDebounce,
        debounce: debounceWithRetry,
    };
}