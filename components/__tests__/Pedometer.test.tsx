import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Pedometer } from 'expo-sensors';
import PedometerComponent from '../Pedometer';

// Mock the expo-sensors Pedometer
jest.mock('expo-sensors', () => ({
  Pedometer: {
    isAvailableAsync: jest.fn(),
    watchStepCount: jest.fn(),
  },
}));

describe('PedometerComponent', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    const { getByText } = render(<PedometerComponent />);
    
    expect(getByText('Step Counter')).toBeTruthy();
    expect(getByText('Current Steps')).toBeTruthy();
    expect(getByText('0')).toBeTruthy();
    expect(getByText('Status: Inactive')).toBeTruthy();
  });

  it('updates status when pedometer is available', async () => {
    // Mock pedometer availability
    (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    
    const { getByText } = render(<PedometerComponent />);

    await waitFor(() => {
      expect(getByText('Status: Active')).toBeTruthy();
    });
  });

  it('updates step count when receiving pedometer events', async () => {
    // Mock pedometer availability and step count updates
    (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    let stepCallback: (result: { steps: number }) => void;
    
    (Pedometer.watchStepCount as jest.Mock).mockImplementation((callback) => {
      stepCallback = callback;
      return { remove: jest.fn() };
    });

    const { getByText } = render(<PedometerComponent />);

    // Wait for the component to initialize and set up the callback
    await waitFor(() => {
      expect(Pedometer.watchStepCount).toHaveBeenCalled();
    });

    // Now that the callback is set up, simulate step count update
    await act(async () => {
      if (stepCallback) {
        stepCallback({ steps: 100 });
      }
    });

    expect(getByText('100')).toBeTruthy();
  });

  it('handles pedometer unavailability', async () => {
    // Mock pedometer unavailability
    (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(false);
    
    const { getByText } = render(<PedometerComponent />);

    await waitFor(() => {
      expect(getByText('Status: Inactive')).toBeTruthy();
    });
  });

  it('cleans up subscription on unmount', async () => {
    const mockRemove = jest.fn();
    (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    (Pedometer.watchStepCount as jest.Mock).mockReturnValue({ remove: mockRemove });

    const { unmount } = render(<PedometerComponent />);

    // Wait for the component to set up
    await waitFor(() => {
      expect(Pedometer.watchStepCount).toHaveBeenCalled();
    });

    // Unmount the component
    unmount();

    // Verify cleanup
    expect(mockRemove).toHaveBeenCalled();
  });
}); 