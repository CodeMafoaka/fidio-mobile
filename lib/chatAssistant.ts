export type ChatContext = "login" | "election" | "results" | "profile" | "general";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function detectIntent(message: string) {
  const text = message.toLowerCase().trim();
  
  // Greeting detection
  if (text === "bonjour" || text === "salut" || text === "hello" || text === "hi") {
    return "greeting";
  }
  
  // Election-specific intents
  if (text.includes("election") || text.includes("vote") || text.includes("candidat") || text.includes("scrutin")) return "election_help";
  if (text.includes("resultat") || text.includes("resultats") || text.includes("résultat") || text.includes("depouillement")) return "results_help";
  if (text.includes("profil") || text.includes("compte") || text.includes("identité") || text.includes("informations")) return "profile_help";
  if (text.includes("securite") || text.includes("sécurité") || text.includes("authentification") || text.includes("biometrie")) return "security_help";
  if (text.includes("inscription") || text.includes("register") || text.includes("creer compte") || text.includes("s'inscrire")) return "register_help";
  
  // Check if message is about the application
  const appKeywords = ["fidio", "application", "app", "plateforme", "systeme", "système", "connexion", "login", "vote", "election"];
  const isAppRelated = appKeywords.some(keyword => text.includes(keyword));
  
  if (!isAppRelated && text.length > 10) {
    return "out_of_scope";
  }
  
  return "general_help";
}

export async function askAssistant(message: string, context: ChatContext): Promise<string> {
  const intent = detectIntent(message);

  // Simulate network latency for a realistic chat feeling.
  await new Promise((resolve) => setTimeout(resolve, 450));

  if (intent === "greeting") {
    return "Bonjour ! Je suis l'assistant Fidio, votre guide pour la plateforme de vote électronique sécurisé. Comment puis-je vous aider avec l'élection, votre profil ou les résultats ?";
  }

  if (intent === "out_of_scope") {
    return "Je suis spécialisé dans l'assistance pour la plateforme Fidio. Je peux vous aider concernant les élections, le vote, les résultats, votre profil et la sécurité. Pour toute autre question, veuillez contacter le support technique.";
  }

  if (intent === "election_help") {
    return "Pour participer à l'élection, accédez à l'écran d'accueil et cliquez sur 'Accéder à l'élection active'. Vous pourrez consulter les candidats et déposer votre vote de manière sécurisée et anonyme.";
  }

  if (intent === "results_help") {
    return "Vous pouvez consulter les résultats en temps réel depuis l'accueil via 'Résultats en temps réel'. Le dépouillement s'affiche en direct avec les pourcentages mis à jour.";
  }

  if (intent === "profile_help") {
    return "Pour gérer votre profil, cliquez sur votre avatar en haut à droite de l'accueil. Vous pourrez consulter vos informations personnelles, votre historique de vote et vos paramètres de sécurité.";
  }

  if (intent === "security_help") {
    return "Fidio utilise une authentification biométrique et un vote chiffré pour garantir la sécurité. Votre identité n'est jamais associée à votre choix. Le bulletin est cryptographiquement signé pour assurer l'anonymat.";
  }

  if (intent === "register_help") {
    return "Pour vous inscrire, allez sur l'écran de connexion et cliquez sur 'Créer un compte'. Remplissez vos informations, puis passez par l'authentification biométrique pour sécuriser votre compte.";
  }

  if (context === "login") {
    return "Je peux vous aider avec la connexion ou la création de compte. Dites-moi où vous bloquez : identifiants, authentification biométrique ou navigation.";
  }

  if (context === "election") {
    return "Vous êtes dans la section élection. Je peux vous aider sur le processus de vote, les candidats disponibles ou la sécurité du scrutin.";
  }

  if (context === "results") {
    return "Vous consultez les résultats. Je peux expliquer le déroulement du dépouillement et l'affichage des pourcentages en temps réel.";
  }

  if (context === "profile") {
    return "Vous êtes dans votre profil. Je peux vous aider à gérer vos informations personnelles, consulter votre historique de vote ou configurer la sécurité.";
  }

  return "Je suis l'assistant support de Fidio, la plateforme de vote électronique sécurisé. Je peux vous aider sur les élections, le vote, les résultats, votre profil et la sécurité.";
}
