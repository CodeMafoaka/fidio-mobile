import { useAuth } from "@/hooks/useAuth";
import { Election } from "@/types/auth";
import { useRouter } from "expo-router";
import { CalendarClock, Clock3, ShieldCheck, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";

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
  const { getElections, isAuthenticated } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      console.log('Page: useEffect started - checking authentication');
      
      // Vérifier si l'utilisateur est authentifié
      if (!isAuthenticated()) {
        console.log('Page: User not authenticated, redirecting to login');
        router.replace('/auth/login');
        return;
      }
      
      console.log('Page: User authenticated, fetching elections');
      try {
        const electionsData = await getElections();
        console.log('Page: Elections data received:', electionsData);
        
        if (electionsData) {
          console.log('Page: Setting elections state with', electionsData.length, 'elections');
          setElections(electionsData);
          
          // Logs des élections après mise à jour de l'état
          console.log('Page: Current elections:', electionsData);
          console.log('Page: Number of elections:', electionsData.length);
          electionsData.forEach((election, index) => {
            console.log(`Page: Election ${index + 1}:`, election.title);
            console.log(`Page: Election ${index + 1} candidates count:`, election.candidates?.length || 0);
          });
        } else {
          console.log('Page: No elections data received');
        }
      } catch (error) {
        console.error('Page: Failed to fetch elections:', error);
      } finally {
        console.log('Page: Setting loading to false');
        setLoading(false);
      }
    };
    
    fetchElections();
  }, []); // Utiliser un tableau vide pour exécuter une seule fois au montage
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        {/* Elections list */}
        {elections.map((election, index) => (
          <View
            key={election.id}
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
                  {election.title || 'Élection présidentielle 2026'}
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
              value={formatDate(election.endAt)}
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
                value={`${election.candidates?.length || 0} candidats en lice`}
              />
            </View>
          </View>
        ))}

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

    </View>
  );
}