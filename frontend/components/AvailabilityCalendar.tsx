'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X } from 'lucide-react';

interface AvailabilityCalendarProps {
  unavailableDates?: string[]; // Array of date strings in ISO format
  onDateSelect?: (dates: { start: string; end: string }) => void;
  minStay?: number;
}

export default function AvailabilityCalendar({
  unavailableDates = [],
  onDateSelect,
  minStay = 1,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateUnavailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return unavailableDates.includes(dateStr);
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedStart) return false;
    if (!selectedEnd && !hoverDate) return date.getTime() === selectedStart.getTime();

    const endDate = selectedEnd || hoverDate;
    if (!endDate) return false;

    return date >= selectedStart && date <= endDate;
  };

  const handleDateClick = (date: Date) => {
    if (isDateUnavailable(date) || isDateInPast(date)) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      // Start new selection
      setSelectedStart(date);
      setSelectedEnd(null);
    } else {
      // Complete selection
      if (date < selectedStart) {
        setSelectedEnd(selectedStart);
        setSelectedStart(date);
      } else {
        setSelectedEnd(date);
      }

      // Notify parent
      if (onDateSelect) {
        const start = date < selectedStart ? date : selectedStart;
        const end = date < selectedStart ? selectedStart : date;
        onDateSelect({
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        });
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
    const displayMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset);
    const days = daysInMonth(displayMonth);
    const firstDay = firstDayOfMonth(displayMonth);
    const calendarDays = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Actual days
    for (let day = 1; day <= days; day++) {
      const date = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
      const isUnavailable = isDateUnavailable(date);
      const isPast = isDateInPast(date);
      const isSelected = isDateSelected(date);
      const isDisabled = isUnavailable || isPast;

      calendarDays.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => selectedStart && !selectedEnd && setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          disabled={isDisabled}
          className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all relative ${
            isDisabled
              ? 'text-gray-300 cursor-not-allowed'
              : isSelected
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
              : 'hover:bg-rose-50 text-gray-700'
          }`}
        >
          {day}
          {isUnavailable && !isPast && (
            <div className="absolute inset-0 flex items-center justify-center">
              <X className="w-3 h-3 text-red-500" />
            </div>
          )}
        </button>
      );
    }

    return calendarDays;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <CalendarIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Check Availability</h2>
          <p className="text-gray-600 text-sm">Select your dates</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-rose-500 to-pink-500" />
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-gray-300" />
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200 relative">
            <X className="w-3 h-3 text-gray-400 absolute inset-0 m-auto" />
          </div>
          <span className="text-gray-600">Unavailable</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[0, 1].map((offset) => {
          const displayMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset);
          return (
            <div key={offset}>
              <div className="flex items-center justify-between mb-4">
                {offset === 0 && (
                  <button
                    onClick={prevMonth}
                    className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                {offset !== 0 && <div className="w-8" />}

                <h3 className="font-bold text-gray-900">
                  {monthNames[displayMonth.getMonth()]} {displayMonth.getFullYear()}
                </h3>

                {offset === 1 && (
                  <button
                    onClick={nextMonth}
                    className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center transition"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                {offset !== 1 && <div className="w-8" />}
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="aspect-square flex items-center justify-center text-xs font-semibold text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar(offset)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected dates display */}
      {selectedStart && selectedEnd && (
        <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-emerald-900">Dates Selected</h4>
          </div>
          <div className="flex items-center gap-4 text-sm text-emerald-800">
            <div>
              <span className="font-medium">Check-in:</span>{' '}
              {selectedStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <span>→</span>
            <div>
              <span className="font-medium">Check-out:</span>{' '}
              {selectedEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="ml-auto">
              <span className="font-bold">
                {Math.ceil((selectedEnd.getTime() - selectedStart.getTime()) / (1000 * 60 * 60 * 24))} nights
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Minimum stay notice */}
      {minStay > 1 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Minimum stay:</strong> {minStay} {minStay === 1 ? 'night' : 'nights'}
          </p>
        </div>
      )}
    </div>
  );
}
