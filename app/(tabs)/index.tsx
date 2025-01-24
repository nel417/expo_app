import Camera from '@/components/Camera';
import Note, { NoteData } from '@/components/Note';
import PedometerComponent from '@/components/Pedometer';
import { StyleSheet, View, TouchableOpacity, Text, Modal, Animated } from 'react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import NoteGrid from '@/components/NoteGrid';
import { useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import { activeComponentAtom } from '@/store/atoms';

export type ActiveComponent = 'none' | 'camera' | 'note';

export default function HomeScreen() {
  const { promptedNote, activeComponent: initialComponent } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [activeComponent, setActiveComponent] = useAtom(activeComponentAtom);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadNotes();
    if (showModal) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [showModal]);

  useEffect(() => {
    if (promptedNote && typeof promptedNote === 'object') {
      navigateToNote(promptedNote as unknown as NoteData);
    }
  }, [promptedNote]);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleSaveNote = useCallback(async (newNote: NoteData) => {
    try {
      const updatedNotes = [newNote, ...notes];
      await AsyncStorage.multiSet([
        ['notes', JSON.stringify(updatedNotes)],
        ['lastUpdated', Date.now().toString()]
      ]);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }, [notes]);

  const handleDeleteNote = useCallback(async (id: string) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== id);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }, [notes]);

  const handleOptionSelect = useCallback((component: ActiveComponent) => {
    setShowModal(false);
    setActiveComponent(component);
  }, []);

  const navigateToNote = (note: NoteData) => {
    setActiveComponent('note');
  };

  if (activeComponent === 'camera') {
    return (
      <Camera 
        onClose={() => setActiveComponent('none')} 
        onPhotoTaken={handleSaveNote}
      />
    );
  }

  if (activeComponent === 'note') {
    return (
      <Note 
        onClose={() => {
          setActiveComponent('none');
        }} 
        onSave={handleSaveNote}
        initialNote={typeof promptedNote === 'object' ? (promptedNote as unknown as NoteData) : null}
      />
    );
  }

  return (
    <View style={styles.container}>
      <NoteGrid 
        notes={notes} 
        onDeleteNote={handleDeleteNote}
      />
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setShowModal(true)}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
      <PedometerComponent />

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [600, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleOptionSelect('camera')}
            >
              <Text style={styles.optionText}>Take a Picture</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleOptionSelect('note')}
            >
              <Text style={styles.optionText}>Write a Note</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={[styles.option, styles.cancelOption]}
              onPress={() => setShowModal(false)}
            >
              <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 300, // Position above the pedometer
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  option: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  optionText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  cancelOption: {
    marginTop: 8,
  },
  cancelText: {
    color: '#FF3B30',
  },
});