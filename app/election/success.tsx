import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2, ReceiptText } from "lucide-react-native";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

function buildReceiptId() {
  const rand = Math.floor(Math.random() * 900000 + 100000);
  return `REC-${new Date().getFullYear()}-${rand}`;
}

export default function VoteSuccessScreen() {
  const router = useRouter();
  const { candidateId } = useLocalSearchParams<{ candidateId?: string }>();
  const receiptId = buildReceiptId();

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      <StatusBar barStyle="light-content" backgroundColor="#00843D" />
      <View className="items-center mb-8">
        <CheckCircle2 size={56} color="#16A34A" />
        <Text className="text-2xl font-bold text-gray-900 mt-3">Vote enregistre</Text>
        <Text className="text-gray-600 mt-1 text-center">Votre vote est valide et definitivement bloque.</Text>
      </View>

      <View className="rounded-2xl border border-gray-200 p-4 mb-6">
        <View className="flex-row items-center gap-2 mb-2">
          <ReceiptText size={18} color="#374151" />
          <Text className="text-gray-800 font-semibold">Recu anonyme</Text>
        </View>
        <Text className="text-gray-500 text-sm">Identifiant de verification</Text>
        <Text className="text-gray-900 font-bold text-lg mt-1">{receiptId}</Text>
        <Text className="text-gray-500 text-xs mt-2">Aucun candidat n apparait dans le recu.</Text>
        <Text className="text-gray-400 text-xs mt-1">Reference interne: {candidateId || "n/a"}</Text>
      </View>

      <TouchableOpacity
        className="h-14 rounded-xl bg-red-500 items-center justify-center mb-3"
        onPress={() => router.push({ pathname: "/receipt/verify", params: { receiptId } })}
      >
        <Text className="text-white font-semibold">Verifier ce recu</Text>
      </TouchableOpacity>

      <TouchableOpacity className="h-14 rounded-xl bg-gray-100 items-center justify-center" onPress={() => router.push("/results/live")}>
        <Text className="text-gray-700 font-semibold">Voir les resultats en direct</Text>
      </TouchableOpacity>
    </View>
  );
}
