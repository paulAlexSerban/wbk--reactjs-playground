import { PainAdvice } from '@/types/period';

export const painAdviceData: PainAdvice[] = [
  {
    title: 'Heat Therapy',
    description: 'Apply a heating pad or hot water bottle to your lower abdomen or back. Heat helps relax the muscles and reduce cramping.',
    icon: 'Flame',
    category: 'heat',
  },
  {
    title: 'Warm Bath',
    description: 'A warm bath can help relax your entire body and ease period pain. Add some Epsom salts for extra muscle relief.',
    icon: 'Bath',
    category: 'heat',
  },
  {
    title: 'Gentle Yoga',
    description: 'Try gentle yoga poses like child\'s pose, cat-cow, or supine twist. These can help relieve tension and improve blood flow.',
    icon: 'Activity',
    category: 'exercise',
  },
  {
    title: 'Light Walking',
    description: 'A gentle walk can help release endorphins, your body\'s natural painkillers. Even 15-20 minutes can make a difference.',
    icon: 'Footprints',
    category: 'exercise',
  },
  {
    title: 'Stay Hydrated',
    description: 'Drinking plenty of water can help reduce bloating and ease cramps. Warm water or herbal tea may be especially soothing.',
    icon: 'Droplets',
    category: 'diet',
  },
  {
    title: 'Anti-Inflammatory Foods',
    description: 'Foods rich in omega-3s (salmon, walnuts) and anti-inflammatory compounds (ginger, turmeric) may help reduce pain.',
    icon: 'Apple',
    category: 'diet',
  },
  {
    title: 'Reduce Caffeine & Salt',
    description: 'Limiting caffeine and salty foods can help reduce bloating and breast tenderness during your period.',
    icon: 'Coffee',
    category: 'diet',
  },
  {
    title: 'Get Extra Rest',
    description: 'Your body is working hard during menstruation. Allow yourself extra rest and sleep if you need it.',
    icon: 'Moon',
    category: 'rest',
  },
  {
    title: 'Relaxation Techniques',
    description: 'Deep breathing, meditation, or progressive muscle relaxation can help manage pain and reduce stress.',
    icon: 'Wind',
    category: 'rest',
  },
  {
    title: 'Over-the-Counter Pain Relief',
    description: 'NSAIDs like ibuprofen can be effective for period pain. Take with food and follow package directions.',
    icon: 'Pill',
    category: 'medical',
  },
];

export const redFlags = [
  'Pain so severe it prevents normal activities despite medication',
  'Bleeding through a pad or tampon every hour for several hours',
  'Period lasting more than 7 days',
  'Sudden changes in your cycle pattern',
  'Bleeding between periods',
  'Fever during your period',
  'Pain during intercourse',
];

export function getAdviceForPainLevel(painLevel: number): PainAdvice[] {
  if (painLevel <= 2) {
    // Mild pain - suggest preventive measures
    return painAdviceData.filter(a => ['rest', 'diet', 'exercise'].includes(a.category));
  } else if (painLevel <= 4) {
    // Moderate pain - suggest active relief
    return painAdviceData.filter(a => ['heat', 'rest', 'exercise'].includes(a.category));
  } else {
    // Severe pain - suggest all options including medical
    return painAdviceData;
  }
}

export function getAgeAppropriateAdvice(age: number | undefined): string[] {
  const tips: string[] = [];
  
  if (!age) return tips;

  if (age < 18) {
    tips.push('It\'s normal for periods to be irregular during the first few years. Your body is still adjusting.');
    tips.push('If pain is affecting school or activities, talk to a parent or school nurse.');
  } else if (age >= 18 && age < 30) {
    tips.push('Tracking your cycle can help identify patterns and predict symptoms.');
    tips.push('If you\'re considering birth control, some methods can help with period pain.');
  } else if (age >= 30 && age < 45) {
    tips.push('Changes in your cycle as you age are normal, but sudden changes should be discussed with a doctor.');
  } else if (age >= 45) {
    tips.push('Perimenopause can cause cycle changes. Track any unusual patterns to discuss with your doctor.');
    tips.push('Irregular periods after 45 are common but should still be monitored.');
  }

  return tips;
}
