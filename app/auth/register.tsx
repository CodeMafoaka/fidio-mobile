import { useRouter } from "expo-router";
import { CircleCheckBig, UserPlus } from "lucide-react-native";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [cin, setCin] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!fullName.trim() || !cin.trim() || !phone.trim() || !password.trim()) {
      Alert.alert("Champ requis", "Veuillez remplir tous les champs.");
      return;
    }

    Alert.alert("Inscription reussie", "Votre compte electeur est cree.", [
      { text: "Continuer", onPress: () => router.replace({ pathname: "/OTP", params: { cin } }) },
    ]);
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar barStyle="light-content" backgroundColor="#F9423A" />
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View className="bg-red-500 pt-12 px-5 pb-10">
          <Text className="text-white text-[22px] font-bold tracking-tight mb-1.5">Inscription electeur</Text>
          <Text className="text-white/80 text-sm">Creez votre acces securise au vote electronique.</Text>
        </View>

        <View className="items-center mt-[-26px] mb-5">
          <View className="w-13 h-13 rounded-full bg-white border-3 border-white items-center justify-center shadow-lg shadow-red-500/20">
            <UserPlus size={22} color="#F9423A" strokeWidth={2.2} />
          </View>
        </View>

        <View className="px-5 pb-8">
          <View className="mb-3.5">
            <Text className="text-xs text-gray-500 font-semibold tracking-wide mb-1.5">NOM COMPLET</Text>
            <TextInput
              className="h-12 border-[1.5px] border-gray-200 rounded-xl px-3.5 bg-white text-sm text-gray-900"
              placeholder="Ex : Rakoto Jean"
              placeholderTextColor="#888888"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View className="mb-3.5">
            <Text className="text-xs text-gray-500 font-semibold tracking-wide mb-1.5">NUMERO CIN</Text>
            <TextInput
              className="h-12 border-[1.5px] border-gray-200 rounded-xl px-3.5 bg-white text-sm text-gray-900"
              placeholder="Ex : 101 234 567 890"
              placeholderTextColor="#888888"
              value={cin}
              onChangeText={setCin}
              keyboardType="numeric"
            />
          </View>

          <View className="mb-3.5">
            <Text className="text-xs text-gray-500 font-semibold tracking-wide mb-1.5">TELEPHONE</Text>
            <TextInput
              className="h-12 border-[1.5px] border-gray-200 rounded-xl px-3.5 bg-white text-sm text-gray-900"
              placeholder="Ex : +261 32 00 000 00"
              placeholderTextColor="#888888"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs text-gray-500 font-semibold tracking-wide mb-1.5">MOT DE PASSE</Text>
            <TextInput
              className="h-12 border-[1.5px] border-gray-200 rounded-xl px-3.5 bg-white text-sm text-gray-900"
              placeholder="Definir un mot de passe"
              placeholderTextColor="#888888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity className="h-13 bg-red-500 rounded-[14px] items-center justify-center" onPress={handleRegister} activeOpacity={0.85}>
            <View className="flex-row items-center gap-2">
              <CircleCheckBig size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text className="text-white text-[15px] font-bold tracking-wide">S inscrire</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="items-center mt-4" onPress={() => router.replace("/auth/login")}>
            <Text className="text-xs text-gray-500">
              Deja inscrit ? <Text className="text-red-500 font-semibold">Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
