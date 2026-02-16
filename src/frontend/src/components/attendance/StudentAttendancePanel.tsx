import { useState } from 'react';
import { useGetCallerAttendance } from '../../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import AttendanceCalendar from './AttendanceCalendar';
import { createAttendanceLookup, getAttendanceForDay } from '../../utils/attendanceDates';

export default function StudentAttendancePanel() {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const { data: attendanceEntries = [], isLoading } = useGetCallerAttendance();

  // Create day states for current month
  const attendanceLookup = createAttendanceLookup(attendanceEntries);
  const dayStates = new Map<number, 'present' | 'absent' | 'unmarked'>();
  
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const status = getAttendanceForDay(attendanceLookup, year, month, day);
    dayStates.set(day, status);
  }

  const handlePreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your attendance...</p>
        </CardContent>
      </Card>
    );
  }

  if (attendanceEntries.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Attendance Records</h3>
          <p className="text-muted-foreground">Your attendance will be tracked here once classes begin.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl">
      <AttendanceCalendar
        year={year}
        month={month}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        dayStates={dayStates}
        readOnly={true}
        isLoading={false}
      />
    </div>
  );
}
