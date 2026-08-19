export default function Loading() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <span className="sr-only">Loading</span>
      <span className="size-6 animate-spin rounded-full border-2 border-edge border-t-forest" />
    </div>
  );
}
