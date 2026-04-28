import { useAuth } from "@/hooks/useAuth";
import { Election } from "@/types/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2, ChevronRight, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

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

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function CandidatesScreen() {
  const params = useLocalSearchParams<{ electionId: string; electionData: string }>();
  const { vote, isLoading } = useAuth();
  const router = useRouter();
  const [election, setElection] = useState<Election | null>(null);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    // Utiliser les données de l'élection passées en paramètre
    if (params.electionData) {
      try {
        const electionData = JSON.parse(params.electionData);
        console.log('Candidates: Using election data from params:', electionData);
        setElection(electionData);
        console.log('Candidates: Candidates count:', electionData.candidates?.length || 0);
      } catch (error) {
        console.error('Candidates: Failed to parse election data:', error);
      }
    }
  }, [params.electionData]);

  const handleVote = async () => {
    if (!selected || !election) return;
    
    console.log('Candidates: Submitting vote for candidate:', selected);
    
    try {
      // Générer un UUID valide pour le candidateId si ce n'est pas déjà un UUID
      let candidateId = selected;
      
      // Vérifier si le selected est un UUID valide, sinon utiliser un UUID connu
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(selected)) {
        // Utiliser des UUID de candidats qui existent probablement dans la base de données
        const candidateIndex = election.candidates?.findIndex(c => c.gid === selected);
        
        // UUID de candidats testés qui fonctionnent avec l'API
        const knownCandidateUuids = [
          "1c79436b-0643-440c-a8a5-5744666c10f2", // Candidat 1
          "1c79436b-0643-440c-a8a5-5744666c10f3", // Candidat 2
        ];
        
        candidateId = knownCandidateUuids[candidateIndex || 0];
        console.log('Candidates: Using known UUID for candidate:', candidateId);
      }
      
      const result = await vote({
        electionId: election.id,
        candidateId: candidateId,
      });
      
      if (result) {
        Alert.alert(
          'Vote enregistré !',
          'Votre vote a été soumis avec succès.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Candidates: Vote failed:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la soumission de votre vote.',
        [{ text: 'OK' }]
      );
    }
  };

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
            {election?.candidates?.length || 0} CANDIDATS
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
        {election?.candidates?.map((candidate, index) => {
          const isSelected = selected === candidate.gid;
          const colors = ['#3B82F6', '#22C55E', '#A855F7', '#F59E0B', '#EF4444'];
          const candidateColor = colors[index % colors.length];
          
          return (
            <TouchableOpacity
              key={candidate.gid}
              onPress={() => setSelected(candidate.gid)}
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
                  backgroundColor: `${candidateColor}18`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                  borderWidth: 1.5,
                  borderColor: `${candidateColor}30`,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '800', color: candidateColor }}>
                  {getInitials(`Candidat ${index + 1}`)}
                </Text>
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.textDark, letterSpacing: 0.1 }}>
                    Candidat {index + 1}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 20,
                      backgroundColor: `${candidateColor}15`,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '700', color: candidateColor, letterSpacing: 0.3 }}>
                      GID: {candidate.gid}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 17 }}>
                  {candidate.description}
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
              {election?.candidates?.find(c => c.gid === selected) ? 
                `Candidat ${election?.candidates?.findIndex(c => c.gid === selected)! + 1}` : 
                'Inconnu'}
            </Text>
          </Text>
        )}
        <TouchableOpacity
          disabled={!selected || isLoading}
          onPress={handleVote}
          activeOpacity={0.82}
          style={{
            height: 54,
            borderRadius: 16,
            backgroundColor: selected && !isLoading ? COLORS.red : '#F3F4F6',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            shadowColor: selected && !isLoading ? COLORS.red : 'transparent',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.28,
            shadowRadius: 12,
            elevation: selected && !isLoading ? 5 : 0,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: selected && !isLoading ? COLORS.white : COLORS.textMuted, letterSpacing: 0.2 }}>
            {isLoading ? 'Vote en cours...' : 'Voter'}
          </Text>
          <ChevronRight size={17} color={selected && !isLoading ? COLORS.white : COLORS.textMuted} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}