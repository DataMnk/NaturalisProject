import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import ProgressBar from '@/components/ProgressBar';
import Colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import { useQuestionnaireStore } from '@/store/questionnaire-store';
import { HealthGoal } from '@/types/questionnaire';

export default function GoalSettingsStep() {
  const router = useRouter();
  const { 
    goalSettings, 
    updateGoalSettings, 
    prevStep, 
    completeQuestionnaire 
  } = useQuestionnaireStore();
  
  const [healthGoal, setHealthGoal] = useState<HealthGoal>(
    goalSettings.healthGoal || 'maintenance'
  );
  const [calorieReduction, setCalorieReduction] = useState<'light' | 'moderate' | 'aggressive'>(
    goalSettings.calorieReduction || 'moderate'
  );
  const [mealPlanDays, setMealPlanDays] = useState(goalSettings.mealPlanDays || 5);
  const [mealsPerDay, setMealsPerDay] = useState(goalSettings.mealsPerDay || 3);

  const handleBack = () => {
    prevStep();
    router.back();
  };

  const handleComplete = () => {
    updateGoalSettings({
      healthGoal,
      calorieReduction: healthGoal === 'weight_loss' ? calorieReduction : undefined,
      mealPlanDays,
      mealsPerDay,
    });
    
    completeQuestionnaire();
    router.push('/questionnaire/loading');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Health Goals</Text>
        
        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={1}
            steps={3}
            currentStep={3}
            showStepIndicator
          />
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>What is your primary health goal?</Text>
        
        <View style={styles.radioGroup}>
          <RadioButton
            label="Weight Loss"
            description="Reduce body weight and fat"
            selected={healthGoal === 'weight_loss'}
            onSelect={() => setHealthGoal('weight_loss')}
          />
          
          <RadioButton
            label="Muscle Building"
            description="Increase muscle mass and strength"
            selected={healthGoal === 'muscle_building'}
            onSelect={() => setHealthGoal('muscle_building')}
          />
          
          <RadioButton
            label="Maintenance / Disease Prevention"
            description="Maintain current weight and improve overall health"
            selected={healthGoal === 'maintenance'}
            onSelect={() => setHealthGoal('maintenance')}
          />
        </View>
        
        {healthGoal === 'weight_loss' && (
          <>
            <Text style={styles.sectionTitle}>How aggressive do you want your weight loss to be?</Text>
            
            <View style={styles.radioGroup}>
              <RadioButton
                label="Light"
                description="0.5 lb per week (slight calorie deficit)"
                selected={calorieReduction === 'light'}
                onSelect={() => setCalorieReduction('light')}
              />
              
              <RadioButton
                label="Moderate"
                description="1 lb per week (moderate calorie deficit)"
                selected={calorieReduction === 'moderate'}
                onSelect={() => setCalorieReduction('moderate')}
              />
              
              <RadioButton
                label="Aggressive"
                description="2 lb per week (significant calorie deficit)"
                selected={calorieReduction === 'aggressive'}
                onSelect={() => setCalorieReduction('aggressive')}
              />
            </View>
          </>
        )}
        
        <Text style={styles.sectionTitle}>How many days do you want your meal plan for?</Text>
        
        <View style={styles.daysSelector}>
          {[3, 5, 7].map((days) => (
            <TouchableOpacity
              key={days}
              style={[
                styles.dayOption,
                mealPlanDays === days && styles.selectedDayOption,
              ]}
              onPress={() => setMealPlanDays(days)}
            >
              <Text
                style={[
                  styles.dayOptionText,
                  mealPlanDays === days && styles.selectedDayOptionText,
                ]}
              >
                {days} Days
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>How many meals per day?</Text>
        
        <View style={styles.mealsSelector}>
          {[3, 4, 5].map((meals) => (
            <TouchableOpacity
              key={meals}
              style={[
                styles.mealOption,
                mealsPerDay === meals && styles.selectedMealOption,
              ]}
              onPress={() => setMealsPerDay(meals)}
            >
              <Text
                style={[
                  styles.mealOptionText,
                  mealsPerDay === meals && styles.selectedMealOptionText,
                ]}
              >
                {meals === 3 ? '3 (no snacks)' : 
                 meals === 4 ? '4 (with 1 snack)' : 
                 '5 (with 2 snacks)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title="Create My Meal Plan" 
          onPress={handleComplete} 
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: SPACING.lg,
  },
  backButton: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: SPACING.md,
  },
  progressContainer: {
    marginBottom: SPACING.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  radioGroup: {
    marginBottom: SPACING.lg,
  },
  daysSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  dayOption: {
    flex: 1,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedDayOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.highlight,
  },
  dayOptionText: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
  selectedDayOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  mealsSelector: {
    marginBottom: SPACING.xl,
  },
  mealOption: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  selectedMealOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.highlight,
  },
  mealOptionText: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
  selectedMealOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
});