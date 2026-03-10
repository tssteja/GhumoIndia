import { NextResponse, NextRequest } from 'next/server';
import { runVideoRankingForAll } from '@/lib/videoRanking';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting video ranking job...');
    const result = await runVideoRankingForAll();
    console.log('Video ranking complete:', result);

    return NextResponse.json(
      {
        message: 'Video ranking completed',
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Video ranking job failed:', error);
    return NextResponse.json(
      { error: 'Video ranking failed' },
      { status: 500 }
    );
  }
}
