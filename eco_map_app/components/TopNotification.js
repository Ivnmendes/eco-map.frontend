import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const NOTIFICATION_VISIBLE_Y = 40
const NOTIFICATION_HIDDEN_Y = -150; 
const DISMISS_THRESHOLD_Y = -15;  

const TopNotification = ({ message, type, visible, onDismiss }) => {
  const translateY = useSharedValue(NOTIFICATION_HIDDEN_Y);

  const dismiss = () => {
    'worklet';
    runOnJS(onDismiss)();
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newY = event.translationY + NOTIFICATION_VISIBLE_Y;
      translateY.value = Math.min(newY, NOTIFICATION_VISIBLE_Y);
    })
    .onEnd(() => {
      if (translateY.value < DISMISS_THRESHOLD_Y) {
        translateY.value = withTiming(NOTIFICATION_HIDDEN_Y, { duration: 200 }, () => {
          dismiss();
        });
      } else {
        translateY.value = withTiming(NOTIFICATION_VISIBLE_Y, { duration: 400 });
      }
    });

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(NOTIFICATION_VISIBLE_Y, { duration: 400 });
      
      const timer = setTimeout(() => {
        translateY.value = withTiming(NOTIFICATION_HIDDEN_Y, { duration: 200 }, () => {
          dismiss();
        });
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!visible) {
    return null;
  }

  const backgroundColor = type === 'success' ? '#28a745' : '#dc3545';

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, { backgroundColor }, animatedStyle]}>
        <View style={styles.handle} />
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: (width - (width * 0.9)) / 2,
    width: '90%',
    padding: 15,
    borderRadius: 12,
    zIndex: 1000,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 2.5,
    position: 'absolute',
    bottom: 8,
  },
});

export default TopNotification;