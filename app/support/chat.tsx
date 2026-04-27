import { useLocalSearchParams } from "expo-router";
import { Bot, SendHorizontal, Sparkles } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { askAssistant, ChatContext, ChatMessage } from "@/lib/chatAssistant";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ChatSupportScreen() {
  const params = useLocalSearchParams<{ context?: string }>();
  const context = (params.context as ChatContext) || "general";
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: makeId(),
      role: "assistant",
      text: "Bonjour, je suis ton assistant support. Pose-moi une question sur l'inscription, l'OTP, le recu ou les resultats.",
    },
  ]);

  const quickActions = useMemo(
    () => [
      "Comment obtenir le code OTP ?",
      "Comment verifier mon recu ?",
      "Ou voir les resultats ?",
    ],
    []
  );

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { id: makeId(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const answer = await askAssistant(trimmed, context);
    const assistantMessage: ChatMessage = { id: makeId(), role: "assistant", text: answer };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <View className="flex-1 bg-white pt-12">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="px-5 pb-3 border-b border-gray-100 flex-row items-center gap-2">
        <Bot size={20} color="#111827" />
        <Text className="text-lg font-bold text-gray-900">Assistant IA</Text>
        <View className="ml-auto bg-gray-100 rounded-full px-2 py-1">
          <Text className="text-[11px] text-gray-600">{context}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 py-4" contentContainerStyle={{ gap: 10 }}>
        {messages.map((message) => (
          <View
            key={message.id}
            className={`max-w-[90%] rounded-2xl px-4 py-3 ${
              message.role === "assistant" ? "bg-gray-100 self-start" : "bg-red-500 self-end"
            }`}
          >
            <Text className={message.role === "assistant" ? "text-gray-800" : "text-white"}>{message.text}</Text>
          </View>
        ))}

        {isLoading && (
          <View className="bg-gray-100 self-start rounded-2xl px-4 py-3">
            <Text className="text-gray-600">Assistant en train d'ecrire...</Text>
          </View>
        )}
      </ScrollView>

      <View className="px-5 pb-3">
        <View className="flex-row flex-wrap gap-2 mb-3">
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action}
              className="rounded-full border border-gray-200 px-3 py-2 flex-row items-center gap-1"
              onPress={() => sendMessage(action)}
            >
              <Sparkles size={12} color="#6B7280" />
              <Text className="text-xs text-gray-700">{action}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row items-center gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ecris ton message..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 h-12 bg-gray-100 rounded-xl px-4 text-gray-900"
          />
          <TouchableOpacity className="w-12 h-12 rounded-xl bg-red-500 items-center justify-center" onPress={() => sendMessage(input)}>
            <SendHorizontal size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
