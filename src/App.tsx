import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/MockAuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { WhatsAppWidget } from "./components/WhatsAppWidget";
import { PageLoader } from "./components/PageLoader";

// Eager loaded (essential pages)
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy loaded pages for better performance
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Index = lazy(() => import("./pages/Index"));
const Deals = lazy(() => import("./pages/Deals"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Companies = lazy(() => import("./pages/Companies"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Settings = lazy(() => import("./pages/Settings"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Spreadsheet = lazy(() => import("./pages/Spreadsheet"));
const DiagramEditorPage = lazy(() => import("./pages/DiagramEditorPage"));
const FinancePage = lazy(() => import("./pages/FinancePage")); // PROMPT 3
const MessagesPage = lazy(() => import("./pages/MessagesPage")); // PROMPT 5
const SecurityPage = lazy(() => import("./pages/SecurityPage")); // PROMPT 6
const Pricing = lazy(() => import("./pages/Pricing"));
const Subscriptions = lazy(() => import("./pages/Subscriptions"));
const Checkout = lazy(() => import("./pages/Checkout"));
const InvoicesPage = lazy(() => import("./pages/finance/InvoicesPage").then(module => ({ default: module.InvoicesPage })));
const InvoiceEditor = lazy(() => import("./pages/finance/InvoiceEditor").then(module => ({ default: module.InvoiceEditor })));
const Workflows = lazy(() => import("./pages/Workflows"));
const WorkflowEditor = lazy(() => import("./pages/WorkflowEditor"));
const Profile = lazy(() => import("./pages/Profile"));
const UniversalPage = lazy(() => import("./pages/UniversalPage"));
const PatientsPage = lazy(() => import("./pages/hospital/PatientsPage"));
const BillingPage = lazy(() => import("./pages/hospital/BillingPage"));
const SchedulePage = lazy(() => import("./pages/hospital/SchedulePage"));
const StaffPage = lazy(() => import("./pages/hospital/StaffPage"));
const BedManagementPage = lazy(() => import("./pages/hospital/BedManagementPage"));
const PatientDetailsPage = lazy(() => import("./pages/hospital/PatientDetailsPage"));
const ClinicMap = lazy(() => import("./pages/resources/ClinicMap"));
const PitchPage = lazy(() => import("./pages/PitchPage"));
const SecretaryView = lazy(() => import("./pages/secretary/SecretaryView"));
const TeamsPage = lazy(() => import("./pages/workspace/TeamsPage"));
const WorkflowPage = lazy(() => import("./pages/workflow/WorkflowPage"));


// Configure React Query with optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/pitch" element={<PitchPage />} />

              {/* Core Hospital Modules */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/board" element={<ProtectedRoute><WorkflowPage /></ProtectedRoute>} />
              <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
              <Route path="/patients/:id" element={<ProtectedRoute><PatientDetailsPage /></ProtectedRoute>} />

              {/* Hospital Modules (Implemented) */}
              <Route path="/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
              <Route path="/resources" element={<ProtectedRoute><BedManagementPage /></ProtectedRoute>} />
              <Route path="/resources/map" element={<ProtectedRoute><ClinicMap /></ProtectedRoute>} />
              <Route path="/teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />
              <Route path="/emr" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
              <Route path="/secretary" element={<ProtectedRoute><SecretaryView /></ProtectedRoute>} />

              {/* Protected routes - Multi-tenant isolated */}
              <Route path="/crm" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} /> {/* PROMPT 5 */}
              <Route path="/clients" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
              <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
              <Route path="/deals" element={<ProtectedRoute><Deals /></ProtectedRoute>} />
              <Route path="/finance" element={<ProtectedRoute><FinancePage /></ProtectedRoute>} /> {/* PROMPT 3 */}
              <Route path="/finance/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
              <Route path="/finance/invoices/:id" element={<ProtectedRoute><InvoiceEditor /></ProtectedRoute>} />
              <Route path="/finance/billing" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
              <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} /> {/* PROMPT 6 */}
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/spreadsheet" element={<ProtectedRoute><Spreadsheet /></ProtectedRoute>} />
              <Route path="/diagram-editor" element={<ProtectedRoute><DiagramEditorPage /></ProtectedRoute>} />
              <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
              <Route path="/workflows" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
              <Route path="/workflows/:id" element={<ProtectedRoute><WorkflowEditor /></ProtectedRoute>} />
              <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/universal" element={<ProtectedRoute><UniversalPage /></ProtectedRoute>} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <WhatsAppWidget phoneNumber="33612345678" />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
