import { addDays, compareAsc, format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { FC, useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { cn } from "~/lib/utils";

interface Availability {
  date: string;
  available: boolean;
  units: number;
}

interface Range {
  start: Date | null;
  end: Date | null;
}

interface CalendarProps {
  range: Range;
  onRangeChange: (range: Range) => void;
  monthOffset?: number;
  availability: Availability[];
  notClickable?: boolean;
}

export const AvenaCalendar: FC<CalendarProps> = ({
  range,
  onRangeChange,
  monthOffset = 0,
  availability,
  notClickable = false,
}) => {
  const [onDisplayDate, setOnDisplayDate] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + monthOffset, 1);
  });
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [startDay, setStartDay] = useState<number>(0);

  const availMap = useMemo<Record<string, boolean>>(() => {
    return availability.reduce((map, { date, available }) => {
      const key = format(parseISO(date), "yyyy-MM-dd");
      map[key] = available;
      return map;
    }, {} as Record<string, boolean>);
  }, [availability]);

  useEffect(() => {
    const d = new Date();
    setOnDisplayDate(new Date(d.getFullYear(), d.getMonth() + monthOffset, 1));
  }, [monthOffset]);

  useEffect(() => {
    const year = onDisplayDate.getFullYear();
    const month = onDisplayDate.getMonth();
    const daysCount = new Date(year, month + 1, 0).getDate();
    setStartDay(new Date(year, month, 1).getDay());
    setDaysInMonth(Array.from({ length: daysCount }, (_, i) => i + 1));
  }, [onDisplayDate]);

  const goToPrevMonth = () =>
    setOnDisplayDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setOnDisplayDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const currentMonth = onDisplayDate.getMonth();
  const currentYear = onDisplayDate.getFullYear();

  const isDisabled = (day: number): boolean => {
    const key = format(new Date(currentYear, currentMonth, day), "yyyy-MM-dd");
    const todayKey = format(new Date(), "yyyy-MM-dd");
    const dayAfterThreeMonths = format(addDays(new Date(), 90), "yyyy-MM-dd");
    if (
      key < todayKey ||
      availMap[key] === false ||
      key > dayAfterThreeMonths
    ) {
      return true;
    }

    // NEW: block any date whose *neighbors* are both disabled/unavailable
    const prevKey = format(
      addDays(new Date(currentYear, currentMonth, day), -1),
      "yyyy-MM-dd"
    );
    const nextKey = format(
      addDays(new Date(currentYear, currentMonth, day), 1),
      "yyyy-MM-dd"
    );
    const prevUnavailable = prevKey < todayKey || availMap[prevKey] === false;
    const nextUnavailable = nextKey < todayKey || availMap[nextKey] === false;
    if (prevUnavailable && nextUnavailable) {
      return true;
    }

    return false;
  };

  const hasUnavailable = (start: Date, end: Date): boolean => {
    let d = start;
    while (compareAsc(d, end) <= 0) {
      const key = format(d, "yyyy-MM-dd");
      if (availMap[key] === false) return true;
      d = addDays(d, 1);
    }
    return false;
  };

  const handleDayPress = (day: number) => {
    if (isDisabled(day) || notClickable) return;
    const clicked = new Date(currentYear, currentMonth, day, 12);
    const { start, end } = range;

    if (start && end) {
      onRangeChange({ start: clicked, end: null });
      return;
    }

    if (!start) {
      onRangeChange({ start: clicked, end: null });
      return;
    }

    if (clicked < start) {
      if (!hasUnavailable(clicked, start)) {
        onRangeChange({ start: clicked, end: start });
      }
      return;
    }

    if (!hasUnavailable(start, clicked)) {
      onRangeChange({ start, end: clicked });
    }
  };

  const isStart = (day: number): boolean =>
    !!range.start &&
    range.start.getDate() === day &&
    range.start.getMonth() === currentMonth &&
    range.start.getFullYear() === currentYear;

  const isEnd = (day: number): boolean =>
    !!range.end &&
    range.end.getDate() === day &&
    range.end.getMonth() === currentMonth &&
    range.end.getFullYear() === currentYear;

  const inRange = (day: number): boolean => {
    if (!range.start || !range.end) return false;
    const d = new Date(currentYear, currentMonth, day);
    return d > range.start && d < range.end;
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create a complete grid of all cells
  const createCalendarGrid = () => {
    const grid = [];

    // Add empty cells at the beginning
    for (let i = 0; i < startDay; i++) {
      grid.push({ type: "empty", key: `empty-start-${i}` });
    }

    // Add day cells
    daysInMonth.forEach((day) => {
      grid.push({ type: "day", day, key: `day-${day}` });
    });

    // Add empty cells at the end to complete the grid
    const totalCells = Math.ceil(grid.length / 7) * 7;
    const emptyCellsNeeded = totalCells - grid.length;
    for (let i = 0; i < emptyCellsNeeded; i++) {
      grid.push({ type: "empty", key: `empty-end-${i}` });
    }

    return grid;
  };

  const calendarGrid = createCalendarGrid();
  const rows = [];

  // Split grid into rows of 7
  for (let i = 0; i < calendarGrid.length; i += 7) {
    rows.push(calendarGrid.slice(i, i + 7));
  }

  const renderCell = (cell: any, index: number) => {
    if (cell.type === "empty") {
      return (
        <View
          key={cell.key}
          className='flex-1 h-12 border-r border-input border-b '
        >
          <View className='flex-1' />
        </View>
      );
    }

    const { day } = cell;
    const disabled = isDisabled(day);
    const startFlag = isStart(day);
    const endFlag = isEnd(day);
    const between = inRange(day);

    let bgColor = "";
    let textColor = "text-foreground";

    if (disabled) {
      bgColor = "bg-muted";
      textColor = "text-muted-foreground";
    } else if (startFlag || endFlag) {
      bgColor = "bg-primary";
      textColor = "text-primary-foreground";
    } else if (between) {
      bgColor = "bg-primary/20";
      textColor = "text-primary";
    }

    return (
      <Pressable
        key={cell.key}
        onPress={() => handleDayPress(day)}
        disabled={notClickable || disabled}
        className={cn(
          "flex-1 h-12 items-center justify-center border-r border-input border-b ",
          bgColor,
          disabled && "opacity-50"
        )}
      >
        <Text className={cn("text-sm font-medium", textColor)}>{day}</Text>
      </Pressable>
    );
  };

  return (
    <View className='rounded-lg border border-border bg-background p-4 shadow-sm'>
      {/* Header */}
      <View className='flex-row items-center justify-between mb-4'>
        <Pressable
          onPress={goToPrevMonth}
          className='p-2 rounded-full hover:bg-gray-200'
        >
          <ChevronLeft size={14} color={"#a3a3a3"} />
        </Pressable>
        <Text className='font-medium text-lg text-foreground'>
          {format(onDisplayDate, "LLLL yyyy")}
        </Text>
        <Pressable
          onPress={goToNextMonth}
          className='p-2 rounded-full hover:bg-gray-200'
        >
          <ChevronRight size={14} color={"#a3a3a3"} />
        </Pressable>
      </View>

      {/* Calendar Container */}
      <View className='border border-input rounded-md overflow-hidden'>
        {/* Weekdays Header */}
        <View className='flex-row'>
          {weekdays.map((day, index) => (
            <View
              key={day}
              className={cn(
                "flex-1 items-center justify-center py-2 border-r border-input",
                index === 6 && "border-r-0"
              )}
            >
              <Text className='text-sm font-medium text-muted-foreground'>
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Rows */}
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} className='flex-row'>
            {row.map((cell: any, cellIndex) => {
              const isLastCell = cellIndex === 6;

              if (cell.type === "empty") {
                return (
                  <View
                    key={cell.key}
                    className={cn(
                      "flex-1 h-12 border-b border-input",
                      !isLastCell && "border-r border-input"
                    )}
                  />
                );
              }

              const { day } = cell;
              const disabled = isDisabled(day);
              const startFlag = isStart(day);
              const endFlag = isEnd(day);
              const between = inRange(day);

              let bgColor = "";
              let textColor = "text-foreground";

              if (disabled) {
                bgColor = "bg-muted";
                textColor = "text-muted-foreground";
              } else if (startFlag || endFlag) {
                bgColor = "bg-primary";
                textColor = "text-primary-foreground";
              } else if (between) {
                bgColor = "bg-primary/20";
                textColor = "text-primary";
              }

              return (
                <Pressable
                  key={cell.key}
                  onPress={() => handleDayPress(day)}
                  disabled={notClickable || disabled}
                  className={cn(
                    "flex-1 h-12 items-center justify-center border-b border-input",
                    !isLastCell && "border-r border-input",
                    bgColor,
                    disabled && "opacity-50"
                  )}
                >
                  <Text className={cn("text-sm font-medium", textColor)}>
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};
