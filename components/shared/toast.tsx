import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleProp, Text, View, ViewStyle } from "react-native";

export type ToastType = "success" | "error" | "info";
export interface ToastMessage {
  message: string;
  type: ToastType;
  duration?: number;
}

// Subscribers store
const subscribers = new Set<(toast: ToastMessage) => void>();

// Core show function
function showToast(message: string, type: ToastType, duration = 3000) {
  const toast: ToastMessage = { message, type, duration };
  subscribers.forEach((cb) => cb(toast));
}

export const toast = {
  success: (msg: string, duration?: number) =>
    showToast(msg, "success", duration),
  error: (msg: string, duration?: number) => showToast(msg, "error", duration),
  info: (msg: string, duration?: number) => showToast(msg, "info", duration),
};

// Toast type configurations
const toastConfig = {
  success: {
    bgColor: "bg-green-500",
    textColor: "text-white",
    borderColor: "border-green-600",
    icon: "✓",
    shadowColor: "shadow-green-500/25",
  },
  error: {
    bgColor: "bg-red-500",
    textColor: "text-white",
    borderColor: "border-red-600",
    icon: "✕",
    shadowColor: "shadow-red-500/25",
  },
  info: {
    bgColor: "bg-amber-500",
    textColor: "text-white",
    borderColor: "border-amber-400",
    icon: "ⓘ",
    shadowColor: "shadow-amber-500/25",
  },
};

export const ToastContainer: React.FC = () => {
  const [current, setCurrent] = useState<ToastMessage | null>(null);
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  // Subscribe on mount
  useEffect(() => {
    const handler = (toast: ToastMessage) => setCurrent(toast);
    subscribers.add(handler);
    return () => {
      subscribers.delete(handler);
    };
  }, []);

  // Animate whenever current changes
  useEffect(() => {
    if (!current) return;

    // Enhanced entrance animation
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      // Enhanced exit animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrent(null);
        // Reset values for next toast
        translateY.setValue(100);
        opacity.setValue(0);
        scale.setValue(0.8);
      });
    }, current.duration);

    return () => clearTimeout(timer);
  }, [current, translateY, opacity, scale]);

  if (!current) return null;

  const config = toastConfig[current.type];

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          // bottom: 100,
          top: 60,
          left: 16,
          right: 16,
          transform: [{ translateY }, { scale }],
          opacity,
          zIndex: 1000,
        } as StyleProp<ViewStyle>,
      ]}
    >
      <View
        className={`
          ${config.bgColor} 
          rounded-2xl 
          border-2
          border-border 
          shadow-lg 
          ${config.shadowColor}
          mx-2
        `}
        style={{
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View className='flex-row items-center px-4 py-2.5'>
          {/* Icon */}
          <View className='mr-3'>
            <Text className='text-white text-lg font-bold'>{config.icon}</Text>
          </View>

          {/* Message */}
          <View className='flex-1 '>
            <Text
              className={`${config.textColor} font-semibold text-sm leading-5`}
              numberOfLines={2}
            >
              {current.message}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
      </View>
    </Animated.View>
  );
};
