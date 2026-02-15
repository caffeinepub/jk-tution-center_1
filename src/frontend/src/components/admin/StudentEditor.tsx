import { useState, useEffect } from 'react';
import { useUpdateStudentProfile } from '../../hooks/useQueries';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import type { Principal } from '@icp-sdk/core/principal';
import type { StudentProfile } from '../../backend';

interface StudentEditorProps {
  studentId: Principal;
  profile: StudentProfile;
  onClose: () => void;
}

export default function StudentEditor({ studentId, profile, onClose }: StudentEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    className: '',
    school: '',
    batch: '',
    tuitionCenter: '',
    parentMobileNumber: '',
    dateOfBirth: '',
    profilePhoto: '',
    studentMobileNumber: '',
  });

  const updateProfile = useUpdateStudentProfile();

  useEffect(() => {
    setFormData({
      name: profile.name,
      age: profile.age.toString(),
      className: profile.className,
      school: profile.school,
      batch: profile.batch,
      tuitionCenter: profile.tuitionCenter,
      parentMobileNumber: profile.parentMobileNumber,
      dateOfBirth: profile.dateOfBirth,
      profilePhoto: profile.profilePhoto,
      studentMobileNumber: profile.studentMobileNumber || '',
    });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Please enter student name');
      return;
    }
    if (!formData.age || parseInt(formData.age) <= 0) {
      toast.error('Please enter a valid age');
      return;
    }
    if (!formData.className.trim()) {
      toast.error('Please enter class');
      return;
    }
    if (!formData.school.trim()) {
      toast.error('Please enter school name');
      return;
    }
    if (!formData.batch) {
      toast.error('Please select a batch');
      return;
    }
    if (!formData.tuitionCenter.trim()) {
      toast.error('Please enter tuition center');
      return;
    }
    if (!formData.parentMobileNumber.trim()) {
      toast.error('Please enter parent mobile number');
      return;
    }
    if (!formData.dateOfBirth.trim()) {
      toast.error('Please enter date of birth');
      return;
    }
    if (!formData.profilePhoto.trim()) {
      toast.error('Please provide profile photo URL');
      return;
    }

    try {
      const updatedProfile: StudentProfile = {
        name: formData.name.trim(),
        age: BigInt(parseInt(formData.age)),
        className: formData.className.trim(),
        school: formData.school.trim(),
        batch: formData.batch,
        tuitionCenter: formData.tuitionCenter.trim(),
        parentMobileNumber: formData.parentMobileNumber.trim(),
        dateOfBirth: formData.dateOfBirth.trim(),
        profilePhoto: formData.profilePhoto.trim(),
        studentMobileNumber: formData.studentMobileNumber.trim() || undefined,
      };

      await updateProfile.mutateAsync({ studentId, profile: updatedProfile });
      toast.success('Student profile updated successfully!');
      onClose();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update profile';
      toast.error(errorMessage);
      console.error('Profile update error:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
            <DialogDescription>
              Update student information. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-age">
                    Age <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-age"
                    type="number"
                    min="1"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-className">
                    Class <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-className"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-school">
                    School <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-school"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-batch">
                    Batch <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.batch}
                    onValueChange={(value) => setFormData({ ...formData, batch: value })}
                    disabled={updateProfile.isPending}
                  >
                    <SelectTrigger id="edit-batch">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Batch 1">Batch 1</SelectItem>
                      <SelectItem value="Batch 2">Batch 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-tuitionCenter">
                    Tuition Center <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-tuitionCenter"
                    value={formData.tuitionCenter}
                    onChange={(e) => setFormData({ ...formData, tuitionCenter: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dateOfBirth">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  disabled={updateProfile.isPending}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-parentMobileNumber">
                    Parent Mobile Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-parentMobileNumber"
                    type="tel"
                    value={formData.parentMobileNumber}
                    onChange={(e) => setFormData({ ...formData, parentMobileNumber: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-studentMobileNumber">
                    Student Mobile Number (Optional)
                  </Label>
                  <Input
                    id="edit-studentMobileNumber"
                    type="tel"
                    value={formData.studentMobileNumber}
                    onChange={(e) => setFormData({ ...formData, studentMobileNumber: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-profilePhoto">
                  Profile Photo URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-profilePhoto"
                  type="url"
                  value={formData.profilePhoto}
                  onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                  disabled={updateProfile.isPending}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateProfile.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
