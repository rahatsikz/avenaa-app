import { format, parseISO } from "date-fns";
import { useEffect } from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { AvenaCalendar } from "./avena-calendar";

export interface Availability {
  date: string;
  available: boolean;
  units: number;
}

export interface Range {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  availabilityCalendar?: Availability[];
  initialRange?: Range;
  onChange?: (range: Range) => void;
  range: Range;
  setRange: (range: Range) => void;
}

export function findConsecutiveAvailablePairs(
  calendar: Availability[]
): [Availability, Availability] | null {
  for (let i = 0; i < calendar.length - 1; i++) {
    const current = calendar[i];
    const next = calendar[i + 1];

    if (
      current &&
      next &&
      current.available &&
      current.units > 0 &&
      next.available &&
      next.units > 0
    ) {
      return [current, next];
    }
  }

  return null; // No consecutive pair found
}

export function isDateNotAvailable(
  calendar: Availability[],
  targetDate: string
): boolean {
  const trimmed = targetDate.trim();

  // More lenient regex: YYYY-M-D, YYYY-MM-DD, etc.
  const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;
  if (!dateRegex.test(trimmed)) {
    throw new Error(
      `Invalid targetDate format: "${targetDate}". Expected YYYY-MM-DD or similar.`
    );
  }

  // Pad month/day to always 2 digits for proper comparison
  const [year, month, day] = trimmed.split("-");
  const normalized = [
    year,
    month!.padStart(2, "0"),
    day!.padStart(2, "0"),
  ].join("-");

  return calendar.some((entry) => {
    const entryDate = entry.date.slice(0, 10); // Get YYYY-MM-DD
    return entryDate === normalized && (!entry.available || entry.units === 0);
  });
}

export default function DateRangePicker({
  availabilityCalendar,
  initialRange,
  onChange,
  range,
  setRange,
  ...props
}: DateRangePickerProps & React.HTMLAttributes<HTMLDivElement>) {
  // Initialize from props

  useEffect(() => {
    if (initialRange) {
      setRange(initialRange);
    }
  }, [initialRange]);

  const handleRangeChange = (r: Range) => {
    const pair = findConsecutiveAvailablePairs(availabilityCalendar || []);

    const blocked = (date: Date | null) => {
      if (!date) return false;
      const iso = format(date, "yyyy-MM-dd");
      return isDateNotAvailable(availabilityCalendar || [], iso);
    };

    let { start, end } = r;
    if (pair && (blocked(start) || blocked(end))) {
      start = parseISO(pair[0].date);
      end = parseISO(pair[1].date);
    }

    const updated: Range = { start, end };
    setRange(updated);
    onChange?.(updated);
  };

  return (
    <View
      className={cn(
        "flex w-full gap-5 px-5 py-4 flex-col md:flex-row md:gap-8",
        props.className
      )}
    >
      <AvenaCalendar
        range={range}
        onRangeChange={handleRangeChange}
        monthOffset={0}
        availability={availabilityCalendar || []}
      />
      <AvenaCalendar
        range={range}
        onRangeChange={handleRangeChange}
        monthOffset={1}
        availability={availabilityCalendar || []}
      />
    </View>
  );
}
