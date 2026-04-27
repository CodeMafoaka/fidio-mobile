export type ChatContext = "login" | "otp" | "receipt" | "results" | "general";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function detectIntent(message: string) {
  const text = message.toLowerCase();
  if (text.includes("otp") || text.includes("code")) return "otp_help";
  if (text.includes("recu") || text.includes("reçu")) return "receipt_help";
  if (text.includes("resultat") || text.includes("resultats") || text.includes("résultat")) return "results_help";
  if (text.includes("inscri") || text.includes("register") || text.includes("compte")) return "register_help";
  return "general_help";
}

export async function askAssistant(message: string, context: ChatContext): Promise<string> {
  const intent = detectIntent(message);

  // Simulate network latency for a realistic chat feeling.
  await new Promise((resolve) => setTimeout(resolve, 450));

  if (intent === "otp_help") {
    return "Pour la demo, le code OTP est 473829. Saisis-le sur l'ecran OTP puis continue vers la verification biométrique.";
  }

  if (intent === "receipt_help") {
    return "Apres validation du vote, va sur l'ecran de succes puis appuie sur 'Verifier ce recu'. Tu verras l'identifiant du recu et son statut.";
  }

  if (intent === "results_help") {
    return "Tu peux consulter les resultats en direct depuis l'accueil via 'Resultats en temps reel'. Les pourcentages sont simules pour la demo.";
  }

  if (intent === "register_help") {
    return "Pour t'inscrire, ouvre l'ecran login puis clique sur 'Creer un compte'. Remplis les champs et valide pour passer a l'OTP.";
  }

  if (context === "login") {
    return "Je peux t'aider a te connecter ou creer un compte. Dis-moi ou tu bloques: CIN, mot de passe, OTP, ou navigation.";
  }

  if (context === "otp") {
    return "Tu es dans l'etape OTP. Tu peux saisir 473829 pour la simulation et continuer le parcours.";
  }

  return "Je suis l'assistant support de la plateforme de vote. Je peux t'aider sur inscription, OTP, recu et resultats.";
}
