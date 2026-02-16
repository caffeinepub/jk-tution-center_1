import { useState } from 'react';
import { useDeleteCourse } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, BookOpen, User, Calendar, DollarSign } from 'lucide-react';
import CourseEditor from './CourseEditor';
import type { Course } from '../../backend';
import { toast } from 'sonner';

interface CourseListProps {
  courses: Course[];
}

export default function CourseList({ courses }: CourseListProps) {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const deleteMutation = useDeleteCourse();

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Course deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete course');
    }
  };

  if (courses.length === 0) {
    return (
      <Card className="bg-card border-border rounded-lg shadow-md">
        <CardContent className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Courses Yet</h3>
          <p className="text-muted-foreground">Click "Add Course" to create your first course.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id.toString()} className="bg-card border-border rounded-lg shadow-md smooth-transition smooth-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </div>
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
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingCourse(course)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(course.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingCourse && (
        <CourseEditor
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
        />
      )}
    </>
  );
}
