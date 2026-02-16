import { useState, useEffect } from 'react';
import { useGetContactDetails, useUpdateContactDetails, useUpdateLogo } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, Save, Loader2 } from 'lucide-react';

export default function SiteSettingsPanel() {
  const { data: contactDetails, isLoading: contactLoading } = useGetContactDetails();
  const updateContactMutation = useUpdateContactDetails();
  const updateLogoMutation = useUpdateLogo();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Initialize form with current contact details
  useEffect(() => {
    if (contactDetails) {
      setEmail(contactDetails.email);
      setPhone(contactDetails.phone);
      setAddress(contactDetails.address);
    }
  }, [contactDetails]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      toast.error('Please select a logo file');
      return;
    }

    try {
      // Convert file to Uint8Array
      const arrayBuffer = await logoFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      await updateLogoMutation.mutateAsync(uint8Array);
      toast.success('Logo updated successfully');
      setLogoFile(null);
      setLogoPreview(null);
    } catch (error: any) {
      console.error('Logo upload error:', error);
      toast.error(error.message || 'Failed to update logo');
    }
  };

  const handleContactSave = async () => {
    // Basic validation
    if (!email || !phone || !address) {
      toast.error('All contact fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await updateContactMutation.mutateAsync({ email, phone, address });
      toast.success('Contact details updated successfully');
    } catch (error: any) {
      console.error('Contact update error:', error);
      toast.error(error.message || 'Failed to update contact details');
    }
  };

  if (contactLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Logo Upload Section */}
      <Card className="bg-card border-border rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Website Logo</CardTitle>
          <CardDescription>
            Upload a new logo for your tuition center. Recommended size: 512x512px. Max file size: 2MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Choose Logo</span>
                </div>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </Label>
              {logoFile && (
                <span className="text-sm text-muted-foreground">{logoFile.name}</span>
              )}
            </div>

            {logoPreview && (
              <div className="flex items-center gap-4">
                <div className="border border-border rounded-md p-4 bg-muted">
                  <img src={logoPreview} alt="Logo preview" className="h-24 w-24 object-contain" />
                </div>
                <Button
                  onClick={handleLogoUpload}
                  disabled={updateLogoMutation.isPending}
                >
                  {updateLogoMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Upload Logo
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Details Section */}
      <Card className="bg-card border-border rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            Update the contact information displayed on your website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="info@tuitioncenter.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="123-456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="123 Tuition Center Street, City, Country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleContactSave}
            disabled={updateContactMutation.isPending}
          >
            {updateContactMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Contact Details
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
