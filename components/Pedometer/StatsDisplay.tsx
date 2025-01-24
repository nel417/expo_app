import { View, Text, StyleSheet } from 'react-native';

interface StatsDisplayProps {
  currentStepCount: number;
  isPedometerAvailable: string;
  nextMilestone?: number;
}

export function StatsDisplay({ currentStepCount, isPedometerAvailable, nextMilestone }: StatsDisplayProps) {
  const stepsToNextMilestone = nextMilestone ? nextMilestone - currentStepCount : 0;

  return (
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
  );
}

const styles = StyleSheet.create({
  statsContainer: {
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
}); 