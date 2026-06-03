import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";
import ApplicationForm from "./pages/ApplicationForm";
import ServerInfo from "./pages/ServerInfo";
import PlayerList from "./pages/PlayerList";
import AdminPanel from "./pages/AdminPanel";

function Router() {
  const [location] = useLocation();
  
  // 從 URL 查詢參數提取 gamertag 和 xboxAccountId
  const getQueryParam = (param: string) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(param) || "";
  };

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/auth/callback"} component={AuthCallback} />
      <Route 
        path={"/application"} 
        component={() => (
          <ApplicationForm
            gamertag={getQueryParam("gamertag")}
            xboxAccountId={getQueryParam("xboxAccountId")}
          />
        )}
      />
      <Route 
        path={"/server-info"} 
        component={() => (
          <ServerInfo
            gamertag={getQueryParam("gamertag")}
            xboxAccountId={getQueryParam("xboxAccountId")}
          />
        )}
      />
      <Route path={"/players"} component={PlayerList} />
      <Route path={"/admin"} component={AdminPanel} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
