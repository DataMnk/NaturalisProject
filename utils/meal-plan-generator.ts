import { MealPlan, ShoppingList } from '@/types/meal-plan';
import { QuestionnaireState } from '@/types/questionnaire';
import { sampleMealPlan, createShoppingList } from '@/mocks/meal-plans';

// This is a mock implementation that would be replaced with actual OpenAI API calls
export async function generateMealPlan(
  questionnaireData: QuestionnaireState
): Promise<{ mealPlan: MealPlan; shoppingList: ShoppingList }> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, we would:
  // 1. Format the questionnaire data for the OpenAI API
  // 2. Make the API call to generate a meal plan
  // 3. Parse the response into our MealPlan type
  // 4. Generate a shopping list from the meal plan
  
  // For now, return the sample data with some modifications based on questionnaire
  const modifiedMealPlan = { 
    ...sampleMealPlan,
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    // Filter meals to match the requested number of days
    meals: sampleMealPlan.meals.filter(meal => 
      meal.day <= questionnaireData.goalSettings.mealPlanDays
    ),
  };
  
  const shoppingList = createShoppingList(modifiedMealPlan);
  
  return { mealPlan: modifiedMealPlan, shoppingList };
}