import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import LoginLogistica from "@/pages/LoginRE";
import Relatorio from "@/pages/Relatorio";
import Home from "@/pages/Home";
import AdminCatalogo from "@/pages/AdminCatalogo";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import OperadorSupabase from "./pages/OperadorSupabase";
import LogisticaSupabase from "./pages/LogisticaSupabase";
import Ajuda from "./pages/Ajuda";

function Router() {
  return (
    <Switch>
      {/* Rota Home - Seleção de módulo */}
      <Route path="/" component={Home} />
      
      {/* Rota Operador */}
      <Route path="/operador" component={OperadorSupabase} />
      
      {/* Rota Ajuda */}
      <Route path="/ajuda" component={Ajuda} />
      
      {/* Rota de Login */}
      <Route path="/login" component={LoginLogistica} />

      {/* Rota de Cadastro */}
      <Route path="/signup" component={SignUp} />

      {/* Rota de Recuperação de Senha */}
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* Rota Logística */}
      <Route path="/logistica-dashboard">
        {() => (
          <ProtectedRoute>
            <LogisticaSupabase />
          </ProtectedRoute>
        )}
      </Route>

      {/* Fallback para rota antiga de logística */}
      <Route path="/logistica">
        <Redirect to="/logistica-dashboard" />
      </Route>

      {/* Rota Admin - Proteção interna na página */}
      <Route path="/admin" component={AdminCatalogo} />

      {/* Rotas protegidas - Relatório */}
      <Route path="/relatorio">
        {() => (
          <ProtectedRoute>
            <Relatorio />
          </ProtectedRoute>
        )}
      </Route>

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
