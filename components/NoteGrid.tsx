import React, { useState, memo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import type { NoteData } from './Note';

interface NoteGridProps {
  notes: NoteData[];
  onNotePress?: (note: NoteData) => void;
  onDeleteNote: (id: string) => void;
}

const COLUMN_WIDTH = (Dimensions.get('window').width - 40) / 2;

const NoteGrid: React.FC<NoteGridProps> = memo(({ notes, onNotePress, onDeleteNote }) => {
  const handleLongPress = (note: NoteData) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => onDeleteNote(note.id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.grid}>
        {notes.map((note) => (
          <TouchableOpacity
            key={note.id}
            style={[styles.noteCard, { backgroundColor: note.color }]}
            onPress={() => onNotePress?.(note)}
            onLongPress={() => handleLongPress(note)}
            delayLongPress={1000} // 1 second long press
          >
            {note.imageUri && (
              <Image 
                source={{ uri: note.imageUri }} 
                style={styles.noteImage}
                resizeMode="cover"
              />
            )}
            <Text style={styles.noteTitle} numberOfLines={1}>
              {note.title}
            </Text>
            <Text style={styles.noteContent} numberOfLines={3}>
              {note.content}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
});

export default NoteGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  content: {
    paddingBottom: 280, // Space for pedometer
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  noteCard: {
    width: COLUMN_WIDTH,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 120,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
  },
  noteImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
}); 