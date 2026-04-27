import { useLocalSearchParams, useRouter } from "expo-router";
import { BarChart3, Bell, ChevronRight, FileCheck2, LogOut, Vote } from "lucide-react-native";
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
};

interface ActionCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onPress: () => void;
  variant?: 'primary' | 'default';
}

function ActionCard({ icon, label, description, onPress, variant = 'default' }: ActionCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 72,
        borderRadius: 18,
        paddingHorizontal: 18,
        marginBottom: 10,
        backgroundColor: isPrimary ? COLORS.red : COLORS.surface,
        borderWidth: isPrimary ? 0 : 1,
        borderColor: COLORS.border,
        shadowColor: isPrimary ? COLORS.red : '#000',
        shadowOffset: { width: 0, height: isPrimary ? 6 : 2 },
        shadowOpacity: isPrimary ? 0.28 : 0.05,
        shadowRadius: isPrimary ? 12 : 6,
        elevation: isPrimary ? 5 : 2,
      }}
    >
      {/* Icon container */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: isPrimary ? 'rgba(255,255,255,0.18)' : '#F3F4F6',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 14,
        }}
      >
        {icon}
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: isPrimary ? COLORS.white : COLORS.textDark,
            letterSpacing: 0.1,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: isPrimary ? 'rgba(255,255,255,0.65)' : COLORS.textMuted,
          }}
        >
          {description}
        </Text>
      </View>

      {/* Arrow */}
      <ChevronRight
        size={16}
        color={isPrimary ? 'rgba(255,255,255,0.7)' : COLORS.textMuted}
        strokeWidth={2.5}
      />
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { cin } = useLocalSearchParams<{ cin?: string }>();

  // Derive initials from CIN or fallback
  const displayCin = cin || '—';
  const initials = displayCin.length >= 2 ? displayCin.slice(0, 2).toUpperCase() : 'EL';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      {/* ── Header ── */}
      <View
        style={{
          backgroundColor: COLORS.red,
          paddingTop: 56,
          paddingHorizontal: 24,
          paddingBottom: 52,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Greeting */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 1.6,
                color: 'rgba(255,255,255,0.6)',
                marginBottom: 4,
              }}
            >
              BIENVENUE
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '800',
                color: COLORS.white,
                letterSpacing: -0.4,
              }}
            >
              Électeur
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.6)',
                marginTop: 2,
                letterSpacing: 0.3,
              }}
            >
              CIN : {displayCin}
            </Text>
          </View>

          {/* Right: notification + avatar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <Bell size={17} color={COLORS.white} strokeWidth={2} />
            </TouchableOpacity>

            {/* Avatar initials */}
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.22)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '800',
                  color: COLORS.white,
                  letterSpacing: 0.5,
                }}
              >
                {initials}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Status chip ── */}
      <View style={{ alignItems: 'center', marginTop: -18 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            backgroundColor: COLORS.surface,
            paddingHorizontal: 16,
            paddingVertical: 9,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {/* Pulsing green dot */}
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#22C55E',
            }}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: COLORS.textDark,
              letterSpacing: 0.2,
            }}
          >
            Élection active — Scrutin en cours
          </Text>
        </View>
      </View>

      {/* ── Action cards ── */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        {/* Section label */}
        <Text
          style={{
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 1.5,
            color: COLORS.textMuted,
            marginBottom: 14,
          }}
        >
          ACTIONS DISPONIBLES
        </Text>

        <ActionCard
          icon={<Vote size={20} color={COLORS.white} strokeWidth={2} />}
          label="Accéder à l'élection active"
          description="Déposer votre vote maintenant"
          onPress={() => router.push("/election/details")}
          variant="primary"
        />

        <ActionCard
          icon={<FileCheck2 size={19} color="#374151" strokeWidth={2} />}
          label="Vérifier un reçu"
          description="Contrôler la validité de votre ticket"
          onPress={() => router.push("/receipt/verify")}
        />

        <ActionCard
          icon={<BarChart3 size={19} color="#374151" strokeWidth={2} />}
          label="Résultats en temps réel"
          description="Suivre le dépouillement en direct"
          onPress={() => router.push("/results/live")}
        />
      </View>

      {/* ── Footer info band ── */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
          paddingVertical: 18,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.surface,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 11, color: COLORS.textMuted }}>
          Session sécurisée · Fidio v1.0
        </Text>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
          activeOpacity={0.7}
          onPress={() => router.replace('/auth/login')}
        >
          <LogOut size={13} color={COLORS.red} strokeWidth={2.2} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: COLORS.red,
            }}
          >
            Déconnexion
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}