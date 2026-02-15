import { useState } from 'react';
import { useGetAllStudentProfiles } from '../../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Users } from 'lucide-react';
import StudentEditor from './StudentEditor';
import type { Principal } from '@icp-sdk/core/principal';
import type { StudentProfile } from '../../backend';

export default function StudentList() {
  const { data: students = [], isLoading, error } = useGetAllStudentProfiles();
  const [editingStudent, setEditingStudent] = useState<{ principal: Principal; profile: StudentProfile } | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading student profiles...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-destructive">Failed to load student profiles. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Student Profiles</h3>
          <p className="text-muted-foreground">Students will appear here once they create their profiles.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Tuition Center</TableHead>
                <TableHead>Parent Mobile</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(([principal, profile]) => (
                <TableRow key={principal.toString()}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile.profilePhoto} alt={profile.name} />
                        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-xs text-muted-foreground">{profile.dateOfBirth}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{profile.age.toString()}</TableCell>
                  <TableCell>{profile.className}</TableCell>
                  <TableCell>{profile.school}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{profile.batch}</Badge>
                  </TableCell>
                  <TableCell>{profile.tuitionCenter}</TableCell>
                  <TableCell>{profile.parentMobileNumber}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingStudent({ principal, profile })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingStudent && (
        <StudentEditor
          studentId={editingStudent.principal}
          profile={editingStudent.profile}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </>
  );
}
