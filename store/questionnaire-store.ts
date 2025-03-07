import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  QuestionnaireState, 
  PersonalInfo, 
  DietPreferences, 
  GoalSettings 
} from '@/types/questionnaire';

interface QuestionnaireStore extends QuestionnaireState {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateDietPreferences: (prefs: Partial<DietPreferences>) => void;
  updateGoalSettings: (settings: Partial<GoalSettings>) => void;
  resetQuestionnaire: () => void;
  completeQuestionnaire: () => void;
}

const initialState: QuestionnaireState = {
  step: 1,
  personalInfo: {
    medicalConditions: [],
  },
  dietPreferences: {
    cuisines: [],
    allergies: [],
    dietaryPreferences: [],
    batchCooking: false,
    strictnessLevel: 'moderately_strict',
  },
  goalSettings: {
    healthGoal: 'maintenance',
    mealPlanDays: 5,
    mealsPerDay: 3,
  },
  isComplete: false,
};

export const useQuestionnaireStore = create<QuestionnaireStore>()(
  persist(
    (set) => ({
      ...initialState,
      nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),
      prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
      goToStep: (step: number) => set({ step }),
      updatePersonalInfo: (info: Partial<PersonalInfo>) => 
        set((state) => ({ 
          personalInfo: { ...state.personalInfo, ...info } 
        })),
      updateDietPreferences: (prefs: Partial<DietPreferences>) => 
        set((state) => ({ 
          dietPreferences: { ...state.dietPreferences, ...prefs } 
        })),
      updateGoalSettings: (settings: Partial<GoalSettings>) => 
        set((state) => ({ 
          goalSettings: { ...state.goalSettings, ...settings } 
        })),
      resetQuestionnaire: () => set({ ...initialState }),
      completeQuestionnaire: () => set({ isComplete: true }),
    }),
    {
      name: 'mango-questionnaire-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);