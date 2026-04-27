# Fidio Face Recognition Backend

Backend API pour la reconnaissance faciale dans l'application de vote électronique Fidio.

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Copiez le fichier d'environnement :
```bash
cp .env.example .env
```

2. Configurez vos variables d'environnement dans `.env`

3. Téléchargez les modèles face-api.js :
   - Allez sur [face-api.js releases](https://github.com/justadudewhohacks/face-api.js/releases)
   - Téléchargez les modèles nécessaires :
     - `tiny_face_detector_model-weights_manifest.json`
     - `tiny_face_detector_model-shard1`
     - `face_landmark_68_model-weights_manifest.json`
     - `face_landmark_68_model-shard1`
     - `face_recognition_model-weights_manifest.json`
     - `face_recognition_model-shard1`
   - Placez-les dans le dossier `models/`

## Démarrage

```bash
# Développement
npm run dev

# Production
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Enregistrer un visage
```
POST /api/face-recognition/register
Content-Type: application/json

{
  "userId": "user_123456789",
  "cin": "101234567890",
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "imageMetadata": {
    "size": 250000,
    "format": "jpg",
    "timestamp": 1234567890
  }
}
```

### Vérifier un visage
```
POST /api/face-recognition/verify
Content-Type: application/json

{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "cin": "101234567890",
  "deviceId": "android"
}
```

### Vérifier si un utilisateur a des données faciales
```
GET /api/face-recognition/check?userId=user_123456789&cin=101234567890
```

### Supprimer les données faciales
```
DELETE /api/face-recognition/delete
Content-Type: application/json

{
  "userId": "user_123456789",
  "cin": "101234567890"
}
```

### Analyser la qualité d'une image
```
POST /api/face-recognition/analyze-quality
Content-Type: application/json

{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
}
```

## Base de données

L'application utilise SQLite avec trois tables :

- `users` : Informations des utilisateurs
- `face_data` : Descripteurs faciaux et métadonnées
- `verification_attempts` : Historique des tentatives de vérification

## Sécurité

- Les images sont analysées pour la qualité avant traitement
- Seuil de confiance configurable (défaut: 80%)
- Validation des formats et tailles d'images
- Logging des tentatives de vérification

## Développement

Le serveur inclut un mode simulation qui génère des descripteurs faciaux factices pour les tests. En production, vous devrez intégrer de vrais modèles de reconnaissance faciale.

## Déploiement

Pour la production :
1. Configurez `NODE_ENV=production`
2. Utilisez un reverse proxy (nginx/Apache)
3. Configurez HTTPS
4. Utilisez une base de données PostgreSQL pour plus de performance
5. Configurez des backups réguliers

## Support

Pour toute question sur l'API, contactez l'équipe de développement Fidio.
