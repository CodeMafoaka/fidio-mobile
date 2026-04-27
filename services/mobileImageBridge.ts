import * as SecureStore from 'expo-secure-store';

export interface MobileImageData {
  id: string;
  userId: string;
  cin: string;
  imageBase64: string;
  imageMetadata: {
    size: number;
    format: string;
    timestamp: number;
  };
  createdAt: number;
  faceDescriptor: number[];
}

/**
 * Service pont pour que le backend puisse récupérer les images du mobile
 */
class MobileImageBridge {
  private readonly FACE_DATA_KEY = 'fidio_face_data';
  private readonly IMAGE_PREFIX = 'fidio_image_';

  /**
   * Récupère toutes les données faciales avec images pour un utilisateur
   */
  async getAllFaceDataWithImages(userId?: string, cin?: string): Promise<MobileImageData[]> {
    try {
      console.log('🔍 Récupération données faciales avec images:', { userId, cin });
      
      // Récupère les données faciales de base
      const faceDataStr = await SecureStore.getItemAsync(this.FACE_DATA_KEY);
      if (!faceDataStr) {
        console.log('❌ Aucune donnée faciale trouvée');
        return [];
      }

      const allFaceData = JSON.parse(faceDataStr);
      
      // Filtre par utilisateur si spécifié
      const filteredData = userId || cin 
        ? allFaceData.filter((data: any) => data.userId === userId || data.cin === cin)
        : allFaceData;

      console.log(`📊 ${filteredData.length} données faciales trouvées après filtrage`);

      // Récupère les images pour chaque donnée faciale
      const imageData: MobileImageData[] = [];
      
      for (const faceData of filteredData) {
        try {
          const imageKey = `${this.IMAGE_PREFIX}${faceData.id}`;
          const imageBase64 = await SecureStore.getItemAsync(imageKey);
          
          if (imageBase64) {
            imageData.push({
              id: faceData.id,
              userId: faceData.userId,
              cin: faceData.cin,
              imageBase64,
              imageMetadata: faceData.imageMetadata,
              createdAt: faceData.createdAt,
              faceDescriptor: faceData.faceDescriptor
            });
            console.log(`✅ Image récupérée pour ${faceData.cin}`);
          } else {
            console.log(`⚠️ Image non trouvée pour ${faceData.cin}`);
          }
        } catch (error) {
          console.error(`❌ Erreur récupération image pour ${faceData.cin}:`, error);
        }
      }

      console.log(`📸 ${imageData.length} images complètes récupérées`);
      return imageData;
    } catch (error) {
      console.error('❌ Erreur récupération données faciales avec images:', error);
      return [];
    }
  }

  /**
   * Récupère une image spécifique par ID
   */
  async getImageById(imageId: string): Promise<string | null> {
    try {
      const imageKey = `${this.IMAGE_PREFIX}${imageId}`;
      const imageBase64 = await SecureStore.getItemAsync(imageKey);
      console.log(`🔍 Image ${imageId}:`, imageBase64 ? 'trouvée' : 'non trouvée');
      return imageBase64;
    } catch (error) {
      console.error(`❌ Erreur récupération image ${imageId}:`, error);
      return null;
    }
  }

  /**
   * Récupère les images pour un CIN spécifique
   */
  async getImagesByCin(cin: string): Promise<MobileImageData[]> {
    return this.getAllFaceDataWithImages(undefined, cin);
  }

  /**
   * Récupère les images pour un userId spécifique
   */
  async getImagesByUserId(userId: string): Promise<MobileImageData[]> {
    return this.getAllFaceDataWithImages(userId, undefined);
  }

  /**
   * Prépare les données pour l'envoi au backend
   */
  async prepareDataForBackend(userId?: string, cin?: string): Promise<{
    success: boolean;
    data: MobileImageData[];
    error?: string;
  }> {
    try {
      const imageData = await this.getAllFaceDataWithImages(userId, cin);
      
      if (imageData.length === 0) {
        return {
          success: false,
          data: [],
          error: 'Aucune donnée faciale trouvée'
        };
      }

      // Formate les données pour le backend
      const backendData = imageData.map(data => ({
        id: data.id,
        userId: data.userId,
        cin: data.cin,
        imageBase64: data.imageBase64,
        faceDescriptor: data.faceDescriptor,
        imageMetadata: data.imageMetadata,
        createdAt: data.createdAt,
        createdAtString: new Date(data.createdAt).toISOString()
      }));

      console.log(`📤 ${backendData.length} données préparées pour le backend`);
      
      return {
        success: true,
        data: backendData
      };
    } catch (error) {
      console.error('❌ Erreur préparation données backend:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Exporte toutes les données (pour debug/admin)
   */
  async exportAllData(): Promise<{
    faceDataCount: number;
    imageCount: number;
    totalSize: number;
    data: MobileImageData[];
  }> {
    try {
      const allData = await this.getAllFaceDataWithImages();
      
      let totalSize = 0;
      for (const data of allData) {
        totalSize += data.imageBase64.length;
      }

      return {
        faceDataCount: allData.length,
        imageCount: allData.length,
        totalSize: Math.round(totalSize / 1024 / 1024 * 100) / 100, // en MB
        data: allData
      };
    } catch (error) {
      console.error('❌ Erreur export données:', error);
      return {
        faceDataCount: 0,
        imageCount: 0,
        totalSize: 0,
        data: []
      };
    }
  }

  /**
   * Vérifie l'intégrité des données stockées
   */
  async verifyDataIntegrity(): Promise<{
    valid: boolean;
    issues: string[];
    faceDataCount: number;
    imageCount: number;
  }> {
    try {
      const faceDataStr = await SecureStore.getItemAsync(this.FACE_DATA_KEY);
      if (!faceDataStr) {
        return {
          valid: false,
          issues: ['Aucune donnée faciale stockée'],
          faceDataCount: 0,
          imageCount: 0
        };
      }

      const allFaceData = JSON.parse(faceDataStr);
      const issues: string[] = [];
      let imageCount = 0;

      for (const faceData of allFaceData) {
        const imageKey = `${this.IMAGE_PREFIX}${faceData.id}`;
        const imageExists = await SecureStore.getItemAsync(imageKey);
        
        if (imageExists) {
          imageCount++;
        } else {
          issues.push(`Image manquante pour ${faceData.cin}`);
        }
      }

      return {
        valid: issues.length === 0,
        issues,
        faceDataCount: allFaceData.length,
        imageCount
      };
    } catch (error) {
      console.error('❌ Erreur vérification intégrité:', error);
      return {
        valid: false,
        issues: ['Erreur lors de la vérification'],
        faceDataCount: 0,
        imageCount: 0
      };
    }
  }
}

export default new MobileImageBridge();
