import { Temple } from './types';

/**
 * Smart Defaults for Temple Timings & Guidelines.
 * This logic ensures every temple page feels complete and helpful.
 */

interface TempleEnhancedData {
  timings: {
    open: string;
    close: string;
    darshan?: string[];
    special?: string;
  };
  guidelines: {
    dressCode: string;
    photography: string;
    allowedItems: string[];
    prohibitedItems: string[];
    otherRules: string[];
  };
  festivals: Array<{
    name: string;
    date: string;
    month: string;
    description: string;
  }>;
}

/**
 * Provides default data based on state/city for a temple.
 */
export function getEnhancedTempleData(temple: Partial<Temple>): TempleEnhancedData {
  const state = temple.state || 'India';
  const name = temple.name || '';

  // 1. TIMINGS LOGIC
  // Most temples in India follow a roughly similar schedule: 6 AM to 12 PM, and 4 PM to 8/9 PM.
  let timings = {
    open: '06:00 AM',
    close: '09:00 PM',
    darshan: ['Mangala Arati: 06:15 AM', 'Afternoon Break: 12:30 PM – 04:00 PM', 'Sayana Arat: 08:30 PM'],
    special: 'Timings may change during festivals and eclipse days.',
  };

  // Specific adjustments for certain states or temple types
  if (state === 'Tamil Nadu' || state === 'Karnataka' || state === 'Andhra Pradesh') {
    // South Indian temples often have a longer afternoon break
    timings.darshan = ['Morning Darshan: 06:00 AM – 12:30 PM', 'Afternoon Break: Temple Closed', 'Evening Darshan: 04:00 PM – 09:00 PM'];
  }

  // 2. GUIDELINES LOGIC
  let guidelines = {
    dressCode: 'Conservative attire recommended. Men: Trousers/Dhotis. Women: Saris/Salwar Kameez.',
    photography: 'Strictly prohibited inside the sanctum sanctorum (Garbhagriha). Allowed in outer premises.',
    allowedItems: ['Flowers', 'Incense', 'Fruits', 'Coconut'],
    prohibitedItems: ['Mobile phones (switched off)', 'Footwear (must be left outside)', 'Leather items', 'Food from outside', 'Alcohol/Tobacco'],
    otherRules: ['Maintain silence', 'Queue system exists for popular shrines', 'Wash hands/feet before entering if possible'],
  };

  if (name.includes('Iskcon')) {
    guidelines.dressCode = 'Modest clothing. No shorts or sleeveless tops.';
    guidelines.photography = 'Allowed in most areas except during specific rituals.';
    guidelines.otherRules.push('Govinda\'s restaurant typically available on premises.');
  }

  // 3. FESTIVAL CALENDAR (Major upcoming festivals in India - 2026 approximation)
  const allFestivals = [
    { name: 'Maha Shivratri', date: 'Feb 15', month: 'February', description: 'Major festival dedicated to Lord Shiva, celebrated with overnight fasting and vigil.' },
    { name: 'Holi', date: 'Mar 04', month: 'March', description: 'The festival of colors, celebrated across India with great joy.' },
    { name: 'Ram Navami', date: 'Mar 27', month: 'March', description: 'Celebrating the birth of Lord Rama.' },
    { name: 'Hanuman Jayanti', date: 'Apr 11', month: 'April', description: 'Birth anniversary of Lord Hanuman.' },
    { name: 'Akshaya Tritiya', date: 'Apr 20', month: 'April', description: 'Considered one of the most auspicious days for new beginnings.' },
    { name: 'Ganesh Chaturthi', date: 'Aug 17', month: 'August', description: 'Celebrating the birth of Lord Ganesha, especially grand in Maharashtra.' },
    { name: 'Janmashtami', date: 'Sep 04', month: 'September', description: 'Celebrating the birth of Lord Krishna.' },
    { name: 'Navratri', date: 'Oct 11 – 19', month: 'October', description: 'Nine nights of celebrating the Divine Mother Goddess.' },
    { name: 'Dussehra / Vijayadashami', date: 'Oct 20', month: 'October', description: 'Symbolizing the victory of good over evil.' },
    { name: 'Diwali', date: 'Nov 09', month: 'November', description: 'The festival of lights, India\'s biggest celebration.' },
  ];

  // Pick festivals relevant to the temple's deity if known (placeholder logic)
  let relevantFestivals = allFestivals.slice(0, 3); // Default to next 3 chronological
  if (name.includes('Shiva') || name.includes('Mahadev')) {
    relevantFestivals = allFestivals.filter(f => f.name.includes('Shivratri') || f.name === 'Diwali');
  } else if (name.includes('Krishna') || name.includes('Venkateswara') || name.includes('Vishnu')) {
    relevantFestivals = allFestivals.filter(f => f.name.includes('Janmashtami') || f.name === 'Diwali' || f.name === 'Akshaya Tritiya');
  }

  return {
    timings: temple.timings || timings,
    guidelines: (temple.guidelines as any) || guidelines,
    festivals: (temple.festivals as any) || relevantFestivals,
  };
}

/**
 * Get all upcoming festivals for a dedicated festivals page.
 */
export function getAllFestivals() {
  return [
    { name: 'Maha Shivratri', date: 'Feb 15, 2026', deities: ['Shiva'], significance: 'High' },
    { name: 'Holi', date: 'Mar 04, 2026', deities: ['Krishna', 'Vishnu'], significance: 'Massive' },
    { name: 'Ram Navami', date: 'Mar 27, 2026', deities: ['Rama'], significance: 'High' },
    { name: 'Hanuman Jayanti', date: 'Apr 11, 2026', deities: ['Hanuman'], significance: 'Medium' },
    { name: 'Akshaya Tritiya', date: 'Apr 20, 2026', deities: ['Vishnu', 'Laxmi'], significance: 'High' },
    { name: 'Ganesh Chaturthi', date: 'Aug 17, 2026', deities: ['Ganesha'], significance: 'Massive' },
    { name: 'Janmashtami', date: 'Sep 04, 2026', deities: ['Krishna'], significance: 'Massive' },
    { name: 'Navratri', date: 'Oct 11 – 19, 2026', deities: ['Durga', 'Amba'], significance: 'Massive' },
    { name: 'Dussehra', date: 'Oct 20, 2026', deities: ['Rama', 'Durga'], significance: 'High' },
    { name: 'Diwali', date: 'Nov 09, 2026', deities: ['Laxmi', 'Rama'], significance: 'Massive' },
  ];
}
