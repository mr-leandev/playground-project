import { Card } from "../../(shell)/shell";
import SkillsRadar from "../_components/SkillsRadar";

export default function SkillsMatrixPage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold">Critical Skills Matrix</h1>
        <p className="text-[var(--muted-foreground)] mt-2">
          Visualize team capability against target proficiency. Use this to guide training, assignments,
          and continuous improvement.
        </p>
        <div className="mt-6">
          {/* @ts-expect-error client component */}
          <SkillsRadar title="Team A – Capability vs Target" />
        </div>
      </Card>
    </div>
  );
}



