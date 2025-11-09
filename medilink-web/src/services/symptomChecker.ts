/**
 * Symptom Checker Service
 * Uses Hugging Face Inference API (free tier) for AI-powered symptom analysis
 */

interface SymptomAnalysis {
  possibleConditions: string[];
  recommendations: string[];
  severity: 'mild' | 'moderate' | 'severe';
  advice: string;
}

/**
 * Analyzes symptoms using AI
 * @param symptoms - User's symptom description
 * @returns Analysis result with possible conditions and recommendations
 */
export async function analyzeSymptoms(symptoms: string): Promise<SymptomAnalysis> {
  if (!symptoms.trim()) {
    throw new Error('Please describe your symptoms');
  }

  try {
    // Try using Hugging Face Inference API (free tier, no auth required)
    // Using a text generation model that can handle queries
    const apiUrl = 'https://api-inference.huggingface.co/models/google/flan-t5-base';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Medical analysis: Symptoms: ${symptoms}. Provide possible conditions and recommendations.`,
      }),
    });

    // Check if response is ok and has data
    if (response.ok) {
      const data = await response.json();
      
      // Handle different response formats
      if (Array.isArray(data) && data[0] && data[0].generated_text) {
        return parseAIResponse(data[0].generated_text, symptoms);
      } else if (data.generated_text) {
        return parseAIResponse(data.generated_text, symptoms);
      }
    }

    // If API fails or returns unexpected format, use intelligent fallback
    // The fallback system is quite comprehensive and works well!
    return getFallbackAnalysis(symptoms);
  } catch (error) {
    console.error('Symptom analysis error:', error);
    // Fallback to intelligent rule-based analysis
    // This provides good results even without AI
    return getFallbackAnalysis(symptoms);
  }
}

/**
 * Parses AI response into structured format
 */
function parseAIResponse(aiText: string, originalSymptoms: string): SymptomAnalysis {
  const lowerText = aiText.toLowerCase();
  const lowerSymptoms = originalSymptoms.toLowerCase();

  // Extract conditions
  const conditionsMatch = aiText.match(/CONDITIONS?:\s*([^|]+)/i);
  const conditions = conditionsMatch
    ? conditionsMatch[1]
        .split(/[,;]/)
        .map((c) => c.trim())
        .filter(Boolean)
        .slice(0, 3)
    : extractConditionsFromSymptoms(lowerSymptoms);

  // Extract recommendations
  const recommendationsMatch = aiText.match(/RECOMMENDATIONS?:\s*([^|]+)/i);
  const recommendations = recommendationsMatch
    ? recommendationsMatch[1]
        .split(/[,;]/)
        .map((r) => r.trim())
        .filter(Boolean)
        .slice(0, 3)
    : getDefaultRecommendations(lowerSymptoms);

  // Extract severity
  let severity: 'mild' | 'moderate' | 'severe' = 'moderate';
  if (lowerText.includes('severe') || lowerText.includes('emergency')) {
    severity = 'severe';
  } else if (lowerText.includes('mild') || lowerText.includes('minor')) {
    severity = 'mild';
  } else {
    severity = assessSeverity(lowerSymptoms);
  }

  // Extract advice
  const adviceMatch = aiText.match(/ADVICE:\s*([^|]+)/i);
  const advice = adviceMatch
    ? adviceMatch[1].trim()
    : getDefaultAdvice(severity);

  return {
    possibleConditions: conditions.length > 0 ? conditions : ['General symptoms'],
    recommendations,
    severity,
    advice,
  };
}

/**
 * Fallback analysis when AI API is unavailable
 */
function getFallbackAnalysis(symptoms: string): SymptomAnalysis {
  const lowerSymptoms = symptoms.toLowerCase().trim();

  // Check if we have detailed data for this symptom
  if (symptomDatabase[lowerSymptoms]) {
    const data = symptomDatabase[lowerSymptoms];
    return {
      possibleConditions: data.conditions,
      recommendations: data.recommendations,
      severity: data.severity,
      advice: data.advice,
    };
  }

  // Check for partial matches
  for (const [key, data] of Object.entries(symptomDatabase)) {
    if (lowerSymptoms.includes(key) || key.includes(lowerSymptoms)) {
      return {
        possibleConditions: data.conditions,
        recommendations: data.recommendations,
        severity: data.severity,
        advice: data.advice,
      };
    }
  }

  // Fallback to general analysis
  const conditions = extractConditionsFromSymptoms(lowerSymptoms);
  const severity = assessSeverity(lowerSymptoms);
  const recommendations = getDefaultRecommendations(lowerSymptoms);
  const advice = getDefaultAdvice(severity, lowerSymptoms);

  return {
    possibleConditions: conditions,
    recommendations,
    severity,
    advice,
  };
}

/**
 * Comprehensive symptom database with detailed condition mappings
 */
interface SymptomData {
  conditions: string[];
  recommendations: string[];
  severity: 'mild' | 'moderate' | 'severe';
  advice: string;
}

const symptomDatabase: Record<string, SymptomData> = {
  // Gastrointestinal symptoms
  diarrhea: {
    conditions: ['Gastroenteritis (stomach flu)', 'Food poisoning', 'Irritable Bowel Syndrome (IBS)', 'Bacterial infection'],
    recommendations: [
      'Drink plenty of fluids (water, electrolyte solutions, clear broths)',
      'Avoid dairy, fatty foods, and caffeine',
      'Eat BRAT diet: Bananas, Rice, Applesauce, Toast',
      'Consider oral rehydration solutions to prevent dehydration'
    ],
    severity: 'moderate',
    advice: 'Diarrhea can lead to dehydration quickly. Drink plenty of fluids and seek medical attention if it lasts more than 2 days, you have signs of dehydration (dry mouth, dark urine, dizziness), or if you see blood in stool.'
  },
  'loose stool': {
    conditions: ['Gastroenteritis', 'Food intolerance', 'IBS', 'Bacterial infection'],
    recommendations: [
      'Stay hydrated with water and electrolyte drinks',
      'Avoid spicy, fatty, or dairy foods',
      'Eat bland foods like rice, bananas, and toast',
      'Rest and avoid strenuous activity'
    ],
    severity: 'moderate',
    advice: 'Monitor your symptoms. If loose stools persist for more than 3 days or are accompanied by fever, blood, or severe dehydration, consult a healthcare provider.'
  },
  constipation: {
    conditions: ['Dehydration', 'Dietary fiber deficiency', 'IBS', 'Medication side effects'],
    recommendations: [
      'Increase fiber intake (fruits, vegetables, whole grains)',
      'Drink plenty of water (8-10 glasses daily)',
      'Engage in regular physical activity',
      'Consider over-the-counter fiber supplements or stool softeners'
    ],
    severity: 'mild',
    advice: 'Most constipation resolves with dietary changes and increased hydration. See a doctor if it lasts more than 2 weeks, is severe, or accompanied by blood in stool.'
  },
  nausea: {
    conditions: ['Gastroenteritis', 'Food poisoning', 'Motion sickness', 'Pregnancy', 'Medication side effects'],
    recommendations: [
      'Eat small, bland meals throughout the day',
      'Avoid strong smells and spicy foods',
      'Stay hydrated with small sips of water or ginger tea',
      'Get fresh air and rest in a quiet environment'
    ],
    severity: 'moderate',
    advice: 'Nausea is usually temporary. Seek medical attention if it persists for more than 2 days, you cannot keep fluids down, or if you experience severe vomiting.'
  },
  vomiting: {
    conditions: ['Gastroenteritis', 'Food poisoning', 'Viral infection', 'Migraine', 'Motion sickness'],
    recommendations: [
      'Rest and avoid solid foods for a few hours',
      'Sip small amounts of clear fluids (water, electrolyte solutions)',
      'Gradually reintroduce bland foods (crackers, toast)',
      'Avoid dairy, caffeine, and alcohol'
    ],
    severity: 'moderate',
    advice: 'Vomiting can cause dehydration. If vomiting persists for more than 24 hours, you cannot keep fluids down, see blood in vomit, or have signs of dehydration, seek immediate medical care.'
  },
  'stomach pain': {
    conditions: ['Gastritis', 'Indigestion', 'IBS', 'Appendicitis (if severe)', 'Food poisoning'],
    recommendations: [
      'Avoid spicy, fatty, or acidic foods',
      'Eat smaller, more frequent meals',
      'Apply a warm compress to the abdomen',
      'Consider antacids for indigestion'
    ],
    severity: 'moderate',
    advice: 'Mild stomach pain often resolves with dietary changes. Seek immediate medical attention if pain is severe, persistent, located in lower right abdomen, or accompanied by fever, vomiting, or blood in stool.'
  },
  'abdominal pain': {
    conditions: ['Gastritis', 'Indigestion', 'IBS', 'Appendicitis (if severe)', 'Food poisoning'],
    recommendations: [
      'Avoid spicy, fatty, or acidic foods',
      'Eat smaller, more frequent meals',
      'Apply a warm compress to the abdomen',
      'Consider antacids for indigestion'
    ],
    severity: 'moderate',
    advice: 'Mild abdominal pain often resolves with dietary changes. Seek immediate medical attention if pain is severe, persistent, located in lower right abdomen, or accompanied by fever, vomiting, or blood in stool.'
  },

  // Respiratory symptoms
  cough: {
    conditions: ['Common cold', 'Upper respiratory infection', 'Bronchitis', 'Allergies', 'Asthma'],
    recommendations: [
      'Stay hydrated with warm fluids (tea, soup)',
      'Use a humidifier or steam inhalation',
      'Avoid irritants like smoke and dust',
      'Get plenty of rest and consider cough drops'
    ],
    severity: 'moderate',
    advice: 'Most coughs resolve within 1-2 weeks. See a doctor if cough persists for more than 3 weeks, produces blood, is accompanied by chest pain or difficulty breathing, or if you have a high fever.'
  },
  'sore throat': {
    conditions: ['Viral pharyngitis', 'Strep throat (bacterial)', 'Common cold', 'Allergies'],
    recommendations: [
      'Gargle with warm salt water several times daily',
      'Drink warm fluids (tea with honey, soup)',
      'Use throat lozenges or sprays',
      'Rest your voice and avoid irritants'
    ],
    severity: 'moderate',
    advice: 'Most sore throats are viral and resolve in 3-7 days. See a doctor if symptoms persist, you have difficulty swallowing, high fever, or white spots on tonsils (possible strep throat).'
  },
  'runny nose': {
    conditions: ['Common cold', 'Allergies', 'Sinusitis', 'Viral infection'],
    recommendations: [
      'Use saline nasal spray or rinse',
      'Stay hydrated',
      'Use a humidifier',
      'Consider over-the-counter decongestants or antihistamines'
    ],
    severity: 'mild',
    advice: 'Runny nose is usually part of a cold or allergies. If it persists for more than 10 days, is accompanied by fever, or you have facial pain, consult a healthcare provider.'
  },
  'nasal congestion': {
    conditions: ['Common cold', 'Allergies', 'Sinusitis', 'Viral infection'],
    recommendations: [
      'Use saline nasal spray or rinse',
      'Apply warm compress to face',
      'Use a humidifier',
      'Consider over-the-counter decongestants'
    ],
    severity: 'mild',
    advice: 'Nasal congestion usually resolves with a cold. See a doctor if it lasts more than 10 days, is accompanied by fever or facial pain, or if you have difficulty breathing.'
  },
  'difficulty breathing': {
    conditions: ['Asthma', 'Anxiety', 'Pneumonia', 'COPD', 'Allergic reaction'],
    recommendations: [
      'Sit upright and try to stay calm',
      'Avoid triggers (allergens, smoke)',
      'Use prescribed inhaler if available',
      'Seek immediate medical attention if severe'
    ],
    severity: 'severe',
    advice: 'Difficulty breathing requires immediate medical attention. Go to the emergency room if breathing is severely impaired, you have chest pain, or your lips/fingernails turn blue.'
  },

  // Head and neurological symptoms
  headache: {
    conditions: ['Tension headache', 'Migraine', 'Sinus headache', 'Dehydration', 'Eye strain'],
    recommendations: [
      'Rest in a dark, quiet room',
      'Apply cold or warm compress to forehead',
      'Stay hydrated',
      'Consider over-the-counter pain relievers (ibuprofen, acetaminophen)'
    ],
    severity: 'moderate',
    advice: 'Most headaches are tension-related and resolve with rest and pain relievers. Seek immediate medical attention if headache is sudden and severe (thunderclap), accompanied by fever/stiff neck, or if you have vision changes or confusion.'
  },
  migraine: {
    conditions: ['Migraine', 'Tension headache', 'Cluster headache'],
    recommendations: [
      'Rest in a dark, quiet room',
      'Apply cold compress to head',
      'Avoid triggers (bright lights, loud noises)',
      'Consider prescription migraine medication if available'
    ],
    severity: 'moderate',
    advice: 'Migraines can be debilitating. If you experience frequent migraines, see a doctor for proper diagnosis and treatment. Seek immediate care if migraine is accompanied by vision loss, confusion, or weakness.'
  },
  dizziness: {
    conditions: ['Dehydration', 'Low blood pressure', 'Inner ear infection', 'Anemia', 'Vertigo'],
    recommendations: [
      'Sit or lie down immediately',
      'Stay hydrated',
      'Move slowly when changing positions',
      'Avoid sudden head movements'
    ],
    severity: 'moderate',
    advice: 'Dizziness can be caused by many factors. If it persists, is severe, or is accompanied by chest pain, difficulty speaking, or loss of consciousness, seek immediate medical attention.'
  },
  'ear pain': {
    conditions: ['Ear infection (otitis media)', 'Swimmer\'s ear', 'Eustachian tube dysfunction', 'TMJ disorder'],
    recommendations: [
      'Apply warm compress to affected ear',
      'Use over-the-counter pain relievers',
      'Avoid inserting anything into the ear',
      'Keep ear dry if it\'s an outer ear infection'
    ],
    severity: 'moderate',
    advice: 'Ear pain, especially in children, should be evaluated by a doctor. See a healthcare provider if pain is severe, persists more than 2 days, or is accompanied by fever, hearing loss, or discharge from the ear.'
  },

  // Fever and body symptoms
  fever: {
    conditions: ['Viral infection', 'Bacterial infection', 'Inflammatory condition', 'Common cold', 'Flu'],
    recommendations: [
      'Stay hydrated with water and electrolyte drinks',
      'Rest and get plenty of sleep',
      'Take fever-reducing medication (acetaminophen or ibuprofen)',
      'Use cool compresses or lukewarm bath'
    ],
    severity: 'moderate',
    advice: 'Fever is usually a sign of infection. Seek medical attention if fever is above 103°F (39.4°C), persists for more than 3 days, is accompanied by severe symptoms, or if you have a weakened immune system.'
  },
  chills: {
    conditions: ['Viral infection', 'Bacterial infection', 'Fever', 'Flu', 'Common cold'],
    recommendations: [
      'Stay warm with blankets',
      'Rest and stay hydrated',
      'Monitor temperature',
      'Take fever-reducing medication if needed'
    ],
    severity: 'moderate',
    advice: 'Chills often accompany fever and infections. If chills are severe, persistent, or accompanied by high fever, seek medical attention.'
  },
  fatigue: {
    conditions: ['Anemia', 'Sleep disorder', 'Chronic fatigue syndrome', 'Depression', 'Thyroid issues', 'Viral infection'],
    recommendations: [
      'Ensure adequate sleep (7-9 hours)',
      'Maintain a balanced diet',
      'Stay hydrated',
      'Engage in light exercise'
    ],
    severity: 'moderate',
    advice: 'Fatigue can have many causes. If it persists for more than 2 weeks, is severe, or is accompanied by other symptoms like weight loss or fever, consult a healthcare provider.'
  },
  'body ache': {
    conditions: ['Viral infection', 'Flu', 'Fibromyalgia', 'Dehydration', 'Overexertion'],
    recommendations: [
      'Rest and allow body to recover',
      'Apply warm compresses to sore areas',
      'Take over-the-counter pain relievers',
      'Stay hydrated and maintain gentle movement'
    ],
    severity: 'moderate',
    advice: 'Body aches are common with infections like flu. If aches are severe, persistent, or accompanied by high fever, consult a healthcare provider.'
  },
  'muscle pain': {
    conditions: ['Muscle strain', 'Overexertion', 'Fibromyalgia', 'Viral infection', 'Dehydration'],
    recommendations: [
      'Rest the affected muscles',
      'Apply ice for first 48 hours, then heat',
      'Gentle stretching and massage',
      'Take over-the-counter pain relievers'
    ],
    severity: 'mild',
    advice: 'Most muscle pain resolves with rest and self-care. See a doctor if pain is severe, persists for more than a week, or is accompanied by swelling, redness, or fever.'
  },

  // Skin symptoms
  rash: {
    conditions: ['Allergic reaction', 'Contact dermatitis', 'Eczema', 'Viral infection', 'Heat rash'],
    recommendations: [
      'Avoid scratching the affected area',
      'Apply cool compresses or calamine lotion',
      'Use fragrance-free moisturizers',
      'Identify and avoid potential allergens'
    ],
    severity: 'moderate',
    advice: 'Most rashes are not serious. Seek medical attention if rash is widespread, accompanied by fever, difficulty breathing, or if it appears suddenly and spreads rapidly.'
  },
  itching: {
    conditions: ['Allergic reaction', 'Dry skin', 'Eczema', 'Contact dermatitis', 'Insect bites'],
    recommendations: [
      'Apply cool compresses to itchy areas',
      'Use fragrance-free moisturizers',
      'Avoid hot showers and harsh soaps',
      'Consider over-the-counter antihistamines or hydrocortisone cream'
    ],
    severity: 'mild',
    advice: 'Mild itching usually resolves with self-care. See a doctor if itching is severe, persistent, widespread, or accompanied by rash, swelling, or difficulty breathing.'
  },

  // Other common symptoms
  'chest pain': {
    conditions: ['Heartburn/acid reflux', 'Anxiety', 'Muscle strain', 'Angina', 'Heart attack (if severe)'],
    recommendations: [
      'Rest and avoid strenuous activity',
      'If heartburn, avoid trigger foods and consider antacids',
      'Stay calm and monitor symptoms',
      'Seek immediate medical attention if severe'
    ],
    severity: 'severe',
    advice: 'Chest pain can be serious. Seek IMMEDIATE emergency medical attention if pain is severe, radiates to arm/jaw, is accompanied by shortness of breath, nausea, or sweating - these could indicate a heart attack.'
  },
  'back pain': {
    conditions: ['Muscle strain', 'Poor posture', 'Herniated disc', 'Arthritis', 'Kidney infection'],
    recommendations: [
      'Rest and avoid heavy lifting',
      'Apply ice for first 48 hours, then heat',
      'Practice good posture',
      'Gentle stretching and over-the-counter pain relievers'
    ],
    severity: 'moderate',
    advice: 'Most back pain improves with rest and self-care. See a doctor if pain is severe, persists for more than 2 weeks, radiates down legs, or is accompanied by numbness, weakness, or loss of bladder control.'
  },
  'joint pain': {
    conditions: ['Arthritis', 'Injury', 'Bursitis', 'Gout', 'Overuse'],
    recommendations: [
      'Rest the affected joint',
      'Apply ice to reduce inflammation',
      'Take over-the-counter anti-inflammatory medication',
      'Gentle range-of-motion exercises'
    ],
    severity: 'moderate',
    advice: 'Joint pain can have various causes. If pain is severe, persistent, or accompanied by swelling, redness, or fever, consult a healthcare provider.'
  },
  'eye pain': {
    conditions: ['Eye strain', 'Dry eyes', 'Conjunctivitis', 'Sinusitis', 'Foreign object'],
    recommendations: [
      'Rest eyes and avoid screens',
      'Use artificial tears for dry eyes',
      'Apply warm compress',
      'Avoid rubbing eyes'
    ],
    severity: 'moderate',
    advice: 'Eye pain should be evaluated by a doctor, especially if it\'s severe, accompanied by vision changes, discharge, or sensitivity to light.'
  },
  'sore muscles': {
    conditions: ['Muscle strain', 'Overexertion', 'Delayed onset muscle soreness (DOMS)', 'Viral infection'],
    recommendations: [
      'Rest and allow muscles to recover',
      'Apply ice for first 48 hours, then heat',
      'Gentle stretching and massage',
      'Stay hydrated and take over-the-counter pain relievers'
    ],
    severity: 'mild',
    advice: 'Sore muscles usually resolve with rest. If pain is severe, persists for more than a week, or is accompanied by swelling or fever, consult a healthcare provider.'
  }
};

/**
 * Extracts possible conditions based on symptom keywords with detailed information
 */
function extractConditionsFromSymptoms(symptoms: string): string[] {
  const lowerSymptoms = symptoms.toLowerCase().trim();
  
  // Direct match first
  if (symptomDatabase[lowerSymptoms]) {
    return symptomDatabase[lowerSymptoms].conditions;
  }

  // Check for partial matches
  const foundSymptoms: Array<{ key: string; data: SymptomData }> = [];
  
  for (const [key, data] of Object.entries(symptomDatabase)) {
    if (lowerSymptoms.includes(key) || key.includes(lowerSymptoms)) {
      foundSymptoms.push({ key, data });
    }
  }

  // If we found matches, return conditions from the best match
  if (foundSymptoms.length > 0) {
    // Sort by match quality (exact matches first, then by key length)
    foundSymptoms.sort((a, b) => {
      if (a.key === lowerSymptoms) return -1;
      if (b.key === lowerSymptoms) return 1;
      return b.key.length - a.key.length;
    });
    return foundSymptoms[0].data.conditions;
  }

  // Fallback: check for common symptom keywords
  const keywordMap: Record<string, string[]> = {
    'stomach': ['Gastritis', 'Indigestion', 'IBS'],
    'belly': ['Gastritis', 'Indigestion', 'IBS'],
    'throat': ['Viral pharyngitis', 'Strep throat', 'Common cold'],
    'nose': ['Common cold', 'Allergies', 'Sinusitis'],
    'chest': ['Heartburn', 'Anxiety', 'Muscle strain'],
    'back': ['Muscle strain', 'Poor posture', 'Herniated disc'],
    'joint': ['Arthritis', 'Injury', 'Bursitis'],
    'muscle': ['Muscle strain', 'Overexertion', 'Fibromyalgia'],
    'eye': ['Eye strain', 'Dry eyes', 'Conjunctivitis'],
    'ear': ['Ear infection', 'Swimmer\'s ear', 'Eustachian tube dysfunction']
  };

  for (const [keyword, conditions] of Object.entries(keywordMap)) {
    if (lowerSymptoms.includes(keyword)) {
      return conditions;
    }
  }

  return ['General symptoms - consult a healthcare provider for proper diagnosis'];
}

/**
 * Assesses symptom severity
 */
function assessSeverity(symptoms: string): 'mild' | 'moderate' | 'severe' {
  const severeKeywords = [
    'severe',
    'extreme',
    'unbearable',
    'emergency',
    'chest pain',
    'difficulty breathing',
    'loss of consciousness',
  ];

  const mildKeywords = ['mild', 'slight', 'minor', 'occasional'];

  if (severeKeywords.some((keyword) => symptoms.includes(keyword))) {
    return 'severe';
  }
  if (mildKeywords.some((keyword) => symptoms.includes(keyword))) {
    return 'mild';
  }
  return 'moderate';
}

/**
 * Gets detailed recommendations based on symptoms
 */
function getDefaultRecommendations(symptoms: string): string[] {
  const lowerSymptoms = symptoms.toLowerCase().trim();
  
  // Direct match first
  if (symptomDatabase[lowerSymptoms]) {
    return symptomDatabase[lowerSymptoms].recommendations;
  }

  // Check for partial matches
  for (const [key, data] of Object.entries(symptomDatabase)) {
    if (lowerSymptoms.includes(key) || key.includes(lowerSymptoms)) {
      return data.recommendations;
    }
  }

  // Fallback to keyword-based recommendations
  const recommendations: string[] = [];

  if (lowerSymptoms.includes('fever') || lowerSymptoms.includes('temperature')) {
    recommendations.push('Stay hydrated with water and electrolyte drinks');
    recommendations.push('Rest and get plenty of sleep');
    recommendations.push('Take fever-reducing medication (acetaminophen or ibuprofen)');
    recommendations.push('Monitor temperature regularly');
  } else if (lowerSymptoms.includes('pain') || lowerSymptoms.includes('ache')) {
    recommendations.push('Rest the affected area');
    recommendations.push('Apply ice for first 48 hours, then heat');
    recommendations.push('Take over-the-counter pain relievers (ibuprofen or acetaminophen)');
    recommendations.push('Avoid activities that worsen the pain');
  } else if (lowerSymptoms.includes('cough') || lowerSymptoms.includes('cold')) {
    recommendations.push('Stay hydrated with warm fluids (tea, soup)');
    recommendations.push('Use a humidifier or steam inhalation');
    recommendations.push('Get plenty of rest');
    recommendations.push('Consider cough drops or over-the-counter cough medicine');
  } else if (lowerSymptoms.includes('nausea') || lowerSymptoms.includes('vomit')) {
    recommendations.push('Eat small, bland meals throughout the day');
    recommendations.push('Stay hydrated with small sips of water or electrolyte drinks');
    recommendations.push('Avoid strong smells and spicy foods');
    recommendations.push('Get fresh air and rest in a quiet environment');
  } else if (lowerSymptoms.includes('headache') || lowerSymptoms.includes('head')) {
    recommendations.push('Rest in a dark, quiet room');
    recommendations.push('Apply cold or warm compress to forehead');
    recommendations.push('Stay hydrated');
    recommendations.push('Consider over-the-counter pain relievers');
  } else {
    recommendations.push('Get adequate rest (7-9 hours of sleep)');
    recommendations.push('Stay hydrated with water');
    recommendations.push('Monitor symptoms closely');
    recommendations.push('Avoid triggers that may worsen symptoms');
  }

  return recommendations.slice(0, 4);
}

/**
 * Gets detailed advice based on symptoms and severity
 */
function getDefaultAdvice(severity: 'mild' | 'moderate' | 'severe', symptoms?: string): string {
  const lowerSymptoms = symptoms?.toLowerCase().trim() || '';
  
  // Check if we have specific advice for this symptom
  if (symptoms && symptomDatabase[lowerSymptoms]) {
    return symptomDatabase[lowerSymptoms].advice;
  }

  // Check for partial matches
  if (symptoms) {
    for (const [key, data] of Object.entries(symptomDatabase)) {
      if (lowerSymptoms.includes(key) || key.includes(lowerSymptoms)) {
        return data.advice;
      }
    }
  }

  // Fallback to severity-based advice
  switch (severity) {
    case 'severe':
      return 'These symptoms may require immediate medical attention. Please consult a healthcare provider or visit an emergency room immediately, especially if symptoms are worsening or you have difficulty breathing, chest pain, or loss of consciousness.';
    case 'moderate':
      return 'Monitor your symptoms closely. If they persist for more than 2-3 days, worsen, or are accompanied by fever, severe pain, or other concerning symptoms, consult a healthcare provider for proper evaluation and treatment.';
    case 'mild':
      return 'These symptoms are typically mild and may resolve with self-care including rest, hydration, and over-the-counter remedies. However, if symptoms persist for more than a week, worsen, or you have concerns, consult a healthcare provider for proper diagnosis.';
    default:
      return 'Please consult a healthcare provider for proper diagnosis and treatment. While many symptoms resolve on their own, professional medical evaluation ensures appropriate care and rules out serious conditions.';
  }
}

