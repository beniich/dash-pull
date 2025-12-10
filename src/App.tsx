import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
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
const Pricing = lazy(() => import("./pages/Pricing"));
const Subscriptions = lazy(() => import("./pages/Subscriptions"));
const Checkout = lazy(() => import("./pages/Checkout"));

// Configure React Query with optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
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

              {/* Protected routes - Multi-tenant isolated */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/crm" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
              <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
              <Route path="/deals" element={<ProtectedRoute><Deals /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/spreadsheet" element={<ProtectedRoute><Spreadsheet /></ProtectedRoute>} />
              <Route path="/diagram-editor" element={<ProtectedRoute><DiagramEditorPage /></ProtectedRoute>} />
              <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />

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
