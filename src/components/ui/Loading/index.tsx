// src/components/Loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div
        className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"
        aria-label="Carregando"
        role="status"
      />
    </div>
  );
}
