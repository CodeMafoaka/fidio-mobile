import { useRouter } from "expo-router";
import { CheckCircle2, ChevronRight, Users } from "lucide-react-native";
import { useState } from "react";
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
};

const CANDIDATES = [
  { id: "c1", name: "Andry R.", party: "Union citoyenne", desc: "Modernisation et emploi.", color: "#3B82F6" },
  { id: "c2", name: "Miora L.", party: "Mada verte", desc: "Transition écologique et locale.", color: "#22C55E" },
  { id: "c3", name: "Tiana M.", party: "Justice sociale", desc: "Éducation et transparence.", color: "#A855F7" },
];

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function CandidatesScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("");

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      {/* Header */}
      <View style={{ backgroundColor: COLORS.red, paddingTop: 56, paddingHorizontal: 24, paddingBottom: 48 }}>
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(255,255,255,0.15)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            marginBottom: 14,
          }}
        >
          <Users size={11} color="rgba(255,255,255,0.9)" strokeWidth={2.5} />
          <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: 'rgba(255,255,255,0.9)' }}>
            {CANDIDATES.length} CANDIDATS
          </Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.white, letterSpacing: -0.5, marginBottom: 6 }}>
          Choisissez{'\n'}votre candidat
        </Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 19 }}>
          Sélectionnez un candidat puis confirmez votre choix.
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {CANDIDATES.map((candidate, index) => {
          const isSelected = selected === candidate.id;
          return (
            <TouchableOpacity
              key={candidate.id}
              onPress={() => setSelected(candidate.id)}
              activeOpacity={0.82}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 20,
                padding: 16,
                marginBottom: 10,
                backgroundColor: isSelected ? '#FFF5F5' : COLORS.surface,
                borderWidth: isSelected ? 1.5 : 1,
                borderColor: isSelected ? COLORS.red : COLORS.border,
                shadowColor: isSelected ? COLORS.red : '#000',
                shadowOffset: { width: 0, height: isSelected ? 6 : 2 },
                shadowOpacity: isSelected ? 0.12 : 0.04,
                shadowRadius: isSelected ? 12 : 6,
                elevation: isSelected ? 4 : 1,
              }}
            >
              {/* Avatar */}
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: `${candidate.color}18`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                  borderWidth: 1.5,
                  borderColor: `${candidate.color}30`,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '800', color: candidate.color }}>
                  {getInitials(candidate.name)}
                </Text>
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.textDark, letterSpacing: 0.1 }}>
                    {candidate.name}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 20,
                      backgroundColor: `${candidate.color}15`,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '700', color: candidate.color, letterSpacing: 0.3 }}>
                      {candidate.party}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 17 }}>
                  {candidate.desc}
                </Text>
              </View>

              {/* Check */}
              <View style={{ marginLeft: 10 }}>
                {isSelected ? (
                  <CheckCircle2 size={22} color={COLORS.red} strokeWidth={2} />
                ) : (
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 1.5,
                      borderColor: COLORS.border,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
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
        {selected && (
          <Text style={{ fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginBottom: 12 }}>
            Candidat sélectionné :{' '}
            <Text style={{ fontWeight: '700', color: COLORS.textDark }}>
              {CANDIDATES.find(c => c.id === selected)?.name}
            </Text>
          </Text>
        )}
        <TouchableOpacity
          disabled={!selected}
          onPress={() => router.push({ pathname: "/election/confirm", params: { candidateId: selected } })}
          activeOpacity={0.82}
          style={{
            height: 54,
            borderRadius: 16,
            backgroundColor: selected ? COLORS.red : '#F3F4F6',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            shadowColor: selected ? COLORS.red : 'transparent',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.28,
            shadowRadius: 12,
            elevation: selected ? 5 : 0,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: selected ? COLORS.white : COLORS.textMuted, letterSpacing: 0.2 }}>
            Continuer
          </Text>
          <ChevronRight size={17} color={selected ? COLORS.white : COLORS.textMuted} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}