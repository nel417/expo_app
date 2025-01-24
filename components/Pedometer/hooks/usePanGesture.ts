import { PanResponder, Dimensions, Animated } from 'react-native';

interface PanGestureProps {
  pan: Animated.Value;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export function usePanGesture({ pan, isExpanded, setIsExpanded }: PanGestureProps) {
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (gesture.dy < 0 || isExpanded) {
        pan.setValue(gesture.dy);
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -50 && !isExpanded) {
        Animated.spring(pan, {
          toValue: -Dimensions.get('window').height * 0.5,
          useNativeDriver: false,
        }).start();
        setIsExpanded(true);
      } else if (gesture.dy > 50 && isExpanded) {
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
        setIsExpanded(false);
      } else {
        Animated.spring(pan, {
          toValue: isExpanded ? -Dimensions.get('window').height * 0.5 : 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });
} 