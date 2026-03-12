'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function DirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    // Decode phone from JWT payload (no verification needed client-side)
    let phone: string | null = null;
    try {
      const payloadPart = token.split('.')[1];
      if (payloadPart) {
        const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
        const decoded = JSON.parse(atob(padded)) as { phone?: string };
        phone = decoded.phone ?? null;
      }
    } catch {
      // malformed token
    }

    if (!phone) {
      router.replace('/login');
      return;
    }

    localStorage.setItem('fitkaka_token', token);
    localStorage.setItem('fitkaka_phone', phone);
    router.replace('/dashboard');
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Opening your dashboard…</p>
      </div>
    </div>
  );
}

export default function DirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    }>
      <DirectHandler />
    </Suspense>
  );
}
