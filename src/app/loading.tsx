export default function Loading() {
  return (
    <div
      className="min-h-screen animate-pulse bg-[#FAF7F2]"
      aria-busy="true"
      aria-label="Memuat halaman"
    >
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#E8DDCB]/60 bg-[#FAF7F2]/95 px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="h-10 w-48 rounded-full bg-[#E8DDCB]" />
          <div className="hidden h-9 w-96 rounded-full bg-[#E8DDCB] lg:block" />
          <div className="h-9 w-24 rounded-full bg-[#E8DDCB]" />
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-8 px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto h-8 max-w-sm rounded-full bg-[#E8DDCB]" />
        <div className="mx-auto h-12 max-w-xl rounded-xl bg-[#E8DDCB]" />
        <div className="mx-auto h-5 max-w-md rounded-full bg-[#E8DDCB]" />
        <div className="grid gap-6 pt-8 md:grid-cols-2">
          <div className="aspect-[4/3] rounded-3xl bg-[#E8DDCB]" />
          <div className="min-h-64 rounded-3xl bg-[#E8DDCB]" />
        </div>
        <div className="grid gap-6 pt-4 md:grid-cols-3">
          <div className="h-48 rounded-3xl bg-[#E8DDCB]" />
          <div className="h-48 rounded-3xl bg-[#E8DDCB]" />
          <div className="h-48 rounded-3xl bg-[#E8DDCB]" />
        </div>
      </main>
    </div>
  );
}
