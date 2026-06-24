import React from 'react';
import { getPopularTracks } from '@/lib/api';
import { HomeWithIntro } from '@/components/home/HomeWithIntro';

export const revalidate = 3600;

export default async function Home() {
  let popularTracks: Awaited<ReturnType<typeof getPopularTracks>>['tracks'] = [];
  try {
    const result = await getPopularTracks();
    popularTracks = result.tracks;
  } catch (error) {
    console.error('Failed to load popular tracks in server component', error);
  }

  return <HomeWithIntro popularTracks={popularTracks} />;
}
