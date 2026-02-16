import { useState } from 'react';
import { useCreateStudentProfile } from '../../hooks/useQueries';
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
import type { StudentProfile } from '../../backend';
import { fileToUint8Array } from '../../utils/fileToUint8Array';

export default function ProfileSetupModal() {
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
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const createProfile = useCreateStudentProfile();

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
      setProfilePhotoFile(file);
      
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
      toast.error('Please enter your name');
      return;
    }
    if (!formData.age || parseInt(formData.age) <= 0) {
      toast.error('Please enter a valid age');
      return;
    }
    if (!formData.className.trim()) {
      toast.error('Please enter your class');
      return;
    }
    if (!formData.school.trim()) {
      toast.error('Please enter your school name');
      return;
    }
    if (!formData.batch) {
      toast.error('Please select a batch');
      return;
    }
    if (!formData.tuitionCenter.trim()) {
      toast.error('Please enter the tuition center');
      return;
    }
    if (!formData.parentMobileNumber.trim()) {
      toast.error('Please enter parent mobile number');
      return;
    }
    if (!formData.dateOfBirth.trim()) {
      toast.error('Please enter your date of birth');
      return;
    }
    if (!profilePhotoFile) {
      toast.error('Please upload a profile photo');
      return;
    }

    try {
      const photoBytes = await fileToUint8Array(profilePhotoFile);
      
      const profile: StudentProfile = {
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

      await createProfile.mutateAsync(profile);
      toast.success('Profile created successfully!');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create profile';
      toast.error(errorMessage);
      console.error('Profile creation error:', error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]" onPointerDownOutside={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Your Student Profile</DialogTitle>
            <DialogDescription>
              Please complete all required fields to set up your profile.
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
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={createProfile.isPending}
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
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    disabled={createProfile.isPending}
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
                    disabled={createProfile.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">
                    School <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="school"
                    placeholder="Enter your school name"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    disabled={createProfile.isPending}
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
                    disabled={createProfile.isPending}
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
                    disabled={createProfile.isPending}
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
                  disabled={createProfile.isPending}
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
                    disabled={createProfile.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentMobileNumber">
                    Student Mobile Number (Optional)
                  </Label>
                  <Input
                    id="studentMobileNumber"
                    type="tel"
                    placeholder="Enter your mobile"
                    value={formData.studentMobileNumber}
                    onChange={(e) => setFormData({ ...formData, studentMobileNumber: e.target.value })}
                    disabled={createProfile.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePhoto">
                  Profile Photo <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={createProfile.isPending}
                    className="cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('profilePhoto')?.click()}
                    disabled={createProfile.isPending}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose
                  </Button>
                </div>
                {photoPreview && (
                  <div className="mt-2">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-border"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload an image file (max 5MB)
                </p>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={createProfile.isPending} className="w-full sm:w-auto">
              {createProfile.isPending ? 'Creating Profile...' : 'Create Profile'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
