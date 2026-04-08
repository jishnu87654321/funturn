import { NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export const dynamic = 'force-dynamic';

const isMongoId = (value: string) => /^[a-f\d]{24}$/i.test(value);

async function resolveCategoryId(selectedCategory: FormDataEntryValue | null) {
  if (typeof selectedCategory !== 'string' || !selectedCategory.trim()) {
    return null;
  }

  const normalizedValue = selectedCategory.trim();

  if (isMongoId(normalizedValue)) {
    return normalizedValue;
  }

  const response = await fetchBackendApi('/api/categories', {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return normalizedValue;
  }

  const payload = (await response.json()) as {
    data?: {
      categories?: Array<{ _id?: string; slug?: string; name?: string }>;
    };
  };

  const categories = payload.data?.categories || [];
  const lookup = normalizedValue.toLowerCase();
  const match = categories.find((category) => {
    return [category._id, category.slug, category.name]
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLowerCase() === lookup);
  });

  return match?._id || normalizedValue;
}

export async function POST(request: Request) {
  try {
    const incoming = await request.formData();
    const outgoing = new FormData();

    for (const [key, value] of incoming.entries()) {
      outgoing.append(key, value);
    }

    const resolvedCategoryId = await resolveCategoryId(incoming.get('selectedCategory'));
    if (resolvedCategoryId) {
      outgoing.set('selectedCategory', resolvedCategoryId);
    }

    const response = await fetchBackendApi('/api/applications', {
      method: 'POST',
      body: outgoing,
      cache: 'no-store',
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Application submission failed. Please try again in a moment.',
      },
      { status: 502 },
    );
  }
}
