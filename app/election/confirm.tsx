import { useLocalSearchParams, useRouter } from "expo-router";
import { AlertTriangle } from "lucide-react-native";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function ConfirmVoteScreen() {
  const router = useRouter();
  const { candidateId } = useLocalSearchParams<{ candidateId?: string }>();

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      <StatusBar barStyle="light-content" backgroundColor="#F9423A" />
      <Text className="text-2xl font-bold text-gray-900 mb-4">Confirmation finale</Text>

      <View className="rounded-2xl bg-red-50 border border-red-200 p-4 mb-6">
        <View className="flex-row items-center gap-2 mb-2">
          <AlertTriangle size={18} color="#DC2626" />
          <Text className="text-red-700 font-semibold">Action irreversible</Text>
        </View>
        <Text className="text-red-700 text-sm">Apres validation, votre vote ne peut plus etre modifie.</Text>
      </View>

      <View className="rounded-2xl border border-gray-200 p-4 mb-8">
        <Text className="text-gray-600 text-sm">Candidat selectionne</Text>
        <Text className="text-gray-900 text-lg font-semibold mt-1">{candidateId || "Non defini"}</Text>
      </View>

      <TouchableOpacity
        className="h-14 rounded-xl bg-red-500 items-center justify-center mb-3"
        onPress={() => router.replace({ pathname: "/election/success", params: { candidateId: candidateId ?? "" } })}
      >
        <Text className="text-white font-semibold">Valider mon vote</Text>
      </TouchableOpacity>

      <TouchableOpacity className="h-14 rounded-xl bg-gray-100 items-center justify-center" onPress={() => router.back()}>
        <Text className="text-gray-700 font-semibold">Annuler</Text>
      </TouchableOpacity>
    </View>
  );
}
