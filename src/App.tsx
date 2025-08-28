
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import FreelancerProfile from "./pages/FreelancerProfile";
import FreelancerPublicProfile from "./pages/FreelancerPublicProfile";
import SearchResults from "./pages/SearchResults";
import HowItWorksPage from "./pages/HowItWorks";
import ForFreelancersPage from "./pages/ForFreelancers";
import ForClientsPage from "./pages/ForClients";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Messages from "./pages/Messages";
import BookingDetails from "./pages/BookingDetails";
import ClientProfile from "./pages/ClientProfile";
import NotificationsPage from "./pages/Notifications";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<FreelancerProfile />} />
              <Route path="/client-profile" element={<ClientProfile />} />
              <Route path="/freelancer/:id" element={<FreelancerPublicProfile />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/como-funciona" element={<HowItWorksPage />} />
              <Route path="/para-freelancers" element={<ForFreelancersPage />} />
              <Route path="/para-clientes" element={<ForClientsPage />} />
              <Route path="/dashboard-cliente" element={<ClientDashboard />} />
              <Route path="/dashboard-freelancer" element={<FreelancerDashboard />} />
              <Route path="/mensagens" element={<Messages />} />
              <Route path="/booking/:id" element={<BookingDetails />} />
              <Route path="/notificacoes" element={<NotificationsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
