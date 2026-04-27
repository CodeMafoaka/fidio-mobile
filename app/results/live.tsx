import { BarChart3 } from "lucide-react-native";
import { StatusBar, Text, View } from "react-native";

const RESULTS = [
  { name: "Andry R.", value: 42 },
  { name: "Miora L.", value: 35 },
  { name: "Tiana M.", value: 23 },
];

export default function LiveResultsScreen() {
  return (
    <View className="flex-1 bg-white px-6 pt-14">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-row items-center gap-2 mb-6">
        <BarChart3 size={22} color="#111827" />
        <Text className="text-2xl font-bold text-gray-900">Resultats en temps reel</Text>
      </View>

      {RESULTS.map((item) => (
        <View key={item.name} className="mb-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-gray-800 font-medium">{item.name}</Text>
            <Text className="text-gray-600">{item.value}%</Text>
          </View>
          <View className="h-3 rounded-full bg-gray-100 overflow-hidden">
            <View className="h-full bg-red-500" style={{ width: `${item.value}%` }} />
          </View>
        </View>
      ))}

      <Text className="text-gray-400 text-xs mt-2">Mise a jour: toutes les 5 secondes (simulation).</Text>
    </View>
  );
}
