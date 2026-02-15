import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, Navigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerStudentProfile, useGetCallerRole } from './hooks/useQueries';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminDiagnostics from './pages/AdminDiagnostics';
import AccessDenied from './pages/AccessDenied';
import AppHeader from './components/layout/AppHeader';
import ProfileSetupModal from './components/profile/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

// Layout component for authenticated routes
function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <Outlet />
    </div>
  );
}

// Root layout
function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

// Protected route wrapper
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: role, isLoading: roleLoading } = useGetCallerRole();

  if (isInitializing || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <AccessDenied />;
  }

  if (requireAdmin && role !== 'Admin') {
    return <AccessDenied message="This area is restricted to administrators only." />;
  }

  return <>{children}</>;
}

// Student dashboard route component
function StudentDashboardRoute() {
  const { data: role } = useGetCallerRole();
  
  // Redirect admins to admin dashboard
  if (role === 'Admin') {
    return <Navigate to="/admin" />;
  }
  
  return <StudentDashboard />;
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const studentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student',
  component: () => (
    <ProtectedRoute>
      <AuthenticatedLayout />
    </ProtectedRoute>
  ),
});

const studentDashboardRoute = createRoute({
  getParentRoute: () => studentRoute,
  path: '/',
  component: StudentDashboardRoute,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedRoute requireAdmin>
      <AuthenticatedLayout />
    </ProtectedRoute>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: AdminDashboard,
});

const adminDiagnosticsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/diagnostics',
  component: AdminDiagnostics,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  studentRoute.addChildren([studentDashboardRoute]),
  adminRoute.addChildren([adminDashboardRoute, adminDiagnosticsRoute]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { identity } = useInternetIdentity();
  const { data: studentProfile, isLoading: profileLoading, isFetched } = useGetCallerStudentProfile();
  const { data: role } = useGetCallerRole();
  
  const isAuthenticated = !!identity;
  const isStudent = role === 'Student';
  const showProfileSetup = isAuthenticated && isStudent && !profileLoading && isFetched && studentProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupModal />}
    </ThemeProvider>
  );
}

export default App;
