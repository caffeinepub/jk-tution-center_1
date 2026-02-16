import { useState, useEffect } from 'react';
import { useCreateCourse, useUpdateCourse } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Course } from '../../backend';

interface CourseEditorProps {
  course?: Course;
  onClose: () => void;
}

export default function CourseEditor({ course, onClose }: CourseEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [schedule, setSchedule] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');

  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setInstructor(course.instructor);
      setSchedule(course.schedule);
      setMonthlyFee(course.monthlyFee.toString());
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !instructor.trim() || !schedule.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const feeValue = monthlyFee.trim() === '' ? 0 : parseInt(monthlyFee.trim(), 10);
    if (isNaN(feeValue) || feeValue < 0) {
      toast.error('Please enter a valid monthly fee (0 or positive number)');
      return;
    }

    try {
      if (course) {
        await updateCourse.mutateAsync({
          id: course.id,
          title: title.trim(),
          description: description.trim(),
          instructor: instructor.trim(),
          schedule: schedule.trim(),
          monthlyFee: BigInt(feeValue),
        });
        toast.success('Course updated successfully!');
      } else {
        await createCourse.mutateAsync({
          title: title.trim(),
          description: description.trim(),
          instructor: instructor.trim(),
          schedule: schedule.trim(),
          monthlyFee: BigInt(feeValue),
        });
        toast.success('Course created successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to ${course ? 'update' : 'create'} course`);
      console.error('Course operation error:', error);
    }
  };

  const isLoading = createCourse.isPending || updateCourse.isPending;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{course ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            <DialogDescription>
              {course ? 'Update the course information below.' : 'Fill in the details to create a new course.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                placeholder="e.g., Advanced Mathematics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                placeholder="e.g., Dr. John Smith"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                placeholder="e.g., Mon & Wed, 4:00 PM - 6:00 PM"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="monthlyFee">Monthly Fee</Label>
              <Input
                id="monthlyFee"
                type="number"
                min="0"
                placeholder="e.g., 5000"
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">Display only, no payment processing</p>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the course content and objectives..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
