import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';

interface AccessDeniedProps {
  message?: string;
}

export default function AccessDenied({ message }: AccessDeniedProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoHome = () => {
    navigate({ to: '/' });
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card border-border rounded-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription className="text-base">
            {message || 'You need to sign in to access this page.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!identity && (
            <Button
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="w-full"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </Button>
          )}
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
