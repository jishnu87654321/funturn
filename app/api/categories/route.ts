import { NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';
import { fallbackCategories } from '@/lib/fallback-categories';

export const revalidate = 300;

const buildCategoriesResponse = (payload: unknown, status = 200) =>
  NextResponse.json(payload, {
    status,
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });

export async function GET() {
  try {
    const response = await fetchBackendApi('/api/categories', {
      method: 'GET',
      next: { revalidate: 300 },
      headers: {
        Accept: 'application/json',
      },
    });

    const text = await response.text();

    if (!response.ok) {
      return buildCategoriesResponse({
        success: true,
        message: 'Showing fallback categories while the backend is unavailable.',
        data: {
          categories: fallbackCategories,
          count: fallbackCategories.length,
          source: 'fallback',
        },
      });
    }

    return new NextResponse(text, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return buildCategoriesResponse(
      {
        success: true,
        message: 'Showing fallback categories while the backend is unavailable.',
        data: {
          categories: fallbackCategories,
          count: fallbackCategories.length,
          source: 'fallback',
        },
      },
      200,
    );
  }
}
