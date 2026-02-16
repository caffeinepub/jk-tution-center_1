import { useGetAllCourses, useGetAllAnnouncements, useGetContactDetails, useGetLogo } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Bell, GraduationCap, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useLogoObjectUrl } from '../hooks/useLogoObjectUrl';
import AppContainer from '../components/layout/AppContainer';
import { resolveAssetPath } from '../utils/icEnv';

export default function LandingPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: courses = [] } = useGetAllCourses();
  const { data: announcements = [] } = useGetAllAnnouncements();
  const { data: contactDetails } = useGetContactDetails();
  const { data: logoBytes } = useGetLogo();
  const logoUrl = useLogoObjectUrl(logoBytes);

  const handleGetStarted = async () => {
    if (identity) {
      navigate({ to: '/student' });
    } else {
      try {
        await login();
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';
  const heroImage = resolveAssetPath('assets/generated/jk-tuition-hero.dim_1600x600.png');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="professional-header sticky top-0 z-50">
        <AppContainer className="max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {logoUrl && (
                <div className="w-10 h-10 flex-shrink-0">
                  <img src={logoUrl} alt="JK Tuition Center" className="w-full h-full object-contain" />
                </div>
              )}
              <h1 className="text-xl font-bold">JK Tuition Center</h1>
            </div>
            <Button onClick={handleGetStarted} disabled={isLoggingIn}>
              {isLoggingIn ? 'Signing in...' : identity ? 'Go to Dashboard' : 'Sign In'}
            </Button>
          </div>
        </AppContainer>
      </header>

      {/* Hero Section */}
      <section className="section-bg py-16 md:py-24">
        <AppContainer className="max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Excellence in Education
              </h2>
              <p className="text-lg text-muted-foreground">
                Join JK Tuition Center for personalized learning experiences that help students achieve their academic goals.
              </p>
              <Button size="lg" onClick={handleGetStarted} disabled={isLoggingIn}>
                {isLoggingIn ? 'Signing in...' : identity ? 'Go to Dashboard' : 'Get Started'}
              </Button>
            </div>
            <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              <img
                src={heroImage}
                alt="Students learning"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </AppContainer>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <AppContainer className="max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive educational support with experienced instructors and modern teaching methods.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border rounded-lg shadow-md smooth-transition smooth-lift">
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Expert Instructors</CardTitle>
                <CardDescription>
                  Learn from experienced educators dedicated to your success.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border rounded-lg shadow-md smooth-transition smooth-lift">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Comprehensive Courses</CardTitle>
                <CardDescription>
                  Wide range of subjects tailored to different grade levels.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border rounded-lg shadow-md smooth-transition smooth-lift">
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Flexible Schedule</CardTitle>
                <CardDescription>
                  Multiple batches to fit your availability and learning pace.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </AppContainer>
      </section>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <section className="section-bg-alt py-16 md:py-24">
          <AppContainer className="max-w-7xl">
            <div className="flex items-center gap-2 mb-8">
              <Bell className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Latest Announcements</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {announcements.slice(0, 4).map((announcement) => (
                <Card key={announcement.id.toString()} className="bg-card border-border rounded-lg shadow-md smooth-transition smooth-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <Badge variant="outline">{announcement.date}</Badge>
                    </div>
                    <CardDescription>{announcement.message}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </AppContainer>
        </section>
      )}

      {/* Courses Section */}
      {courses.length > 0 && (
        <section className="py-16 md:py-24">
          <AppContainer className="max-w-7xl">
            <div className="flex items-center gap-2 mb-8">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Our Courses</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => (
                <Card key={course.id.toString()} className="bg-card border-border rounded-lg shadow-md smooth-transition smooth-lift">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{course.schedule}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AppContainer>
        </section>
      )}

      {/* Contact Section */}
      {contactDetails && (
        <section className="section-bg py-16 md:py-24">
          <AppContainer className="max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-muted-foreground">
                Have questions? We're here to help you succeed.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="bg-card border-border rounded-lg shadow-md text-center">
                <CardHeader>
                  <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">Email</CardTitle>
                  <CardDescription className="break-words">{contactDetails.email}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-card border-border rounded-lg shadow-md text-center">
                <CardHeader>
                  <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">Phone</CardTitle>
                  <CardDescription>{contactDetails.phone}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-card border-border rounded-lg shadow-md text-center">
                <CardHeader>
                  <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">Address</CardTitle>
                  <CardDescription>{contactDetails.address}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </AppContainer>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <AppContainer className="max-w-7xl">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} JK Tuition Center. All rights reserved.
            </p>
          </div>
        </AppContainer>
      </footer>
    </div>
  );
}
