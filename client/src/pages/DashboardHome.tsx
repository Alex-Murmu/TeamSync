import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { KanbanBoard } from "@/components/KanbanBoard"
import data from "@/components/Dashboard/data.json"

export default function DashboardHome() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <SectionCards />
          
          <Tabs defaultValue="kanban" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="table">Task Table</TabsTrigger>
            </TabsList>
            
            <TabsContent value="kanban" className="mt-4">
              <KanbanBoard />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-4">
              <ChartAreaInteractive />
            </TabsContent>
            
            <TabsContent value="table" className="mt-4">
              <DataTable data={data} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
