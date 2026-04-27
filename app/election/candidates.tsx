import { useRouter } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import { useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

const CANDIDATES = [
  { id: "c1", name: "Andry R.", party: "Union citoyenne", desc: "Modernisation et emploi." },
  { id: "c2", name: "Miora L.", party: "Mada verte", desc: "Transition ecologique et locale." },
  { id: "c3", name: "Tiana M.", party: "Justice sociale", desc: "Education et transparence." },
];

export default function CandidatesScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("");

  return (
    <View className="flex-1 bg-white px-6 pt-14">
      <StatusBar barStyle="light-content" backgroundColor="#F9423A" />
      <Text className="text-2xl font-bold text-gray-900 mb-4">Liste des candidats</Text>

      {CANDIDATES.map((candidate) => (
        <TouchableOpacity
          key={candidate.id}
          className={`rounded-2xl border p-4 mb-3 ${
            selected === candidate.id ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"
          }`}
          onPress={() => setSelected(candidate.id)}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900 font-semibold">{candidate.name}</Text>
            {selected === candidate.id && <CheckCircle2 size={18} color="#F9423A" />}
          </View>
          <Text className="text-gray-600 text-sm mt-1">{candidate.party}</Text>
          <Text className="text-gray-500 text-sm mt-1">{candidate.desc}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        className={`h-14 rounded-xl items-center justify-center mt-2 ${
          selected ? "bg-red-500" : "bg-gray-300"
        }`}
        disabled={!selected}
        onPress={() => router.push({ pathname: "/election/confirm", params: { candidateId: selected } })}
      >
        <Text className="text-white font-semibold">Continuer</Text>
      </TouchableOpacity>
    </View>
  );
}
