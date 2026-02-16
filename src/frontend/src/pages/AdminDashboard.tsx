import { useState } from 'react';
import { useGetAllCourses, useGetAllAnnouncements, useGetAllStudentProfiles } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookOpen, Bell, Users, Plus, Settings } from 'lucide-react';
import CourseEditor from '../components/admin/CourseEditor';
import CourseList from '../components/admin/CourseList';
import AnnouncementEditor from '../components/admin/AnnouncementEditor';
import AnnouncementList from '../components/admin/AnnouncementList';
import StudentList from '../components/admin/StudentList';
import SiteSettingsPanel from '../components/admin/SiteSettingsPanel';
import EnrollmentManagementPanel from '../components/admin/EnrollmentManagementPanel';
import ResultsPanel from '../components/admin/ResultsPanel';
import AppContainer from '../components/layout/AppContainer';

export default function AdminDashboard() {
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [showAnnouncementEditor, setShowAnnouncementEditor] = useState(false);

  const { data: courses = [], isLoading: coursesLoading } = useGetAllCourses();
  const { data: announcements = [], isLoading: announcementsLoading } = useGetAllAnnouncements();
  const { data: students = [], isLoading: studentsLoading } = useGetAllStudentProfiles();

  return (
    <main className="py-8">
      <AppContainer className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage courses, announcements, students, and enrollments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border rounded-lg shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
              <BookOpen className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{coursesLoading ? '...' : courses.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border rounded-lg shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{studentsLoading ? '...' : students.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border rounded-lg shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Announcements</CardTitle>
              <Bell className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{announcementsLoading ? '...' : announcements.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-muted p-1 rounded-lg">
            <TabsTrigger value="courses" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm smooth-transition">
              Courses
            </TabsTrigger>
            <TabsTrigger value="announcements" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm smooth-transition">
              Announcements
            </TabsTrigger>
            <TabsTrigger value="students" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm smooth-transition">
              Students
            </TabsTrigger>
            <TabsTrigger value="enrollments" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm smooth-transition">
              Enrollments
            </TabsTrigger>
            <TabsTrigger value="results" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm smooth-transition">
              Results
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm smooth-transition">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Courses</h2>
              </div>
              <Button onClick={() => setShowCourseEditor(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>
            {coursesLoading ? (
              <Card className="bg-card border-border rounded-lg shadow-md">
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading courses...</p>
                </CardContent>
              </Card>
            ) : (
              <CourseList courses={courses} />
            )}
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Announcements</h2>
              </div>
              <Button onClick={() => setShowAnnouncementEditor(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Announcement
              </Button>
            </div>
            {announcementsLoading ? (
              <Card className="bg-card border-border rounded-lg shadow-md">
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading announcements...</p>
                </CardContent>
              </Card>
            ) : (
              <AnnouncementList announcements={announcements} />
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Students</h2>
            </div>
            <StudentList />
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-4">
            <EnrollmentManagementPanel />
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <ResultsPanel />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Site Settings</h2>
            </div>
            <SiteSettingsPanel />
          </TabsContent>
        </Tabs>

        {showCourseEditor && <CourseEditor onClose={() => setShowCourseEditor(false)} />}
        {showAnnouncementEditor && <AnnouncementEditor onClose={() => setShowAnnouncementEditor(false)} />}
      </AppContainer>
    </main>
  );
}
