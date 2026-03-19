// Canonical pilgrimage route presets used by the route planner.
export type PilgrimageRoute = {
  id: string;
  name: string;
  description: string;
  templeNames: string[];
};

export const PILGRIMAGE_ROUTES: PilgrimageRoute[] = [
  {
    id: 'char-dham-yatra',
    name: 'Char Dham Yatra',
    description: 'A sacred Himalayan circuit through four revered shrines of Uttarakhand.',
    templeNames: ['Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath'],
  },
  {
    id: 'jyotirlinga-yatra',
    name: '12 Jyotirlinga Temples',
    description: 'Journey across India to the twelve holiest Shiva shrines.',
    templeNames: [
      'Somnath',
      'Mallikarjuna',
      'Mahakaleshwar',
      'Omkareshwar',
      'Kedarnath',
      'Bhimashankar',
      'Kashi Vishwanath',
      'Trimbakeshwar',
      'Vaidyanath',
      'Nageshwar',
      'Rameshwaram',
      'Grishneshwar',
    ],
  },
  {
    id: 'navagraha-temples',
    name: 'Navagraha Temples',
    description: 'A Tamil Nadu circuit dedicated to the nine planetary deities.',
    templeNames: [
      'Suryanar Kovil',
      'Thingaloor',
      'Vaitheeswaran Koil',
      'Thirunallar',
      'Alangudi',
      'Kanjanur',
      'Ketu Sthalam',
      'Rahu Sthalam',
      'Brihadeeswara',
    ],
  },
  {
    id: 'divya-desam',
    name: 'Divya Desam Temples',
    description: 'Sacred Vaishnava shrines celebrated in the Divya Prabandham.',
    templeNames: [
      'Srirangam',
      'Tirupati',
      'Tiruvananthapuram',
      'Melukote',
      'Kanchipuram',
      'Thirunindravur',
      'Kumbakonam',
      'Madurai',
      'Sri Vaikuntam',
      'Thiruvallikeni',
    ],
  },
];
