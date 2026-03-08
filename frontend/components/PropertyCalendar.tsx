'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UnavailableDate {
  date: string;
  reason: 'booked' | 'blocked' | 'maintenance';
}

interface PropertyCalendarProps {
  unavailableDates?: UnavailableDate[];
  minStayWeeks?: number;
  maxStayMonths?: number;
  onDateRangeSelect?: (checkIn: Date | null, checkOut: Date | null) => void;
  selectedCheckIn?: Date | null;
  selectedCheckOut?: Date | null;
}

export default function PropertyCalendar({
  unavailableDates = [],
  minStayWeeks = 2,
  maxStayMonths = 12,
  onDateRangeSelect,
  selectedCheckIn,
  selectedCheckOut,
}: PropertyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Convert unavailable dates to Set for O(1) lookup
  const unavailableDateSet = useMemo(() => {
    return new Set(
      unavailableDates.map((d) => new Date(d.date).toDateString())
    );
  }, [unavailableDates]);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDateSet.has(date.toDateString());
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateDisabled = (date: Date) => {
    return isDateInPast(date) || isDateUnavailable(date);
  };

  const isDateInRange = (date: Date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return date >= selectedCheckIn && date <= selectedCheckOut;
  };

  const isDateHoveredInRange = (date: Date) => {
    if (!selectedCheckIn || !hoveredDate || selectedCheckOut) return false;
    const start = selectedCheckIn < hoveredDate ? selectedCheckIn : hoveredDate;
    const end = selectedCheckIn < hoveredDate ? hoveredDate : selectedCheckIn;
    return date > start && date < end;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      // Start new selection
      onDateRangeSelect?.(date, null);
    } else {
      // Complete selection
      if (date < selectedCheckIn) {
        onDateRangeSelect?.(date, selectedCheckIn);
      } else {
        // Check if there are any unavailable dates in between
        const daysBetween = Math.ceil((date.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24));
        let hasUnavailableDates = false;

        for (let i = 1; i < daysBetween; i++) {
          const checkDate = new Date(selectedCheckIn);
          checkDate.setDate(checkDate.getDate() + i);
          if (isDateUnavailable(checkDate)) {
            hasUnavailableDates = true;
            break;
          }
        }

        if (hasUnavailableDates) {
          // Reset and start from new date
          onDateRangeSelect?.(date, null);
        } else {
          onDateRangeSelect?.(selectedCheckIn, date);
        }
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const renderCalendar = (monthOffset: number = 0) => {
    const displayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset);
    const days = daysInMonth(displayDate);
    const firstDay = firstDayOfMonth(displayDate);
    const weeks = [];
    let week = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      week.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Add days of month
    for (let day = 1; day <= days; day++) {
      const date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
      const disabled = isDateDisabled(date);
      const inRange = isDateInRange(date);
      const isCheckIn = selectedCheckIn?.toDateString() === date.toDateString();
      const isCheckOut = selectedCheckOut?.toDateString() === date.toDateString();
      const isHoveredInRange = isDateHoveredInRange(date);

      week.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
          disabled={disabled}
          className={`
            aspect-square p-2 text-sm rounded-lg transition-all relative
            ${disabled ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'hover:bg-rose-50 cursor-pointer'}
            ${inRange ? 'bg-rose-100' : ''}
            ${isHoveredInRange ? 'bg-rose-50' : ''}
            ${isCheckIn || isCheckOut ? 'bg-rose-600 text-white font-bold hover:bg-rose-700' : ''}
            ${!disabled && !inRange && !isCheckIn && !isCheckOut ? 'text-gray-900' : ''}
          `}
        >
          {day}
          {isDateUnavailable(date) && !isDateInPast(date) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-red-500 rounded-full" />
            </div>
          )}
        </button>
      );

      if (week.length === 7) {
        weeks.push(
          <div key={`week-${weeks.length}`} className="grid grid-cols-7 gap-1">
            {week}
          </div>
        );
        week = [];
      }
    }

    // Add remaining days
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(<div key={`empty-end-${week.length}`} className="aspect-square" />);
      }
      weeks.push(
        <div key={`week-${weeks.length}`} className="grid grid-cols-7 gap-1">
          {week}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 p-2">
              {day}
            </div>
          ))}
        </div>
        {weeks}
      </div>
    );
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const nextMonthName = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1
  ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Select Dates</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Two month view on desktop, one on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">{monthName}</h4>
          {renderCalendar(0)}
        </div>
        <div className="hidden lg:block">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">{nextMonthName}</h4>
          {renderCalendar(1)}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-rose-600 rounded" />
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-rose-100 rounded" />
          <span className="text-gray-600">In Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 rounded relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-red-500 rounded-full" />
            </div>
          </div>
          <span className="text-gray-600">Unavailable</span>
        </div>
      </div>

      {/* Stay duration info */}
      {minStayWeeks > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Minimum stay:</strong> {minStayWeeks} week{minStayWeeks > 1 ? 's' : ''}
          </p>
          {maxStayMonths && (
            <p className="text-sm text-blue-900 mt-1">
              <strong>Maximum stay:</strong> {maxStayMonths} month{maxStayMonths > 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
