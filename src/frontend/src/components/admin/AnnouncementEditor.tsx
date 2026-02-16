import { useState, useEffect } from 'react';
import { useCreateAnnouncement, useUpdateAnnouncement } from '../../hooks/useQueries';
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
import type { Announcement } from '../../backend';

interface AnnouncementEditorProps {
  announcement?: Announcement;
  onClose: () => void;
}

export default function AnnouncementEditor({ announcement, onClose }: AnnouncementEditorProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');

  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setMessage(announcement.message);
      setDate(announcement.date);
    } else {
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [announcement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim() || !date.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (announcement) {
        await updateAnnouncement.mutateAsync({
          id: announcement.id,
          title: title.trim(),
          message: message.trim(),
          date: date.trim(),
        });
        toast.success('Announcement updated successfully!');
      } else {
        await createAnnouncement.mutateAsync({
          title: title.trim(),
          message: message.trim(),
          date: date.trim(),
        });
        toast.success('Announcement created successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to ${announcement ? 'update' : 'create'} announcement`);
      console.error('Announcement operation error:', error);
    }
  };

  const isLoading = createAnnouncement.isPending || updateAnnouncement.isPending;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{announcement ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
            <DialogDescription>
              {announcement ? 'Update the announcement details below.' : 'Fill in the details to create a new announcement.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Holiday Schedule Update"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter the announcement message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : announcement ? 'Update Announcement' : 'Create Announcement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
