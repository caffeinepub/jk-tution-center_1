import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDaysInMonth, formatMonthYear } from '../../utils/attendanceDates';

interface AttendanceCalendarProps {
  year: number;
  month: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  dayStates: Map<number, 'present' | 'absent' | 'unmarked'>;
  onDayClick?: (day: number) => void;
  readOnly?: boolean;
  isLoading?: boolean;
}

export default function AttendanceCalendar({
  year,
  month,
  onPreviousMonth,
  onNextMonth,
  dayStates,
  onDayClick,
  readOnly = false,
  isLoading = false,
}: AttendanceCalendarProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  const handleDayClick = (day: number) => {
    if (!readOnly && onDayClick) {
      onDayClick(day);
    }
  };

  const getDayColor = (status: 'present' | 'absent' | 'unmarked') => {
    switch (status) {
      case 'present':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700';
      case 'absent':
        return 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700';
      case 'unmarked':
        return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  return (
    <Card className="surface-card rounded-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{formatMonthYear(year, month)}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onPreviousMonth} disabled={isLoading}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onNextMonth} disabled={isLoading}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded flex-shrink-0 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded flex-shrink-0 bg-muted/50 border border-border"></div>
            <span>Unmarked</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const status = dayStates.get(day) || 'unmarked';
            const isClickable = !readOnly && !isLoading;
            
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                disabled={!isClickable}
                className={`
                  aspect-square rounded-md border text-sm font-medium
                  transition-all duration-200
                  ${getDayColor(status)}
                  ${isClickable ? 'hover:scale-105 hover:shadow-md cursor-pointer focus-ring' : 'cursor-default'}
                  ${isLoading ? 'opacity-50' : ''}
                  disabled:cursor-not-allowed
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
