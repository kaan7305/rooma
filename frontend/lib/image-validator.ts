import * as mobilenet from '@tensorflow-models/mobilenet';

// Property-related keywords that should be in legitimate property photos
const VALID_PROPERTY_KEYWORDS = [
  // Buildings & Architecture
  'house', 'home', 'building', 'apartment', 'studio', 'cottage', 'villa',
  'architecture', 'facade', 'exterior', 'balcony', 'window', 'door',

  // Rooms
  'room', 'bedroom', 'kitchen', 'bathroom', 'living room', 'dining room',
  'hallway', 'foyer', 'lobby', 'corridor',

  // Furniture & Interior
  'furniture', 'couch', 'sofa', 'bed', 'table', 'chair', 'desk', 'cabinet',
  'wardrobe', 'closet', 'shelf', 'bookcase', 'dresser', 'nightstand',

  // Appliances
  'refrigerator', 'stove', 'oven', 'microwave', 'dishwasher', 'washer',
  'sink', 'bathtub', 'shower', 'toilet',

  // Interior Features
  'fireplace', 'ceiling', 'floor', 'wall', 'carpet', 'hardwood',
  'tile', 'lamp', 'chandelier', 'mirror', 'curtain',

  // Outdoor/Exterior
  'patio', 'deck', 'yard', 'garden', 'pool', 'garage', 'driveway',
  'lawn', 'fence', 'porch'
];

// Keywords that indicate NOT a property photo
const INVALID_KEYWORDS = [
  // Computer/Tech UI
  'screen', 'monitor', 'computer', 'laptop', 'desktop', 'keyboard',
  'mouse', 'display', 'browser', 'window', 'menu', 'toolbar',

  // Documents
  'document', 'paper', 'text', 'book', 'page', 'file', 'folder',

  // People (unless in context of showing space)
  'person', 'face', 'portrait', 'selfie',

  // Random objects
  'food', 'animal', 'pet', 'toy', 'clothing', 'shoe'
];

let modelCache: mobilenet.MobileNet | null = null;

export async function loadModel(): Promise<mobilenet.MobileNet> {
  if (modelCache) {
    return modelCache;
  }

  try {
    console.log('Loading MobileNet model...');
    const model = await mobilenet.load({
      version: 2,
      alpha: 1.0,
    });
    modelCache = model;
    console.log('MobileNet model loaded successfully');
    return model;
  } catch (error) {
    console.error('Failed to load MobileNet model:', error);
    throw new Error('Failed to load AI model for image validation');
  }
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  reason: string;
  detectedObjects: string[];
  suggestions?: string;
}

export async function validatePropertyImage(imageElement: HTMLImageElement): Promise<ValidationResult> {
  try {
    const model = await loadModel();

    // Get predictions from the model
    const predictions = await model.classify(imageElement, 10); // Get top 10 predictions

    console.log('Image predictions:', predictions);

    if (!predictions || predictions.length === 0) {
      return {
        isValid: false,
        confidence: 0,
        reason: 'Unable to analyze image content',
        detectedObjects: [],
        suggestions: 'Please upload a clear, well-lit photo of the property'
      };
    }

    const detectedObjects = predictions.map(p => p.className.toLowerCase());
    const topPrediction = predictions[0];

    // Check for invalid keywords (screenshots, documents, etc.)
    const hasInvalidContent = detectedObjects.some(obj =>
      INVALID_KEYWORDS.some(keyword => obj.includes(keyword))
    );

    if (hasInvalidContent) {
      return {
        isValid: false,
        confidence: topPrediction.probability,
        reason: `This appears to be a ${topPrediction.className}, not a property photo`,
        detectedObjects,
        suggestions: 'Please upload actual photos of the property interior or exterior, not screenshots or documents'
      };
    }

    // Check for valid property-related content
    const hasValidContent = detectedObjects.some(obj =>
      VALID_PROPERTY_KEYWORDS.some(keyword => obj.includes(keyword))
    );

    // Calculate overall confidence
    const validPredictions = predictions.filter(p =>
      VALID_PROPERTY_KEYWORDS.some(keyword =>
        p.className.toLowerCase().includes(keyword)
      )
    );

    const totalValidConfidence = validPredictions.reduce((sum, p) => sum + p.probability, 0);

    // Relaxed validation: Accept if there's reasonable confidence
    if (hasValidContent && totalValidConfidence > 0.15) {
      return {
        isValid: true,
        confidence: totalValidConfidence,
        reason: `Detected property-related content: ${validPredictions.map(p => p.className).join(', ')}`,
        detectedObjects
      };
    }

    // Check if image might be interior/architecture even if not explicitly detected
    // Look for common indoor/architectural features
    const architecturalKeywords = ['indoor', 'architecture', 'structure', 'space'];
    const hasArchitecturalFeatures = detectedObjects.some(obj =>
      architecturalKeywords.some(keyword => obj.includes(keyword))
    );

    if (hasArchitecturalFeatures) {
      return {
        isValid: true,
        confidence: 0.5,
        reason: 'Detected architectural or interior features',
        detectedObjects
      };
    }

    // If confidence is too low or no valid property content detected
    return {
      isValid: false,
      confidence: totalValidConfidence,
      reason: `Cannot verify this is a property photo. Detected: ${topPrediction.className}`,
      detectedObjects,
      suggestions: 'Please upload clear photos showing rooms, furniture, or the building exterior'
    };

  } catch (error) {
    console.error('Image validation error:', error);
    return {
      isValid: false,
      confidence: 0,
      reason: 'Error analyzing image',
      detectedObjects: [],
      suggestions: 'Please try uploading a different image'
    };
  }
}

// Helper function to create an image element from base64
export function base64ToImageElement(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));

    img.src = base64;
  });
}
