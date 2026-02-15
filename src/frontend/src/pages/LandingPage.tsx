import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllCourses, useGetAllAnnouncements, useGetLogo, useGetContactDetails } from '../hooks/useQueries';
import { useLogoObjectUrl } from '../hooks/useLogoObjectUrl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, Calendar, GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export default function LandingPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: courses = [] } = useGetAllCourses();
  const { data: announcements = [] } = useGetAllAnnouncements();
  const { data: logoBytes } = useGetLogo();
  const { data: contactDetails } = useGetContactDetails();
  const logoUrl = useLogoObjectUrl(logoBytes);

  const isAuthenticated = !!identity;
  const fallbackLogo = '/assets/generated/jk-tuition-logo.dim_512x512.png';

  // Contact details with defaults
  const email = contactDetails?.email || 'info@tuitioncenter.com';
  const phone = contactDetails?.phone || '123-456-7890';
  const address = contactDetails?.address || '123 Tuition Center Street, City, Country';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={logoUrl || fallbackLogo} 
              alt="JK Tuition Center" 
              className="h-12 w-12 object-contain" 
            />
            <div>
              <h1 className="text-2xl font-bold text-primary">JK Tuition Center</h1>
              <p className="text-sm text-muted-foreground">Excellence in Education</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline">About</a>
            <a href="#courses" className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline">Courses</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline">Contact</a>
            {isAuthenticated ? (
              <Link to="/student">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Button onClick={login} disabled={isLoggingIn}>
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 -z-10" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Unlock Your <span className="text-primary">Academic Potential</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Join JK Tuition Center for personalized learning experiences, expert instructors, and a proven track record of student success.
              </p>
              <div className="flex flex-wrap gap-4">
                {!isAuthenticated && (
                  <Button size="lg" onClick={login} disabled={isLoggingIn} className="text-lg px-8">
                    {isLoggingIn ? 'Signing In...' : 'Get Started'}
                  </Button>
                )}
                <Button size="lg" variant="outline" asChild className="text-lg px-8">
                  <a href="#courses">Explore Courses</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/generated/jk-tuition-hero.dim_1600x600.png" 
                alt="Students learning" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose JK Tuition Center?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive educational support tailored to each student's needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Expert Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Learn from experienced educators dedicated to your success</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Small Class Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Personalized attention in intimate learning environments</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Proven Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Track record of academic excellence and student achievement</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Flexible Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Classes designed to fit your busy lifestyle</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Announcements</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {announcements.slice(0, 3).map((announcement) => (
                <Card key={announcement.id.toString()}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      {announcement.title}
                    </CardTitle>
                    <CardDescription>{announcement.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{announcement.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Courses Section */}
      <section id="courses" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Courses</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive range of courses designed to help you excel
            </p>
          </div>
          {courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {courses.map((course) => (
                <Card key={course.id.toString()} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-6 w-6 text-primary" />
                      <CardTitle>{course.title}</CardTitle>
                    </div>
                    <CardDescription>Instructor: {course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-muted-foreground">{course.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{course.schedule}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We're here to help you on your educational journey
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <a href={`mailto:${email}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {email}
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <a href={`tel:${phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {phone}
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{address}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoUrl || fallbackLogo} 
                alt="JK Tuition Center" 
                className="h-10 w-10 object-contain" 
              />
              <div>
                <p className="font-semibold">JK Tuition Center</p>
                <p className="text-sm text-muted-foreground">Excellence in Education</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} JK Tuition Center. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
