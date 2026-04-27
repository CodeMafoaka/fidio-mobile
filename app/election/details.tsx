import { useRouter } from "expo-router";
import { CalendarClock, ChevronRight } from "lucide-react-native";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function ElectionDetailsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      <StatusBar barStyle="light-content" backgroundColor="#F9423A" />
      <Text className="text-2xl font-bold text-gray-900 mb-4">Election active</Text>

      <View className="rounded-2xl border border-gray-200 p-4 mb-6">
        <Text className="text-lg font-semibold text-gray-900">Election presidentielle 2026</Text>
        <Text className="text-gray-600 mt-1">Selection d un candidat unique.</Text>
        <View className="flex-row items-center gap-2 mt-3">
          <CalendarClock size={16} color="#6B7280" />
          <Text className="text-gray-500 text-sm">Ouverte jusqu au 30 avril 2026</Text>
        </View>
      </View>

      <TouchableOpacity
        className="h-14 rounded-xl bg-red-500 flex-row items-center justify-center gap-2"
        onPress={() => router.push("/election/candidates")}
      >
        <Text className="text-white font-semibold">Voir les candidats</Text>
        <ChevronRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
