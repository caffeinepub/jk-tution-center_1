import { useState } from 'react';
import { useMarkAttendance, useGetStudentAttendance } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AttendanceCalendar from '../attendance/AttendanceCalendar';
import { toast } from 'sonner';
import type { Principal } from '@icp-sdk/core/principal';
import { AttendanceStatus } from '../../backend';
import { getPreviousMonth, getNextMonth, createAttendanceLookup, getAttendanceForDay, dayToTime } from '../../utils/attendanceDates';

interface AdminStudentAttendanceDialogProps {
  studentId: Principal;
  studentName: string;
  onClose: () => void;
}

export default function AdminStudentAttendanceDialog({
  studentId,
  studentName,
  onClose,
}: AdminStudentAttendanceDialogProps) {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const { data: attendanceEntries = [], isLoading } = useGetStudentAttendance(studentId);
  const markAttendance = useMarkAttendance();

  const handlePreviousMonth = () => {
    const prev = getPreviousMonth(year, month);
    setYear(prev.year);
    setMonth(prev.month);
  };

  const handleNextMonth = () => {
    const next = getNextMonth(year, month);
    setYear(next.year);
    setMonth(next.month);
  };

  const handleDayClick = async (day: number) => {
    const attendanceLookup = createAttendanceLookup(attendanceEntries);
    const currentStatus = getAttendanceForDay(attendanceLookup, year, month, day);
    
    // Toggle between present and absent (unmarked -> present -> absent -> present)
    let newStatus: AttendanceStatus;
    if (currentStatus === 'unmarked' || currentStatus === 'absent') {
      newStatus = AttendanceStatus.present;
    } else {
      newStatus = AttendanceStatus.absent;
    }

    try {
      const date = dayToTime(year, month, day);
      await markAttendance.mutateAsync({
        studentId,
        date,
        status: newStatus,
      });
      toast.success(`Marked as ${newStatus === AttendanceStatus.present ? 'Present' : 'Absent'}`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to mark attendance';
      toast.error(errorMessage);
      console.error('Attendance marking error:', error);
    }
  };

  // Create day states for current month
  const attendanceLookup = createAttendanceLookup(attendanceEntries);
  const dayStates = new Map<number, 'present' | 'absent' | 'unmarked'>();
  
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const status = getAttendanceForDay(attendanceLookup, year, month, day);
    dayStates.set(day, status);
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Attendance for {studentName}</DialogTitle>
          <DialogDescription>
            Click on any day to mark attendance as Present or Absent. Click again to toggle.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <AttendanceCalendar
            year={year}
            month={month}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            dayStates={dayStates}
            onDayClick={handleDayClick}
            readOnly={false}
            isLoading={isLoading || markAttendance.isPending}
          />
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
