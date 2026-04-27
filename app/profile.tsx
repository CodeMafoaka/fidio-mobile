import { useRouter } from "expo-router";
import { ChevronRight, LogOut, ShieldCheck, User, Vote } from "lucide-react-native";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  red: '#F9423A',
  redDark: '#D93530',
  white: '#FFFFFF',
  textDark: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  bg: '#F9FAFB',
  surface: '#FFFFFF',
  green: '#22C55E',
};

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  variant?: 'default' | 'danger';
}

function ProfileItem({ icon, label, value, onPress, showArrow = true, variant = 'default' }: ProfileItemProps) {
  const isDanger = variant === 'danger';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
      }}
    >
      {/* Icon container */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: isDanger ? '#FEF2F2' : '#F3F4F6',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
        }}
      >
        {icon}
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: isDanger ? COLORS.red : COLORS.textDark,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        {value && (
          <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
            {value}
          </Text>
        )}
      </View>

      {/* Arrow */}
      {showArrow && (
        <ChevronRight
          size={16}
          color={isDanger ? COLORS.red : COLORS.textMuted}
          strokeWidth={2}
        />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();

  // Mock user data - in real app this would come from user context/state
  const userData = {
    cin: "101 234 567 890",
    fullName: "Jean Rakoto",
    registrationDate: "15 mars 2026",
    voteStatus: "completed",
    lastVote: "27 avril 2026",
  };

  const handleLogout = () => {
    router.replace('/auth/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      {/* Header */}
      <View
        style={{
          backgroundColor: COLORS.red,
          paddingTop: 56,
          paddingHorizontal: 24,
          paddingBottom: 60,
        }}
      >
        {/* Background decoration */}
        <View
          style={{
            position: 'absolute',
            width: 280,
            height: 280,
            borderRadius: 140,
            backgroundColor: 'rgba(255,255,255,0.05)',
            top: -80,
            right: -80,
          }}
        />

        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 1.6,
            color: 'rgba(255,255,255,0.6)',
            marginBottom: 6,
          }}
        >
          MON COMPTE
        </Text>
        <Text
          style={{
            fontSize: 26,
            fontWeight: '800',
            color: COLORS.white,
            letterSpacing: -0.5,
            marginBottom: 8,
          }}
        >
          Profil électeur
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          Gérez vos informations et préférences
        </Text>
      </View>

      {/* Profile Card */}
      <View
        style={{
          marginHorizontal: 20,
          marginTop: -30,
          backgroundColor: COLORS.surface,
          borderRadius: 24,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
          marginBottom: 20,
        }}
      >
        {/* Avatar and basic info */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          {/* Avatar */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: COLORS.red,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
              shadowColor: COLORS.red,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: COLORS.white,
                letterSpacing: 0.5,
              }}
            >
              {getInitials(userData.fullName)}
            </Text>
          </View>

          {/* User info */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: COLORS.textDark,
                letterSpacing: -0.2,
                marginBottom: 4,
              }}
            >
              {userData.fullName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.textMuted,
                marginBottom: 2,
              }}
            >
              CIN: {userData.cin}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: COLORS.green,
                fontWeight: '600',
              }}
            >
              ✓ Compte vérifié
            </Text>
          </View>
        </View>

        {/* Status badges */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#F0FDF4',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 10, color: '#166534', fontWeight: '600', marginBottom: 2 }}>
              STATUT DE VOTE
            </Text>
            <Text style={{ fontSize: 12, color: '#22C55E', fontWeight: '700' }}>
              {userData.voteStatus === 'completed' ? 'A voté' : 'En attente'}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: '#FFF7ED',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 10, color: '#92400E', fontWeight: '600', marginBottom: 2 }}>
              INSCRIPTION
            </Text>
            <Text style={{ fontSize: 12, color: '#EA580C', fontWeight: '700' }}>
              {userData.registrationDate}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={{ marginHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 1.5,
            color: COLORS.textMuted,
            marginBottom: 12,
          }}
        >
          ACTIONS
        </Text>

        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          <ProfileItem
            icon={<User size={18} color="#374151" strokeWidth={2} />}
            label="Informations personnelles"
            value="Modifier nom, contact"
            onPress={() => {/* Navigate to personal info */}}
          />
          <ProfileItem
            icon={<Vote size={18} color="#374151" strokeWidth={2} />}
            label="Historique de vote"
            value={userData.lastVote}
            onPress={() => {/* Navigate to vote history */}}
          />
          <ProfileItem
            icon={<ShieldCheck size={18} color="#374151" strokeWidth={2} />}
            label="Sécurité"
            value="Mot de passe, biométrie"
            onPress={() => {/* Navigate to security settings */}}
          />
        </View>

        <Text
          style={{
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 1.5,
            color: COLORS.textMuted,
            marginBottom: 12,
          }}
        >
          SESSION
        </Text>

        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            overflow: 'hidden',
          }}
        >
          <ProfileItem
            icon={<LogOut size={18} color={COLORS.red} strokeWidth={2} />}
            label="Déconnexion"
            variant="danger"
            onPress={handleLogout}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={{ alignItems: 'center', marginTop: 'auto', paddingVertical: 20 }}>
        <Text style={{ fontSize: 11, color: COLORS.textMuted }}>
          Fidio v1.0 • Plateforme de vote électronique sécurisé
        </Text>
      </View>
    </View>
  );
}
