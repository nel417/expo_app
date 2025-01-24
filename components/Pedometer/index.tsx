import { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, Animated, PanResponder, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { usePedometer } from '@/context/PedometerContext';
import { activeComponentAtom } from '@/store/atoms';
import { MilestoneList } from './MilestoneList';
import { showMilestoneAlert } from './MilestoneAlert';
import { MILESTONES, MIN_HEIGHT, MAX_HEIGHT } from './constants';
import { StatsDisplay } from './StatsDisplay';
import { usePanGesture } from './hooks/usePanGesture';

export default function PedometerComponent() {
  const router = useRouter();
  const { isPedometerAvailable, currentStepCount, achievedMilestones } = usePedometer();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAlertShowing, setIsAlertShowing] = useState(false);
  const setActiveComponent = useSetAtom(activeComponentAtom);
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = usePanGesture({ pan, isExpanded, setIsExpanded });

  useEffect(() => {
    if (isAlertShowing) return;

    MILESTONES.forEach(({ steps }) => {
      if (currentStepCount >= steps && !achievedMilestones.has(steps)) {
        setIsAlertShowing(true);
        achievedMilestones.add(steps);
        
        showMilestoneAlert({
          steps,
          onDismiss: () => setIsAlertShowing(false),
          onWriteNote: (note) => {
            setActiveComponent('note');
            router.setParams({ promptedNote: JSON.stringify(note) });
          }
        });
      }
    });
  }, [currentStepCount, isAlertShowing]);

  const containerHeight = useMemo(() => 
    pan.interpolate({
      inputRange: [-Dimensions.get('window').height * 0.5, 0],
      outputRange: [MAX_HEIGHT, MIN_HEIGHT],
      extrapolate: 'clamp',
    })
  , []);

  return (
    <Animated.View 
      style={[styles.container, { height: containerHeight }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.card}>
        <View style={styles.dragIndicator} />
        <Text style={styles.title}>Step Counter</Text>
        <StatsDisplay 
          currentStepCount={currentStepCount}
          isPedometerAvailable={isPedometerAvailable}
          nextMilestone={MILESTONES.find(m => m.steps > currentStepCount)?.steps}
        />
        {isExpanded && (
          <MilestoneList achievedMilestones={achievedMilestones} />
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
    paddingBottom: 80,
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
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
}); 