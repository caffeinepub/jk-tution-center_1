import { useState } from 'react';
import { useDeleteAnnouncement } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Bell, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import AnnouncementEditor from './AnnouncementEditor';
import type { Announcement } from '../../backend';

interface AnnouncementListProps {
  announcements: Announcement[];
}

export default function AnnouncementList({ announcements }: AnnouncementListProps) {
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);
  const deleteAnnouncement = useDeleteAnnouncement();

  const handleDelete = async () => {
    if (!deletingAnnouncement) return;

    try {
      await deleteAnnouncement.mutateAsync(deletingAnnouncement.id);
      toast.success('Announcement deleted successfully!');
      setDeletingAnnouncement(null);
    } catch (error) {
      toast.error('Failed to delete announcement');
      console.error('Delete announcement error:', error);
    }
  };

  if (announcements.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Announcements Yet</h3>
          <p className="text-muted-foreground">Create your first announcement to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id.toString()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    {announcement.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    {announcement.date}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setEditingAnnouncement(announcement)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setDeletingAnnouncement(announcement)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{announcement.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingAnnouncement && (
        <AnnouncementEditor
          announcement={editingAnnouncement}
          onClose={() => setEditingAnnouncement(null)}
        />
      )}

      <AlertDialog open={!!deletingAnnouncement} onOpenChange={() => setDeletingAnnouncement(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingAnnouncement?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAnnouncement.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
