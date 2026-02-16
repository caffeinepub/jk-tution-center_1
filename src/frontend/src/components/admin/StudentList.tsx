import { useState } from 'react';
import { useGetAllStudentProfiles } from '../../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Users, CalendarDays } from 'lucide-react';
import StudentEditor from './StudentEditor';
import AdminStudentAttendanceDialog from './AdminStudentAttendanceDialog';
import type { Principal } from '@icp-sdk/core/principal';
import type { StudentProfile } from '../../backend';
import { useByteImageObjectUrl } from '../../hooks/useByteImageObjectUrl';

function StudentRow({ principal, profile }: { principal: Principal; profile: StudentProfile }) {
  const photoUrl = useByteImageObjectUrl(profile.profilePhoto);
  const [editingStudent, setEditingStudent] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);

  return (
    <>
      <TableRow className="smooth-transition hover:bg-muted/30">
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-primary/10">
              <AvatarImage src={photoUrl} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{profile.name}</p>
              <p className="text-xs text-muted-foreground">{profile.dateOfBirth}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>{profile.age.toString()}</TableCell>
        <TableCell>{profile.className}</TableCell>
        <TableCell className="max-w-[150px] truncate">{profile.school}</TableCell>
        <TableCell>
          <Badge variant="secondary">{profile.batch}</Badge>
        </TableCell>
        <TableCell className="max-w-[150px] truncate">{profile.tuitionCenter}</TableCell>
        <TableCell>{profile.parentMobileNumber}</TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAttendance(true)}
              title="Manage Attendance"
              className="smooth-transition"
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingStudent(true)}
              title="Edit Profile"
              className="smooth-transition"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {editingStudent && (
        <StudentEditor
          studentId={principal}
          profile={profile}
          onClose={() => setEditingStudent(false)}
        />
      )}

      {showAttendance && (
        <AdminStudentAttendanceDialog
          studentId={principal}
          studentName={profile.name}
          onClose={() => setShowAttendance(false)}
        />
      )}
    </>
  );
}

export default function StudentList() {
  const { data: students = [], isLoading, error } = useGetAllStudentProfiles();

  if (isLoading) {
    return (
      <Card className="bg-card border-border rounded-lg shadow-md">
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading student profiles...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border rounded-lg shadow-md">
        <CardContent className="text-center py-12">
          <p className="text-destructive">Failed to load student profiles. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (students.length === 0) {
    return (
      <Card className="bg-card border-border rounded-lg shadow-md">
        <CardContent className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Student Profiles</h3>
          <p className="text-muted-foreground">Students will appear here once they create their profiles.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border rounded-lg shadow-md overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="min-w-[200px]">Student</TableHead>
                <TableHead className="min-w-[60px]">Age</TableHead>
                <TableHead className="min-w-[100px]">Class</TableHead>
                <TableHead className="min-w-[150px]">School</TableHead>
                <TableHead className="min-w-[100px]">Batch</TableHead>
                <TableHead className="min-w-[150px]">Tuition Center</TableHead>
                <TableHead className="min-w-[120px]">Parent Mobile</TableHead>
                <TableHead className="text-right min-w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(([principal, profile]) => (
                <StudentRow key={principal.toString()} principal={principal} profile={profile} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
