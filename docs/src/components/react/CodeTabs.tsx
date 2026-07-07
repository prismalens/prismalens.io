import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TabItem {
  label: string
  value: string
  code: string
}

interface Props {
  items: TabItem[]
  defaultValue?: string
}

export default function CodeTabs({ items, defaultValue }: Props) {
  const activeDefault = defaultValue ?? items[0]?.value ?? ""

  return (
    <Tabs defaultValue={activeDefault} className="my-4">
      <TabsList>
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          <pre className="rounded-lg border border-[var(--sl-color-hairline)] p-4 overflow-x-auto font-mono text-sm" style={{ background: "var(--sl-color-bg-inline-code)" }}>
            <code>{item.code}</code>
          </pre>
        </TabsContent>
      ))}
    </Tabs>
  )
}
