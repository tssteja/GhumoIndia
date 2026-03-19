import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | GhumoIndia',
  description: 'Privacy policy for GhumoIndia.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-black text-sm mb-8">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to home
        </Link>
        <h1 className="font-serif text-4xl md:text-6xl font-black text-secondary mb-4">Privacy Policy</h1>
        <p className="text-on-surface-variant leading-relaxed mb-6">
          GhumoIndia only collects information that helps us improve temple discovery, search, and travel planning. We keep data use minimal and focused on making the site useful.
        </p>
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/10 space-y-4">
          <p className="text-sm font-bold text-on-surface">What we may use:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-on-surface-variant">
            <li>Search queries to improve results.</li>
            <li>Basic analytics to understand which temple pages are helpful.</li>
            <li>Affiliate link clicks to support the site.</li>
          </ul>
          <p className="text-sm text-on-surface-variant">
            We do not sell personal data. If you want a formal privacy policy later, we can expand this page into a full legal version.
          </p>
        </div>
      </section>
    </main>
  );
}
