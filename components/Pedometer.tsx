import { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Animated, 
  PanResponder,
  Dimensions,
} from 'react-native';
import { Pedometer } from 'expo-sensors';

const MILESTONES = [
  { steps: 100, message: "Great start! You've taken your first 100 steps!" },
  { steps: 1000, message: "You're on a roll! 1,000 steps completed!" },
  { steps: 5000, message: "Halfway there! Keep going!" },
  { steps: 10000, message: "Amazing! You've hit your 10,000 steps goal! 🎉" },
] as const;

const MIN_HEIGHT = 280; // Minimum height in pixels
const MAX_HEIGHT = Dimensions.get('window').height * 0.75; // 75% of screen height

export default function PedometerComponent() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const achievedMilestones = useRef<Set<number>>(new Set());
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (gesture.dy < 0 || isExpanded) {
        pan.setValue(gesture.dy);
      }
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -50 && !isExpanded) {
        // Expand
        Animated.spring(pan, {
          toValue: -Dimensions.get('window').height * 0.5,
          useNativeDriver: false,
        }).start();
        setIsExpanded(true);
      } else if (gesture.dy > 50 && isExpanded) {
        // Collapse
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
        setIsExpanded(false);
      } else {
        // Return to original position
        Animated.spring(pan, {
          toValue: isExpanded ? -Dimensions.get('window').height * 0.5 : 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const checkMilestones = (steps: number) => {
    MILESTONES.forEach(({ steps: milestone }) => {
      if (steps >= milestone) {
        achievedMilestones.current.add(milestone);
      }
    });
  };

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
        checkMilestones(result.steps);
      });
    }
  };

  useEffect(() => {
    let subscription: Pedometer.Subscription | undefined;
    
    const start = async () => {
      subscription = await subscribe();
    };
    
    start();
    
    return () => subscription?.remove();
  }, []);

  const nextMilestone = MILESTONES.find(m => m.steps > currentStepCount)?.steps || 'Max';
  const stepsToNextMilestone = nextMilestone === 'Max' ? 0 : nextMilestone - currentStepCount;

  const containerHeight = pan.interpolate({
    inputRange: [-Dimensions.get('window').height * 0.5, 0],
    outputRange: [MAX_HEIGHT, MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[styles.container, { height: containerHeight }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.card}>
        <View style={styles.dragIndicator} />
        <Text style={styles.title}>Step Counter</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentStepCount}</Text>
            <Text style={styles.statLabel}>Current Steps</Text>
            {stepsToNextMilestone > 0 && (
              <Text style={styles.nextMilestone}>
                {stepsToNextMilestone} steps to next milestone
              </Text>
            )}
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statusText}>
              Status: {isPedometerAvailable === 'true' ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.milestonesContainer}>
            <Text style={styles.milestonesTitle}>Milestones</Text>
            {MILESTONES.map(({ steps, message }) => (
              <View 
                key={steps} 
                style={[
                  styles.milestoneItem,
                  achievedMilestones.current.has(steps) && styles.achievedMilestone
                ]}
              >
                <Text style={styles.milestoneSteps}>{steps} Steps</Text>
                <Text style={styles.milestoneMessage}>{message}</Text>
                {achievedMilestones.current.has(steps) && (
                  <Text style={styles.achievedCheck}>✓</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 80, // Add padding to account for tab bar
    minHeight: MIN_HEIGHT,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  statsContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  nextMilestone: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  milestonesContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  milestonesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    opacity: 0.6,
  },
  achievedMilestone: {
    opacity: 1,
    backgroundColor: '#f8f8f8',
  },
  milestoneSteps: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    width: 100,
  },
  milestoneMessage: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  achievedCheck: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 10,
  },
});
