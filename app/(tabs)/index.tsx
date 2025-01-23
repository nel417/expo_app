import Camera from '@/components/Camera';
import Note from '@/components/Note';
import PedometerComponent from '@/components/Pedometer';
import { StyleSheet, View, TouchableOpacity, Text, Modal, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';

type ActiveComponent = 'none' | 'camera' | 'note';

export default function HomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>('none');
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

  const handleOptionSelect = (component: ActiveComponent) => {
    setShowModal(false);
    setActiveComponent(component);
  };

  if (activeComponent === 'camera') {
    return <Camera onClose={() => setActiveComponent('none')} />;
  }

  if (activeComponent === 'note') {
    return <Note onClose={() => setActiveComponent('none')} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.cameraButton} 
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.plusIcon}>+</Text>
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
  cameraButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
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
  },
  plusIcon: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
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