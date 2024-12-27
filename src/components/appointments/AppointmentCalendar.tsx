import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addDays } from "date-fns";

interface AppointmentCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

export function AppointmentCalendar({ selectedDate, onSelectDate }: AppointmentCalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Date & Time</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={(date) =>
            date < new Date() || date > addDays(new Date(), 30)
          }
          className="mb-6"
        />
      </CardContent>
    </Card>
  );
}