import { Card } from "../(shell)/shell";

export default function SettingsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        <div className="mt-4 grid gap-3">
          <label className="text-sm text-[var(--muted-foreground)]">Full Name</label>
          <input className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3" defaultValue="Mason Robb" />
          <label className="text-sm text-[var(--muted-foreground)]">Email</label>
          <input className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3" defaultValue="mason@leandev.com.au" />
          <button className="mt-2 px-4 py-2 rounded-full bg-black text-white w-fit">Update Profile</button>
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Organization</h2>
        <div className="mt-4 grid gap-3">
          <label className="text-sm text-[var(--muted-foreground)]">Name</label>
          <input className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3" defaultValue="LeanDev" />
          <label className="text-sm text-[var(--muted-foreground)]">Timezone</label>
          <input className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3" defaultValue="Australia/Sydney" />
          <button className="mt-2 px-4 py-2 rounded-full bg-black text-white w-fit">Save</button>
        </div>
      </Card>
    </div>
  );
}


