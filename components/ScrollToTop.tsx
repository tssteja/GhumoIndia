'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;

    // Preserve in-page anchor navigation, but reset every route change to the top.
    if (!hash || hash === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, searchParams]);

  return null;
}
