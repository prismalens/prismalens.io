import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Scenario {
  title: string
  problem: string
  investigation: string[]
  rootCause: string
  timeToRootCause: string
  manualTime: string
}

interface Props {
  scenarios: Scenario[]
}

function ScenarioCard({ scenario, idx }: { scenario: Scenario; idx: number }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-8 shadow-sm backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20 font-mono text-sm font-bold text-primary">
          {String(idx + 1).padStart(2, "0")}
        </span>
        <h2 className="text-2xl font-bold text-foreground">
          {scenario.title}
        </h2>
      </div>

      <div className="mb-6 rounded-lg bg-background border border-destructive/30 p-4">
        <p className="font-mono text-sm text-destructive">
          {scenario.problem}
        </p>
      </div>

      <div className="mb-6 space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Investigation Timeline
        </h3>
        <ul className="space-y-3">
          {scenario.investigation.map((step, stepIdx) => (
            <li key={step} className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 border border-secondary/20 font-mono text-xs text-secondary-foreground">
                {stepIdx + 1}
              </span>
              <span className="flex-1 text-sm text-muted-foreground">
                {step}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 rounded-lg bg-success/10 border border-success/30 p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Root Cause
        </div>
        <p className="text-sm text-success font-medium">
          {scenario.rootCause}
        </p>
      </div>

      <div className="flex items-center gap-8 border-t border-border pt-6">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            PrismaLens
          </div>
          <div className="font-mono text-2xl font-bold text-primary">
            {scenario.timeToRootCause}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Manual Investigation
          </div>
          <div className="font-mono text-2xl font-bold text-muted-foreground">
            {scenario.manualTime}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ScenarioTabs({ scenarios }: Props) {
  return (
    <Tabs defaultValue="scenario-0" className="w-full">
      <TabsList className="mb-8 w-full">
        {scenarios.map((scenario, idx) => (
          <TabsTrigger
            key={scenario.title}
            value={`scenario-${idx}`}
            className="flex-1 text-xs sm:text-sm"
          >
            {scenario.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {scenarios.map((scenario, idx) => (
        <TabsContent key={scenario.title} value={`scenario-${idx}`}>
          <ScenarioCard scenario={scenario} idx={idx} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
