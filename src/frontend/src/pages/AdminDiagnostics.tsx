import { useGetCallerRole, useIsCallerAdmin, useGetAllCourses, useGetAllAnnouncements, useGetContactDetails, useGetLogo } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Shield, User, Globe, Database } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { getVersionString, getFullVersionInfo } from '../utils/version';
import { getEnvironmentInfo } from '../utils/icEnv';

export default function AdminDiagnostics() {
  const { identity } = useInternetIdentity();
  const { data: role } = useGetCallerRole();
  const { data: isAdmin } = useIsCallerAdmin();
  
  // Data connectivity checks
  const { data: courses, isLoading: coursesLoading, isError: coursesError } = useGetAllCourses();
  const { data: announcements, isLoading: announcementsLoading, isError: announcementsError } = useGetAllAnnouncements();
  const { data: contactDetails, isLoading: contactLoading, isError: contactError } = useGetContactDetails();
  const { data: logoBytes, isLoading: logoLoading, isError: logoError } = useGetLogo();

  const principal = identity?.getPrincipal().toString() || 'Not authenticated';
  const versionInfo = getFullVersionInfo();
  const envInfo = getEnvironmentInfo();

  // Calculate data connectivity status
  const dataChecks = [
    { name: 'Courses', loading: coursesLoading, error: coursesError, success: !!courses },
    { name: 'Announcements', loading: announcementsLoading, error: announcementsError, success: !!announcements },
    { name: 'Contact Details', loading: contactLoading, error: contactError, success: !!contactDetails },
    { name: 'Logo', loading: logoLoading, error: logoError, success: !!logoBytes },
  ];

  const allDataLoaded = dataChecks.every(check => check.success);
  const anyDataError = dataChecks.some(check => check.error);

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
        {/* Version & Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Application Info
            </CardTitle>
            <CardDescription>Version and deployment environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Version</span>
              <Badge variant="outline">{getVersionString()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Network</span>
              <Badge variant={envInfo.isProduction ? 'default' : 'secondary'}>
                {envInfo.network}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Environment</span>
              <Badge variant={envInfo.isProduction ? 'default' : 'secondary'}>
                {envInfo.isProduction ? 'Production' : 'Development'}
              </Badge>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Hostname</span>
              <p className="text-xs font-mono bg-muted p-2 rounded break-all">{envInfo.hostname}</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Base URL</span>
              <p className="text-xs font-mono bg-muted p-2 rounded break-all">{envInfo.baseUrl}</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Build Timestamp</span>
              <p className="text-xs font-mono bg-muted p-2 rounded break-all">{versionInfo.buildTimestamp}</p>
            </div>
          </CardContent>
        </Card>

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

        {/* Data Connectivity Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Connectivity
            </CardTitle>
            <CardDescription>Backend data query status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Status</span>
              {allDataLoaded ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Connected
                </Badge>
              ) : anyDataError ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Error
                </Badge>
              ) : (
                <Badge variant="secondary">Loading...</Badge>
              )}
            </div>
            <div className="space-y-3 pt-2">
              {dataChecks.map((check) => (
                <div key={check.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{check.name}</span>
                  {check.loading ? (
                    <Badge variant="secondary" className="text-xs">Loading...</Badge>
                  ) : check.error ? (
                    <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                      <XCircle className="h-3 w-3" />
                      Error
                    </Badge>
                  ) : check.success ? (
                    <Badge variant="default" className="flex items-center gap-1 text-xs">
                      <CheckCircle2 className="h-3 w-3" />
                      OK
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Unknown</Badge>
                  )}
                </div>
              ))}
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
                'Manage announcements',
                'View all student profiles',
                'Edit student profiles',
                'Mark attendance',
                'Update site settings',
                'Manage contact details',
              ].map((capability) => (
                <div key={capability} className="flex items-center gap-2 text-sm">
                  {isAdmin ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
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
      </div>
    </main>
  );
}
