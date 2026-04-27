import { useLocalSearchParams, useRouter } from "expo-router";
import { Fingerprint, ScanFace, ShieldCheck } from "lucide-react-native";
import { Alert, StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function BiometricScreen() {
  const router = useRouter();
  const { cin } = useLocalSearchParams<{ cin?: string }>();

  const validateBiometric = (method: "fingerprint" | "face") => {
    Alert.alert("Validation", `Verification ${method === "fingerprint" ? "empreinte" : "faciale"} reussie.`);
    router.replace({ pathname: "/home", params: { cin: cin ?? "" } });
  };

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      <StatusBar barStyle="light-content" backgroundColor="#F9423A" />
      <View className="bg-red-500 rounded-2xl p-5 mb-8">
        <Text className="text-white text-xl font-bold">Verification biométrique</Text>
        <Text className="text-white/80 mt-1">Derniere etape avant acces a l election.</Text>
      </View>

      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center">
          <ShieldCheck size={36} color="#F9423A" />
        </View>
        <Text className="text-gray-700 text-center mt-3">CIN: {cin || "***"}</Text>
      </View>

      <TouchableOpacity
        className="h-14 rounded-xl bg-gray-100 flex-row items-center justify-center gap-2 mb-3"
        onPress={() => validateBiometric("fingerprint")}
      >
        <Fingerprint size={20} color="#374151" />
        <Text className="text-gray-800 font-semibold">Verifier par empreinte</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="h-14 rounded-xl bg-gray-100 flex-row items-center justify-center gap-2"
        onPress={() => validateBiometric("face")}
      >
        <ScanFace size={20} color="#374151" />
        <Text className="text-gray-800 font-semibold">Verifier par reconnaissance faciale</Text>
      </TouchableOpacity>
    </View>
  );
}
