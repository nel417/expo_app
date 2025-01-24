import { Alert } from 'react-native';
import { NoteData } from '../Note';

interface MilestoneAlertProps {
  steps: number;
  onDismiss: () => void;
  onWriteNote: (note: NoteData) => void;
}

export function showMilestoneAlert({ steps, onDismiss, onWriteNote }: MilestoneAlertProps) {
  Alert.alert(
    '🎉 Milestone Achieved!',
    `You've reached ${steps} steps! What's on your mind?`,
    [
      {
        text: 'No thanks',
        style: 'cancel',
        onPress: onDismiss
      },
      {
        text: 'Write Note',
        onPress: () => {
          onDismiss();
          const newNote: NoteData = {
            id: Date.now().toString(),
            title: `${steps} Steps Milestone`,
            content: '',
            timestamp: Date.now(),
            color: '#BAFFC9',
          };
          onWriteNote(newNote);
        },
      },
    ],
    { cancelable: false }
  );
} 