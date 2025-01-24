import { View, Text, StyleSheet } from 'react-native';
import { MILESTONES } from './constants';

interface MilestoneListProps {
  achievedMilestones: Set<number>;
}

export function MilestoneList({ achievedMilestones }: MilestoneListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Milestones</Text>
      {MILESTONES.map(({ steps, message }) => (
        <View 
          key={steps} 
          style={[
            styles.item,
            achievedMilestones.has(steps) && styles.achieved
          ]}
        >
          <Text style={styles.steps}>{steps} Steps</Text>
          <Text style={styles.message}>{message}</Text>
          {achievedMilestones.has(steps) && (
            <Text style={styles.check}>✓</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    opacity: 0.6,
  },
  achieved: {
    opacity: 1,
    backgroundColor: '#f8f8f8',
  },
  steps: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    width: 100,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  check: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 10,
  },
}); 