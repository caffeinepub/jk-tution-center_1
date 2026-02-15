import { useState } from 'react';
import { useGetAllCourses, useGetAllAnnouncements } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings as SettingsIcon } from 'lucide-react';
import CourseEditor from '../components/admin/CourseEditor';
import AnnouncementEditor from '../components/admin/AnnouncementEditor';
import CourseList from '../components/admin/CourseList';
import AnnouncementList from '../components/admin/AnnouncementList';
import StudentList from '../components/admin/StudentList';
import SiteSettingsPanel from '../components/admin/SiteSettingsPanel';
import { Link } from '@tanstack/react-router';

export default function AdminDashboard() {
  const { data: courses = [] } = useGetAllCourses();
  const { data: announcements = [] } = useGetAllAnnouncements();
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [showAnnouncementEditor, setShowAnnouncementEditor] = useState(false);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage courses, announcements, students, and site settings</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin/diagnostics">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Diagnostics
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Badge variant="secondary">{courses.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Active programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
            <Badge variant="secondary">{announcements.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">Published updates</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full max-w-3xl grid-cols-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Manage Courses</h2>
            <Button onClick={() => setShowCourseEditor(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
          <CourseList courses={courses} />
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Manage Announcements</h2>
            <Button onClick={() => setShowAnnouncementEditor(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Announcement
            </Button>
          </div>
          <AnnouncementList announcements={announcements} />
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Student Profiles</h2>
          </div>
          <StudentList />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Site Settings</h2>
          </div>
          <SiteSettingsPanel />
        </TabsContent>
      </Tabs>

      {/* Editors */}
      {showCourseEditor && (
        <CourseEditor onClose={() => setShowCourseEditor(false)} />
      )}
      {showAnnouncementEditor && (
        <AnnouncementEditor onClose={() => setShowAnnouncementEditor(false)} />
      )}
    </main>
  );
}
