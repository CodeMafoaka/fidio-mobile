import { useRouter } from "expo-router";
import { CalendarClock, ChevronRight, Clock3, ShieldCheck, Users } from "lucide-react-native";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  red: '#F9423A',
  white: '#FFFFFF',
  textDark: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  bg: '#F9FAFB',
  surface: '#FFFFFF',
  green: '#22C55E',
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: '#F3F4F6',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 10, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.8, marginBottom: 2 }}>
          {label}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textDark }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function ElectionDetailsScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      {/* Header */}
      <View style={{ backgroundColor: COLORS.red, paddingTop: 56, paddingHorizontal: 24, paddingBottom: 52 }}>
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(255,255,255,0.18)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            marginBottom: 14,
          }}
        >
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.green }} />
          <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: 'rgba(255,255,255,0.95)' }}>
            SCRUTIN EN COURS
          </Text>
        </View>

        <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.white, letterSpacing: -0.5, marginBottom: 6 }}>
          Élection active
        </Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
          Consultez les détails avant de voter.
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main election card */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 22,
            padding: 20,
            marginBottom: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          {/* Title row */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.3, lineHeight: 23 }}>
                Élection présidentielle 2026
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                Sélection d&apos;un candidat unique
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 20,
                backgroundColor: '#DCFCE7',
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#16A34A', letterSpacing: 0.5 }}>
                OUVERTE
              </Text>
            </View>
          </View>

          {/* Info rows */}
          <InfoRow
            icon={<CalendarClock size={16} color="#6B7280" strokeWidth={2} />}
            label="CLÔTURE"
            value="30 avril 2026 à 18h00"
          />
          <InfoRow
            icon={<Clock3 size={16} color="#6B7280" strokeWidth={2} />}
            label="DURÉE"
            value="Tour unique — vote définitif"
          />
          <View style={{ borderBottomWidth: 0 }}>
            <InfoRow
              icon={<Users size={16} color="#6B7280" strokeWidth={2} />}
              label="CANDIDATS"
              value="3 candidats en lice"
            />
          </View>
        </View>

        {/* Security notice card */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 18,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              backgroundColor: '#FFF5F5',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={17} color={COLORS.red} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.textDark, marginBottom: 3 }}>
              Vote chiffré & anonyme
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 18 }}>
              Votre identité n&apos;est jamais associée à votre choix. Le bulletin est cryptographiquement signé.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: 36,
          paddingTop: 16,
          backgroundColor: COLORS.bg,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/election/candidates")}
          activeOpacity={0.82}
          style={{
            height: 54,
            borderRadius: 16,
            backgroundColor: COLORS.red,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            shadowColor: COLORS.red,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.28,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.white, letterSpacing: 0.2 }}>
            Voir les candidats
          </Text>
          <ChevronRight size={17} color={COLORS.white} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}