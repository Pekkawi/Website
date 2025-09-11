import PageLoader from '@/components/shared/PageLoader';

export default function Loading() {
  return (
    <main className="grid min-h-dvh place-items-center">
      <div className="flex items-center gap-3">
        <span className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
        <span className="text-sm text-gray-500">Loading…</span>
      </div>
    </main>
  );
}
