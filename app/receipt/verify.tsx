import { useLocalSearchParams } from "expo-router";
import { SearchCheck } from "lucide-react-native";
import { useMemo } from "react";
import { StatusBar, Text, View } from "react-native";

export default function VerifyReceiptScreen() {
  const { receiptId } = useLocalSearchParams<{ receiptId?: string }>();
  const id = useMemo(() => receiptId || "REC-2026-123456", [receiptId]);

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="items-center mb-8">
        <SearchCheck size={42} color="#16A34A" />
        <Text className="text-2xl font-bold text-gray-900 mt-3">Verification du recu</Text>
      </View>

      <View className="rounded-2xl border border-gray-200 p-4">
        <Text className="text-gray-500 text-sm">Identifiant recu</Text>
        <Text className="text-gray-900 font-bold text-lg mt-1">{id}</Text>
        <Text className="text-green-700 mt-3 font-semibold">Statut: Recu valide</Text>
        <Text className="text-gray-500 text-sm mt-1">
          Ce recu confirme qu un vote a bien ete enregistre sans reveler le choix effectue.
        </Text>
      </View>
    </View>
  );
}
