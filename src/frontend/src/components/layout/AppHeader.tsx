import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerStudentProfile, useGetCallerRole, useGetLogo } from '../../hooks/useQueries';
import { useLogoObjectUrl } from '../../hooks/useLogoObjectUrl';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function AppHeader() {
  const { clear } = useInternetIdentity();
  const { data: studentProfile } = useGetCallerStudentProfile();
  const { data: role } = useGetCallerRole();
  const { data: logoBytes } = useGetLogo();
  const logoUrl = useLogoObjectUrl(logoBytes);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const displayName = studentProfile?.name || 'User';
  const fallbackLogo = '/assets/generated/jk-tuition-logo.dim_512x512.png';

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img 
            src={logoUrl || fallbackLogo} 
            alt="JK Tuition Center" 
            className="h-10 w-10 object-contain" 
          />
          <div>
            <h1 className="text-xl font-bold text-primary">JK Tuition Center</h1>
            <p className="text-xs text-muted-foreground">Excellence in Education</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {role && (
            <Badge variant={role === 'Admin' ? 'default' : 'secondary'}>
              {role}
            </Badge>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{role || 'Loading...'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {role === 'Admin' ? (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link to="/student" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Student Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
