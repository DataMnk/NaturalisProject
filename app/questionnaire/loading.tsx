import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import { useQuestionnaireStore } from '@/store/questionnaire-store';
import { useMealPlanStore } from '@/store/meal-plan-store';
import { generateMealPlan } from '@/utils/meal-plan-generator';

export default function LoadingScreen() {
  const router = useRouter();
  const questionnaireState = useQuestionnaireStore();
  const { setCurrentPlan, setShoppingList, setLoading, setError } = useMealPlanStore();
  
  useEffect(() => {
    const generatePlan = async () => {
      try {
        setLoading(true);
        
        // Generate meal plan based on questionnaire data
        const { mealPlan, shoppingList } = await generateMealPlan(questionnaireState);
        
        // Update store with generated plan
        setCurrentPlan(mealPlan);
        setShoppingList(shoppingList);
        
        // Navigate to meal plan screen
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Error generating meal plan:', error);
        setError('Failed to generate meal plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    generatePlan();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        
        <Text style={styles.title}>Creating Your Meal Plan</Text>
        
        <Text style={styles.description}>
          Our AI is analyzing your preferences and health needs to create a personalized meal plan just for you.
        </Text>
        
        <View style={styles.stepsContainer}>
          <LoadingStep 
            step={1} 
            text="Analyzing your health profile" 
            isActive={true} 
          />
          <LoadingStep 
            step={2} 
            text="Matching with optimal nutrition guidelines" 
            isActive={true} 
          />
          <LoadingStep 
            step={3} 
            text="Generating delicious recipes" 
            isActive={true} 
          />
          <LoadingStep 
            step={4} 
            text="Creating your shopping list" 
            isActive={false} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

interface LoadingStepProps {
  step: number;
  text: string;
  isActive: boolean;
}

function LoadingStep({ step, text, isActive }: LoadingStepProps) {
  return (
    <View style={styles.stepContainer}>
      <View style={[styles.stepNumber, isActive && styles.activeStepNumber]}>
        {isActive ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.stepNumberText}>{step}</Text>
        )}
      </View>
      <Text style={[styles.stepText, isActive && styles.activeStepText]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  stepsContainer: {
    width: '100%',
    marginTop: SPACING.xl,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  activeStepNumber: {
    backgroundColor: Colors.primary,
  },
  stepNumberText: {
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  activeStepText: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
});