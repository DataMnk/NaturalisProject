import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  User, 
  Settings, 
  LogOut, 
  Edit, 
  Bell, 
  HelpCircle, 
  ChevronRight,
  Lock,
  FileText,
} from 'lucide-react-native';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';
import { useQuestionnaireStore } from '@/store/questionnaire-store';
import { useMealPlanStore } from '@/store/meal-plan-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { resetQuestionnaire } = useQuestionnaireStore();
  const { clearCurrentPlan } = useMealPlanStore();
  
  const handleEditProfile = () => {
    // Navigate to edit profile screen
    Alert.alert('Coming Soon', 'Profile editing will be available in a future update.');
  };
  
  const handleEditPreferences = () => {
    // Navigate back to questionnaire to edit preferences
    router.push('/questionnaire');
  };
  
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: () => {
            signOut();
            resetQuestionnaire();
            clearCurrentPlan();
            router.replace('/');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <User size={32} color={Colors.text.primary} />
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.name || 'Guest User'}
              </Text>
              <Text style={styles.profileEmail}>
                {user?.email || 'Guest Account'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Edit size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          {user?.isGuest && (
            <View style={styles.guestBanner}>
              <Text style={styles.guestBannerText}>
                You're using a guest account. Sign in to save your data.
              </Text>
            </View>
          )}
        </Card>
        
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <Card style={styles.menuCard}>
          <MenuItem 
            icon={<Settings size={20} color={Colors.primary} />}
            title="Edit Health Profile"
            onPress={handleEditPreferences}
          />
          
          <MenuItem 
            icon={<Bell size={20} color={Colors.primary} />}
            title="Notifications"
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available in a future update.')}
          />
        </Card>
        
        <Text style={styles.sectionTitle}>Support</Text>
        
        <Card style={styles.menuCard}>
          <MenuItem 
            icon={<HelpCircle size={20} color={Colors.primary} />}
            title="Help & FAQ"
            onPress={() => Alert.alert('Coming Soon', 'Help center will be available in a future update.')}
          />
          
          <MenuItem 
            icon={<Lock size={20} color={Colors.primary} />}
            title="Privacy Settings"
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available in a future update.')}
          />
          
          <MenuItem 
            icon={<FileText size={20} color={Colors.primary} />}
            title="Terms of Service"
            onPress={() => Alert.alert('Coming Soon', 'Terms of service will be available in a future update.')}
          />
        </Card>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}

function MenuItem({ icon, title, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemIcon}>{icon}</View>
      <Text style={styles.menuItemTitle}>{title}</Text>
      <ChevronRight size={20} color={Colors.text.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  profileCard: {
    marginBottom: SPACING.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  editButton: {
    padding: SPACING.sm,
  },
  guestBanner: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: Colors.highlight,
    borderRadius: 8,
  },
  guestBannerText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  menuCard: {
    marginBottom: SPACING.lg,
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemIcon: {
    marginRight: SPACING.md,
  },
  menuItemTitle: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    marginTop: SPACING.lg,
  },
  signOutText: {
    fontSize: 16,
    color: Colors.error,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  versionText: {
    fontSize: 12,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});