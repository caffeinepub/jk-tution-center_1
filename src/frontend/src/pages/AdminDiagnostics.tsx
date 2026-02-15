import { useGetCallerRole, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Shield, User } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function AdminDiagnostics() {
  const { identity } = useInternetIdentity();
  const { data: role } = useGetCallerRole();
  const { data: isAdmin } = useIsCallerAdmin();

  const principal = identity?.getPrincipal().toString() || 'Not authenticated';

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link to="/admin">← Back to Dashboard</Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Diagnostics</h1>
        <p className="text-muted-foreground">System status and permissions overview</p>
      </div>

      <div className="space-y-6">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authenticated</span>
              {identity ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Yes
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  No
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Principal ID</span>
              <p className="text-xs font-mono bg-muted p-2 rounded break-all">{principal}</p>
            </div>
          </CardContent>
        </Card>

        {/* Role & Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role & Permissions
            </CardTitle>
            <CardDescription>Your current access level and capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Role</span>
              <Badge variant={role === 'Admin' ? 'default' : 'secondary'}>
                {role || 'Loading...'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Admin Access</span>
              {isAdmin ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Granted
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Denied
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Permissions Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Capabilities</CardTitle>
            <CardDescription>Features available with admin access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'Create and edit courses',
                'Delete courses',
                'Create and edit announcements',
                'Delete announcements',
                'View and edit student profiles',
                'Access admin dashboard',
                'View diagnostics page',
              ].map((capability, index) => (
                <div key={index} className="flex items-center gap-2">
                  {isAdmin ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={isAdmin ? 'text-foreground' : 'text-muted-foreground'}>
                    {capability}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Application</span>
              <span className="text-sm">JK Tuition Center</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Platform</span>
              <span className="text-sm">Internet Computer</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authentication</span>
              <span className="text-sm">Internet Identity</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
