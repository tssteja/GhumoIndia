export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <div className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 text-white overflow-hidden pb-32">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-12 md:pt-32 md:pb-20">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 mb-8 animate-pulse">
            <div className="w-4 h-4 rounded-full bg-white/30" />
            <div className="h-4 w-32 bg-white/20 rounded-full" />
          </div>
          <div className="h-12 md:h-20 w-3/4 md:w-1/2 bg-white/20 rounded-3xl mb-4 animate-pulse" />
          <div className="h-6 md:h-8 w-full max-w-2xl bg-white/15 rounded-2xl animate-pulse" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-24 pb-20 relative z-30">
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-2xl p-4 md:p-6 rounded-[2rem] border border-white/60 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="h-12 rounded-2xl bg-gray-100 animate-pulse" />
              <div className="h-12 rounded-2xl bg-gray-100 animate-pulse" />
              <div className="h-12 rounded-2xl bg-gray-100 animate-pulse" />
              <div className="h-12 rounded-2xl bg-gray-100 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-outline-variant/5 shadow-sm"
              >
                <div className="h-56 bg-gray-100 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-gray-100 rounded-full animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded-full animate-pulse" />
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="h-3 w-24 bg-gray-100 rounded-full animate-pulse" />
                    <div className="h-3 w-20 bg-gray-100 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
