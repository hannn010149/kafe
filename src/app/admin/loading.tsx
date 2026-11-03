export default function AdminLoading() {
  return (
    <div
      className="animate-pulse space-y-8"
      aria-busy="true"
      aria-label="Memuat halaman admin"
    >
      <div className="h-12 max-w-xl rounded-2xl bg-[#E8DDCB]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-32 rounded-3xl bg-[#E8DDCB]" />
        <div className="h-32 rounded-3xl bg-[#E8DDCB]" />
        <div className="h-32 rounded-3xl bg-[#E8DDCB]" />
        <div className="h-32 rounded-3xl bg-[#E8DDCB]" />
      </div>
      <div className="h-96 rounded-3xl bg-[#E8DDCB]" />
    </div>
  );
}
