/* eslint-disable turbo/no-undeclared-env-vars */
import { NextResponse } from 'next/server';

import Mixpanel from 'mixpanel';

const mixpanel = Mixpanel.init(process.env.NEXT_PRIVATE_MIXPANEL_TOKEN);

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const { event, properties } = data;

    mixpanel.track(event, properties);

    return NextResponse.json({ status: 'Event tracked successfully' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
