import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { LoginWelcomePopup } from "./components/LoginWelcomePopup";
import { Sidebar } from "./components/Sidebar";
import { WelcomePopup } from "./components/WelcomePopup";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import NewSample from "./pages/NewSample";
import Referrals from "./pages/Referrals";
import SampleDetail from "./pages/SampleDetail";
import Samples from "./pages/Samples";
import Settings from "./pages/Settings";

function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen bg-background molecular-bg">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 overflow-auto min-h-screen">
        <Outlet />
        <footer className="mt-12 pt-6 border-t border-border text-center">
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            &copy; {new Date().getFullYear()}. Built with ❤ using caffeine.ai
          </a>
        </footer>
      </main>
      <WelcomePopup />
      <LoginWelcomePopup />
    </div>
  );
}

const rootRoute = createRootRoute({ component: AppLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const samplesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/samples",
  component: Samples,
});

const sampleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/samples/$id",
  component: SampleDetail,
});

const newSampleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/new-sample",
  component: NewSample,
});

const referralsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/referrals",
  component: Referrals,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  samplesRoute,
  sampleDetailRoute,
  newSampleRoute,
  referralsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
