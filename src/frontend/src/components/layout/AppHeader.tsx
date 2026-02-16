import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerRole, useGetLogo } from '../../hooks/useQueries';
import { useLogoObjectUrl } from '../../hooks/useLogoObjectUrl';
import { Link, useNavigate } from '@tanstack/react-router';
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
import { useQueryClient } from '@tanstack/react-query';
import AppContainer from './AppContainer';
import { resolveAssetPath } from '../../utils/icEnv';

export default function AppHeader() {
  const { clear } = useInternetIdentity();
  const { data: role } = useGetCallerRole();
  const { data: logoBytes } = useGetLogo();
  const logoUrl = useLogoObjectUrl(logoBytes);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fallbackLogo = resolveAssetPath('assets/generated/jk-tuition-logo.dim_512x512.png');

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const isAdmin = role === 'Admin';

  return (
    <header className="professional-header sticky top-0 z-50">
      <AppContainer>
        <div className="py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 focus-ring rounded-sm">
            <div className="h-12 w-12 flex-shrink-0">
              <img 
                src={logoUrl || fallbackLogo} 
                alt="JK Tuition Center" 
                className="h-full w-full object-contain" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">JK Tuition Center</h1>
              <p className="text-sm text-muted-foreground">Excellence in Education</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {role && <Badge variant="secondary">{role}</Badge>}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full focus-ring">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin ? (
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
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </AppContainer>
    </header>
  );
}
