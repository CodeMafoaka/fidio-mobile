import { useLocalSearchParams, useRouter } from "expo-router";
import { BarChart3, FileCheck2, Vote } from "lucide-react-native";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { cin } = useLocalSearchParams<{ cin?: string }>();

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      <StatusBar barStyle="light-content" backgroundColor="#F9423A" />
      <View className="bg-red-500 rounded-2xl p-5 mb-8">
        <Text className="text-white text-xl font-bold">Accueil electeur</Text>
        <Text className="text-white/80 mt-1">Bienvenue {cin || "electeur"}.</Text>
      </View>

      <TouchableOpacity
        className="h-14 rounded-xl bg-red-500 flex-row items-center justify-center gap-2 mb-3"
        onPress={() => router.push("/election/details")}
      >
        <Vote size={20} color="#FFFFFF" />
        <Text className="text-white font-semibold">Acceder a l election active</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="h-14 rounded-xl bg-gray-100 flex-row items-center justify-center gap-2 mb-3"
        onPress={() => router.push("/receipt/verify")}
      >
        <FileCheck2 size={20} color="#374151" />
        <Text className="text-gray-800 font-semibold">Verifier un recu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="h-14 rounded-xl bg-gray-100 flex-row items-center justify-center gap-2"
        onPress={() => router.push("/results/live")}
      >
        <BarChart3 size={20} color="#374151" />
        <Text className="text-gray-800 font-semibold">Resultats en temps reel</Text>
      </TouchableOpacity>
    </View>
  );
}
