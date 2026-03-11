import { calculateRelevanceScore, calculateVideoScore } from '../lib/utils';

/**
 * Verification script for the Video Architecture Redesign
 */
function testScoring() {
  console.log('--- Testing Relevance and Scoring Pipeline ---');

  const temple = {
    name: 'Birla Mandir',
    city: 'Hyderabad',
    state: 'Telangana'
  };

  const testCases = [
    {
      title: 'Birla Mandir Hyderabad - Complete Tour',
      description: 'A beautiful drone shot of Birla Mandir in Hyderabad city.',
      viewCount: 150000,
      expectedKeep: true,
      description_label: 'Correct Temple + Correct City ( Hyderabad )'
    },
    {
      title: 'Evening at Birla Mandir',
      description: 'Visiting the white marble temple in Telangana state.',
      viewCount: 5000,
      expectedKeep: true,
      description_label: 'Correct Temple + Correct State ( Telangana )'
    },
    {
      title: 'Jaipur Birla Mandir - Rajasthan',
      description: 'Beautiful Jaipur city temple tour.',
      viewCount: 200000,
      expectedKeep: false,
      description_label: 'Correct Temple + WRONG City ( Jaipur )'
    },
    {
      title: '10 Best Temples in India',
      description: 'Check out these amazing places.',
      viewCount: 1000000,
      expectedKeep: false,
      description_label: 'No Temple Keywords'
    }
  ];

  testCases.forEach((tc, i) => {
    const relScore = calculateRelevanceScore(
      tc.title,
      temple.name,
      temple.city,
      temple.state,
      tc.description,
      tc.viewCount
    );

    const keep = relScore > 0;
    const finalScore = calculateVideoScore(tc.viewCount, 0, 0, new Date().toISOString(), relScore);

    console.log(`Test ${i+1}: ${tc.description_label}`);
    console.log(`  Keep: ${keep} (Expected: ${tc.expectedKeep})`);
    if (keep) {
      console.log(`  Final Score: ${finalScore.toFixed(0)}`);
    }
    
    if (keep !== tc.expectedKeep) {
      console.error(`  FAILED: Expected keep to be ${tc.expectedKeep}`);
    } else {
      console.log('  PASSED');
    }
    console.log('');
  });
}

testScoring();
