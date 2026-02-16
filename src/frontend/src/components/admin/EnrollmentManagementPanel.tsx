import { useState } from 'react';
import { useGetAllStudentProfiles, useGetAllCourses, useGetEnrollmentsByUser, useGetEnrollmentsByCourse, useApproveEnrollment, useRejectEnrollment, useApproveRenewal, useRenewEnrollment } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BookOpen, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@icp-sdk/core/principal';
import type { EnrollmentRequest, EnrollmentStatus } from '../../backend';

export default function EnrollmentManagementPanel() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const { data: students = [] } = useGetAllStudentProfiles();
  const { data: courses = [] } = useGetAllCourses();
  const { data: enrollmentsByUser = [] } = useGetEnrollmentsByUser(
    selectedStudent ? Principal.fromText(selectedStudent) : null
  );
  const { data: enrollmentsByCourse = [] } = useGetEnrollmentsByCourse(
    selectedCourse ? BigInt(selectedCourse) : null
  );

  const approveEnrollment = useApproveEnrollment();
  const rejectEnrollment = useRejectEnrollment();
  const approveRenewal = useApproveRenewal();
  const renewEnrollment = useRenewEnrollment();

  const handleApprove = async (enrollment: EnrollmentRequest) => {
    try {
      if (enrollment.renewalRequest) {
        await approveRenewal.mutateAsync({
          student: enrollment.student,
          courseId: enrollment.courseId,
        });
        toast.success('Renewal approved successfully!');
      } else {
        await approveEnrollment.mutateAsync({
          student: enrollment.student,
          courseId: enrollment.courseId,
        });
        toast.success('Enrollment approved successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
    }
  };

  const handleReject = async (enrollment: EnrollmentRequest) => {
    try {
      await rejectEnrollment.mutateAsync({
        student: enrollment.student,
        courseId: enrollment.courseId,
      });
      toast.success('Enrollment rejected');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject');
    }
  };

  const handleAdminRenew = async (enrollment: EnrollmentRequest) => {
    try {
      await renewEnrollment.mutateAsync({
        student: enrollment.student,
        courseId: enrollment.courseId,
      });
      toast.success('Course renewed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to renew');
    }
  };

  const getStatusBadge = (status: EnrollmentStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (timestamp: bigint | undefined) => {
    if (!timestamp) return 'N/A';
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  const EnrollmentCard = ({ enrollment, showStudent = false, showCourse = false }: { enrollment: EnrollmentRequest; showStudent?: boolean; showCourse?: boolean }) => {
    const course = courses.find(c => c.id === enrollment.courseId);
    const student = students.find(([p]) => p.toString() === enrollment.student.toString());

    return (
      <Card className="bg-card border-border rounded-lg shadow-sm">
        <CardContent className="pt-6 space-y-3">
          {showStudent && student && (
            <div>
              <p className="text-sm text-muted-foreground">Student</p>
              <p className="font-medium">{student[1].name}</p>
            </div>
          )}
          {showCourse && course && (
            <div>
              <p className="text-sm text-muted-foreground">Course</p>
              <p className="font-medium">{course.title}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            {getStatusBadge(enrollment.status)}
          </div>
          {enrollment.renewalRequest && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <RefreshCw className="h-4 w-4" />
              <span className="font-medium">Renewal Request</span>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Request Date</p>
            <p className="text-sm">{formatDate(enrollment.requestDate)}</p>
          </div>
          {enrollment.approvalDate && (
            <div>
              <p className="text-sm text-muted-foreground">Approval Date</p>
              <p className="text-sm">{formatDate(enrollment.approvalDate)}</p>
            </div>
          )}
          {enrollment.expiryDate && (
            <div>
              <p className="text-sm text-muted-foreground">Expiry Date</p>
              <p className="text-sm">{formatDate(enrollment.expiryDate)}</p>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            {enrollment.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApprove(enrollment)}
                  disabled={approveEnrollment.isPending || approveRenewal.isPending}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(enrollment)}
                  disabled={rejectEnrollment.isPending}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            {enrollment.status === 'expired' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAdminRenew(enrollment)}
                disabled={renewEnrollment.isPending}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Admin Renew
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold">Enrollment Management</h2>
      </div>

      <Tabs defaultValue="by-user" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted p-1 rounded-lg">
          <TabsTrigger value="by-user" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            By Student
          </TabsTrigger>
          <TabsTrigger value="by-course" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            By Course
          </TabsTrigger>
        </TabsList>

        <TabsContent value="by-user" className="space-y-4">
          <Card className="bg-card border-border rounded-lg shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Select Student</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedStudent || ''} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map(([principal, profile]) => (
                    <SelectItem key={principal.toString()} value={principal.toString()}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedStudent && (
            <div className="space-y-4">
              {enrollmentsByUser.length === 0 ? (
                <Card className="bg-card border-border rounded-lg shadow-md">
                  <CardContent className="text-center py-12">
                    <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No enrollments found for this student</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {enrollmentsByUser.map((enrollment, idx) => (
                    <EnrollmentCard key={idx} enrollment={enrollment} showCourse />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="by-course" className="space-y-4">
          <Card className="bg-card border-border rounded-lg shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Select Course</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCourse || ''} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id.toString()} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedCourse && (
            <div className="space-y-4">
              {enrollmentsByCourse.length === 0 ? (
                <Card className="bg-card border-border rounded-lg shadow-md">
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No enrollments found for this course</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {enrollmentsByCourse.map((enrollment, idx) => (
                    <EnrollmentCard key={idx} enrollment={enrollment} showStudent />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
