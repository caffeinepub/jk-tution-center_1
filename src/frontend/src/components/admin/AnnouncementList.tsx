import { useState } from 'react';
import { useDeleteAnnouncement } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Bell, CalendarDays } from 'lucide-react';
import AnnouncementEditor from './AnnouncementEditor';
import type { Announcement } from '../../backend';
import { toast } from 'sonner';

interface AnnouncementListProps {
  announcements: Announcement[];
}

export default function AnnouncementList({ announcements }: AnnouncementListProps) {
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const deleteMutation = useDeleteAnnouncement();

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Announcement deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete announcement');
    }
  };

  if (announcements.length === 0) {
    return (
      <Card className="bg-card border-border rounded-lg shadow-md">
        <CardContent className="text-center py-12">
          <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Announcements Yet</h3>
          <p className="text-muted-foreground">Click "Add Announcement" to create your first announcement.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id.toString()} className="bg-card border-border rounded-lg shadow-md smooth-transition smooth-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {announcement.date}
                    </Badge>
                  </div>
                  <CardDescription>{announcement.message}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingAnnouncement(announcement)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(announcement.id)}
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

      {editingAnnouncement && (
        <AnnouncementEditor
          announcement={editingAnnouncement}
          onClose={() => setEditingAnnouncement(null)}
        />
      )}
    </>
  );
}
