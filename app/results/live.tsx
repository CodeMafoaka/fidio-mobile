import { useAuth } from "@/hooks/useAuth";
import { ElectionResult } from "@/types/auth";
import { useEffect, useRef, useState } from "react";
import { Animated, StatusBar, Text, View } from "react-native";

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

const CANDIDATE_COLORS = ['#F9423A', '#3B82F6', '#A855F7'];
const CANDIDATE_BG = ['#FFF0EF', '#EFF6FF', '#FAF5FF'];

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// Types pour les résultats de candidats
interface CandidateResult {
  name: string;
  party: string;
  value: number;
  votes: number;
  gid: string;
}

// ── Animated bar ─────────────────────────────────────────────
function ResultBar({
  item,
  index,
  isLeader,
  delay,
  totalVotes,
}: {
  item: CandidateResult;
  index: number;
  isLeader: boolean;
  delay: number;
  totalVotes: number;
}) {
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: item.value,
      duration: 900,
      delay,
      useNativeDriver: false,
    }).start();
  }, [item.value, delay, barAnim]);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const color = CANDIDATE_COLORS[index];
  const bg = CANDIDATE_BG[index];

  return (
    <View
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 10,
        borderWidth: isLeader ? 1.5 : 1,
        borderColor: isLeader ? color : COLORS.border,
        shadowColor: isLeader ? color : '#000',
        shadowOffset: { width: 0, height: isLeader ? 5 : 2 },
        shadowOpacity: isLeader ? 0.1 : 0.04,
        shadowRadius: isLeader ? 10 : 6,
        elevation: isLeader ? 4 : 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        {/* Avatar */}
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            borderWidth: 1.5,
            borderColor: `${color}30`,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '800', color }}>
            {getInitials(item.name)}
          </Text>
        </View>

        {/* Name + party */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.textDark, letterSpacing: 0.1 }}>
              {item.name}
            </Text>
            {isLeader && (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 20,
                  backgroundColor: bg,
                }}
              >
                <Text style={{ fontSize: 9, fontWeight: '800', color, letterSpacing: 0.8 }}>
                  EN TÊTE
                </Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>
            {item.party}
          </Text>
        </View>

        {/* Percentage */}
        <Text style={{ fontSize: 22, fontWeight: '800', color, letterSpacing: -0.5 }}>
          {item.value}%
        </Text>
      </View>

      {/* Bar track */}
      <View
        style={{
          height: 8,
          borderRadius: 10,
          backgroundColor: bg,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            borderRadius: 10,
            backgroundColor: color,
            width: barWidth,
          }}
        />
      </View>

      {/* Vote estimate */}
      <Text style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 6, letterSpacing: 0.3 }}>
        ≈ {Math.round(totalVotes * item.value / 100).toLocaleString('fr-FR')} votes estimés
      </Text>
    </View>
  );
}

// ── Pulse dot ────────────────────────────────────────────────
function PulseDot() {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [anim]);

  return (
    <Animated.View
      style={{
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#22C55E',
        opacity: anim,
      }}
    />
  );
}

// ── Main Screen ──────────────────────────────────────────────
export default function LiveResultsScreen() {
  const { getElections, getElectionResults, isLoading } = useAuth();
  const [electionResults, setElectionResults] = useState<ElectionResult | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Récupérer les élections et les résultats au montage et toutes les 5 secondes
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Results: Fetching elections data');
        const electionsData = await getElections();
        console.log('Results: Elections data received:', electionsData);
        
        if (electionsData && electionsData.length > 0) {
          // Récupérer les résultats de la première élection
          const firstElection = electionsData[0];
          console.log('Results: Fetching results for election:', firstElection.id);
          
          const results = await getElectionResults(firstElection.id);
          console.log('Results: Election results received:', results);
          
          setElectionResults(results);
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Results: Failed to fetch data:', error);
      }
    };

    fetchData();

    // Rafraîchir toutes les 5 secondes
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [getElections, getElectionResults]);

  // Transformer les données de l'API en résultats pour l'affichage
  const getCandidateResults = (): CandidateResult[] => {
    if (!electionResults || !electionResults.candidateResults) return [];

    // Utiliser les vraies données de l'API
    return electionResults.candidateResults.map((candidate, index) => {
      const percentage = electionResults.totalVote > 0 
        ? Math.round((candidate.voteAmount / electionResults.totalVote) * 100) 
        : 0;
      
      return {
        name: `Candidat ${index + 1}`,
        party: `GID: ${candidate.candidateGid}`,
        value: percentage,
        votes: candidate.voteAmount,
        gid: candidate.candidateGid,
      };
    });
  };

  const candidateResults = getCandidateResults();
  const totalVotes = candidateResults.reduce((sum, candidate) => sum + candidate.votes, 0);
  const leaderIndex = candidateResults.length > 0 
    ? candidateResults.reduce((best, item, i) => item.value > candidateResults[best].value ? i : best, 0)
    : -1;

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      {/* Header */}
      <View style={{ backgroundColor: COLORS.red, paddingTop: 56, paddingHorizontal: 24, paddingBottom: 52 }}>
        {/* Live badge */}
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            backgroundColor: 'rgba(255,255,255,0.18)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            marginBottom: 14,
          }}
        >
          <PulseDot />
          <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 1.6, color: COLORS.white }}>
            EN DIRECT
          </Text>
        </View>

        <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.white, letterSpacing: -0.5, marginBottom: 6 }}>
          Résultats{'\n'}en temps réel
        </Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
          Élection présidentielle 2026
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>

        {/* Stats band */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 18,
            paddingVertical: 14,
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: COLORS.border,
            marginBottom: 18,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.textDark, letterSpacing: -0.3 }}>
              {totalVotes.toLocaleString('fr-FR')}
            </Text>
            <Text style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2, letterSpacing: 0.5 }}>
              VOTES COMPTÉS
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: COLORS.border }} />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.textDark }}>
              {candidateResults.length}
            </Text>
            <Text style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2, letterSpacing: 0.5 }}>
              CANDIDATS
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: COLORS.border }} />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#22C55E' }}>
              {isLoading ? '...' : '100%'}
            </Text>
            <Text style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2, letterSpacing: 0.5 }}>
              PARTICIPATION
            </Text>
          </View>
        </View>

        {/* Section label */}
        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: COLORS.textMuted, marginBottom: 12 }}>
          DÉPOUILLEMENT
        </Text>

        {/* Result bars */}
        {candidateResults.map((item, i) => (
          <ResultBar
            key={item.name}
            item={item}
            index={i}
            isLeader={i === leaderIndex}
            delay={i * 150}
            totalVotes={totalVotes}
          />
        ))}

        {candidateResults.length === 0 && !isLoading && (
          <View style={{ 
            backgroundColor: COLORS.surface, 
            borderRadius: 20, 
            padding: 20, 
            alignItems: 'center',
            borderWidth: 1,
            borderColor: COLORS.border
          }}>
            <Text style={{ fontSize: 14, color: COLORS.textMuted, textAlign: 'center' }}>
              Aucun résultat disponible pour le moment
            </Text>
          </View>
        )}

        {isLoading && (
          <View style={{ 
            backgroundColor: COLORS.surface, 
            borderRadius: 20, 
            padding: 20, 
            alignItems: 'center',
            borderWidth: 1,
            borderColor: COLORS.border
          }}>
            <Text style={{ fontSize: 14, color: COLORS.textMuted }}>
              Chargement des résultats...
            </Text>
          </View>
        )}

        {/* Last update */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, justifyContent: 'center' }}>
          <PulseDot />
          <Text style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.3 }}>
            Dernière mise à jour : {formatTime(lastUpdate)}
          </Text>
        </View>
      </View>
    </View>
  );
}