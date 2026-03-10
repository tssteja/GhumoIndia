import { NextResponse, NextRequest } from 'next/server';
import { runFullDiscovery } from '@/lib/templeDiscovery';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting temple discovery job...');
    const result = await runFullDiscovery();
    console.log('Temple discovery complete:', result);

    return NextResponse.json(
      {
        message: 'Temple discovery completed',
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Temple discovery job failed:', error);
    return NextResponse.json(
      { error: 'Temple discovery failed' },
      { status: 500 }
    );
  }
}
