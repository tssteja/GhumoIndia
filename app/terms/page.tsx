import Link from 'next/link';

export const metadata = {
  title: 'Terms of Use | GhumoIndia',
  description: 'Terms of use for GhumoIndia.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-20 md:py-28">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-black text-sm mb-8">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to home
        </Link>
        <h1 className="font-serif text-4xl md:text-6xl font-black text-secondary mb-4">Terms of Use</h1>
        <p className="text-on-surface-variant leading-relaxed mb-6">
          These terms are simple: use the site responsibly, verify travel details before visiting, and respect local temple rules and customs.
        </p>
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/10 space-y-4">
          <ul className="list-disc pl-5 space-y-2 text-sm text-on-surface-variant">
            <li>Temple information can change and should be verified before travel.</li>
            <li>Affiliate links may lead to third-party services with their own terms.</li>
            <li>Do not scrape or misuse the site in ways that hurt the experience for others.</li>
          </ul>
          <p className="text-sm text-on-surface-variant">
            If you want, we can later replace this with a proper legal terms page.
          </p>
        </div>
      </section>
    </main>
  );
}
