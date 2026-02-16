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
import { Upload } from 'lucide-react';
import type { Principal } from '@icp-sdk/core/principal';
import type { StudentProfile } from '../../backend';
import { fileToUint8Array } from '../../utils/fileToUint8Array';
import { useByteImageObjectUrl } from '../../hooks/useByteImageObjectUrl';

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
    studentMobileNumber: '',
  });
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const existingPhotoUrl = useByteImageObjectUrl(profile.profilePhoto);

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
      studentMobileNumber: profile.studentMobileNumber || '',
    });
  }, [profile]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setNewPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

    try {
      // Use new photo if uploaded, otherwise keep existing
      let photoBytes = profile.profilePhoto;
      if (newPhotoFile) {
        photoBytes = await fileToUint8Array(newPhotoFile);
      }

      const updatedProfile: StudentProfile = {
        name: formData.name.trim(),
        age: BigInt(parseInt(formData.age)),
        className: formData.className.trim(),
        school: formData.school.trim(),
        batch: formData.batch,
        tuitionCenter: formData.tuitionCenter.trim(),
        parentMobileNumber: formData.parentMobileNumber.trim(),
        dateOfBirth: formData.dateOfBirth.trim(),
        profilePhoto: photoBytes,
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

  const displayPhoto = photoPreview || existingPhotoUrl;

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
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">
                    Age <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="className">
                    Class <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="className"
                    placeholder="e.g., Grade 10"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">
                    School <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="school"
                    placeholder="Enter school name"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch">
                    Batch <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.batch}
                    onValueChange={(value) => setFormData({ ...formData, batch: value })}
                    disabled={updateProfile.isPending}
                  >
                    <SelectTrigger id="batch">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Batch 1">Batch 1</SelectItem>
                      <SelectItem value="Batch 2">Batch 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tuitionCenter">
                    Tuition Center <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="tuitionCenter"
                    placeholder="Enter tuition center"
                    value={formData.tuitionCenter}
                    onChange={(e) => setFormData({ ...formData, tuitionCenter: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  disabled={updateProfile.isPending}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentMobileNumber">
                    Parent Mobile Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="parentMobileNumber"
                    type="tel"
                    placeholder="Enter parent's mobile"
                    value={formData.parentMobileNumber}
                    onChange={(e) => setFormData({ ...formData, parentMobileNumber: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentMobileNumber">
                    Student Mobile Number (Optional)
                  </Label>
                  <Input
                    id="studentMobileNumber"
                    type="tel"
                    placeholder="Enter student's mobile"
                    value={formData.studentMobileNumber}
                    onChange={(e) => setFormData({ ...formData, studentMobileNumber: e.target.value })}
                    disabled={updateProfile.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePhoto">
                  Profile Photo
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={updateProfile.isPending}
                    className="cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('profilePhoto')?.click()}
                    disabled={updateProfile.isPending}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>
                {displayPhoto && (
                  <div className="mt-2">
                    <img
                      src={displayPhoto}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-border"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload a new image to replace the current photo (max 5MB)
                </p>
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
