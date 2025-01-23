import { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface NoteProps {
  onClose: () => void;
}

export default function Note({ onClose }: NoteProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    // TODO: Implement note saving functionality
    console.log({ title, content });
    onClose();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Start typing..."
        value={content}
        onChangeText={setContent}
        multiline
        placeholderTextColor="#666"
        autoFocus
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    fontSize: 28,
    color: '#666',
    padding: 8,
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    padding: 8,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    padding: 16,
    color: '#333',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 16,
    paddingTop: 8,
    textAlignVertical: 'top',
    color: '#333',
  },
}); 