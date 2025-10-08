import { Card, Chip } from "../(shell)/shell";

export default function TeamPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Member {i + 1}</h3>
              <p className="opacity-70 text-sm">member{i + 1}@company.com</p>
            </div>
            <Chip className="text-xs">Admin</Chip>
          </div>
          <div className="mt-4 flex gap-2">
            <Chip className="text-xs">charts</Chip>
            <Chip className="text-xs">datasets</Chip>
            <Chip className="text-xs">alerts</Chip>
          </div>
        </Card>
      ))}
    </div>
  );
}


