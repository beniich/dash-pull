import { WorkflowKanban } from "@/components/workflow/WorkflowKanban";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 mb-6">
        <h1 className="text-xl font-bold text-slate-800">MedFlow Hospital OS</h1>
      </header>
      <main>
        <WorkflowKanban />
      </main>
    </div>
  );
}

export default App;
