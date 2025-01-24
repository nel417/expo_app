import { Dimensions } from "react-native";

export const MILESTONES = [
  { steps: 10, message: "Great start! You've taken your first 100 steps!" },
  { steps: 1000, message: "You're on a roll! 1,000 steps completed!" },
  { steps: 5000, message: "Halfway there! Keep going!" },
  { steps: 10000, message: "Amazing! You've hit your 10,000 steps goal! 🎉" },
] as const;

export const MIN_HEIGHT = 280;
export const MAX_HEIGHT = Dimensions.get('window').height * 0.75; 