import { useGetCoursesWithEnrollmentStatus, useRequestEnrollment, useRequestRenewal } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, User, DollarSign, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { Course } from '../../backend';

export default function EnrollmentPanel() {
  const { data, isLoading } = useGetCoursesWithEnrollmentStatus();
  const requestEnrollment = useRequestEnrollment();
  const requestRenewal = useRequestRenewal();

  const handleEnroll = async (courseId: bigint) => {
    try {
      await requestEnrollment.mutateAsync(courseId);
      toast.success('Enrollment request submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit enrollment request');
    }
  };

  const handleRenew = async (courseId: bigint) => {
    try {
      await requestRenewal.mutateAsync(courseId);
      toast.success('Renewal request submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit renewal request');
    }
  };

  const getEnrollmentStatus = (course: Course) => {
    const courseIdStr = course.id.toString();
    if (data?.activeEnrollments.some(id => id.toString() === courseIdStr)) {
      return { status: 'Active', variant: 'default' as const, action: null };
    }
    if (data?.expiredEnrollments.some(id => id.toString() === courseIdStr)) {
      return { status: 'Expired', variant: 'destructive' as const, action: 'renew' };
    }
    if (data?.enrollmentRequests.some(id => id.toString() === courseIdStr)) {
      return { status: 'Pending', variant: 'secondary' as const, action: null };
    }
    return { status: 'Not Enrolled', variant: 'outline' as const, action: 'enroll' };
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border rounded-lg shadow-md">
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading enrollment status...</p>
        </CardContent>
      </Card>
    );
  }

  const courses = data?.courses || [];

  if (courses.length === 0) {
    return (
      <Card className="bg-card border-border rounded-lg shadow-md">
        <CardContent className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Courses Available</h3>
          <p className="text-muted-foreground">Check back later for available courses.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold">Course Enrollments</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const { status, variant, action } = getEnrollmentStatus(course);
          return (
            <Card key={course.id.toString()} className="bg-card border-border rounded-lg shadow-md smooth-transition smooth-lift">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </div>
                  <Badge variant={variant}>{status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
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
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Monthly Fee:</span>
                  <span className="font-medium">{course.monthlyFee.toString()}</span>
                </div>
                {status === 'Active' && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Valid for 30 days from approval</span>
                  </div>
                )}
                {action === 'enroll' && (
                  <Button
                    onClick={() => handleEnroll(course.id)}
                    disabled={requestEnrollment.isPending}
                    className="w-full mt-2"
                  >
                    {requestEnrollment.isPending ? 'Submitting...' : 'Request Enrollment'}
                  </Button>
                )}
                {action === 'renew' && (
                  <Button
                    onClick={() => handleRenew(course.id)}
                    disabled={requestRenewal.isPending}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    {requestRenewal.isPending ? 'Submitting...' : 'Request Renewal'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
