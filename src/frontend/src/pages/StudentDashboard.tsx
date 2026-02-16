import { useGetCallerStudentProfile, useGetAllCourses, useGetAllAnnouncements } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Bell, GraduationCap, Calendar, User, Phone, CalendarDays, ClipboardList, UserCheck } from 'lucide-react';
import { useByteImageObjectUrl } from '../hooks/useByteImageObjectUrl';
import StudentAttendancePanel from '../components/attendance/StudentAttendancePanel';
import EnrollmentPanel from '../components/student/EnrollmentPanel';
import ResultsPanel from '../components/student/ResultsPanel';
import AppContainer from '../components/layout/AppContainer';

export default function StudentDashboard() {
  const { data: studentProfile } = useGetCallerStudentProfile();
  const { data: courses = [], isLoading: coursesLoading } = useGetAllCourses();
  const { data: announcements = [], isLoading: announcementsLoading } = useGetAllAnnouncements();
  
  const profilePhotoUrl = useByteImageObjectUrl(studentProfile?.profilePhoto);

  return (
    <main className="py-8">
      <AppContainer className="max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {studentProfile?.name || 'Student'}!
          </h1>
          <p className="text-muted-foreground">Here's what's happening at JK Tuition Center</p>
        </div>

        {/* Profile Summary Card */}
        {studentProfile && (
          <Card className="mb-8 bg-card border-border rounded-lg shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-24 w-24 flex-shrink-0 ring-2 ring-primary/20">
                  <AvatarImage src={profilePhotoUrl} alt={studentProfile.name} />
                  <AvatarFallback>{studentProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{studentProfile.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">{studentProfile.age.toString()} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="font-medium">{studentProfile.className}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">School</p>
                      <p className="font-medium">{studentProfile.school}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Batch</p>
                      <Badge variant="secondary">{studentProfile.batch}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tuition Center</p>
                      <p className="font-medium">{studentProfile.tuitionCenter}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Parent Mobile</p>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {studentProfile.parentMobileNumber}
                      </p>
                    </div>
                    {studentProfile.studentMobileNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Student Mobile</p>
                        <p className="font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {studentProfile.studentMobileNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-5 bg-muted p-1 rounded-lg">
            <TabsTrigger value="courses" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm smooth-transition">
              Courses
            </TabsTrigger>
            <TabsTrigger value="enrollments" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm smooth-transition">
              Enrollments
            </TabsTrigger>
            <TabsTrigger value="results" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm smooth-transition">
              Results
            </TabsTrigger>
            <TabsTrigger value="announcements" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm smooth-transition">
              Announcements
            </TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm smooth-transition">
              Attendance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Your Courses</h2>
            </div>
            {coursesLoading ? (
              <Card className="bg-card border-border rounded-lg shadow-md">
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading courses...</p>
                </CardContent>
              </Card>
            ) : courses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <Card key={course.id.toString()} className="bg-card border-border rounded-lg shadow-md smooth-transition smooth-lift">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                      </div>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Instructor:</span>
                        <span className="font-medium">{course.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Schedule:</span>
                        <span className="font-medium">{course.schedule}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border rounded-lg shadow-md">
                <CardContent className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Courses Available</h3>
                  <p className="text-muted-foreground">Check back later for new courses.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-4">
            <EnrollmentPanel />
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <ResultsPanel />
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Announcements</h2>
            </div>
            {announcementsLoading ? (
              <Card className="bg-card border-border rounded-lg shadow-md">
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading announcements...</p>
                </CardContent>
              </Card>
            ) : announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id.toString()} className="bg-card border-border rounded-lg shadow-md smooth-transition smooth-lift">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <Badge variant="outline">{announcement.date}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">{announcement.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border rounded-lg shadow-md">
                <CardContent className="text-center py-12">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Announcements</h3>
                  <p className="text-muted-foreground">There are no announcements at this time.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <StudentAttendancePanel />
          </TabsContent>
        </Tabs>
      </AppContainer>
    </main>
  );
}
