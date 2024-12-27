import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { AppointmentFormValues } from "@/types/appointment";

export default function Appointments() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  useEffect(() => {
    const tests = sessionStorage.getItem('selectedTests');
    if (!tests) {
      navigate('/categories');
      return;
    }
    setSelectedTests(JSON.parse(tests));
  }, [navigate]);

  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      paymentMethod: "reception",
      additionalNotes: "",
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date for your appointment",
        variant: "destructive",
      });
      return;
    }

    // Set the date in the form data
    data.date = selectedDate;

    // TODO: Integrate with Supabase to store appointment data
    console.log("Appointment data:", { ...data, tests: selectedTests });
    
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment has been scheduled for ${format(
        selectedDate,
        "PPP"
      )} at ${data.timeSlot}`,
    });

    // Clear selected tests from session storage
    sessionStorage.removeItem('selectedTests');
    
    // Navigate to confirmation page (to be implemented)
    navigate('/');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <AppointmentCalendar 
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <AppointmentForm 
          form={form}
          onSubmit={onSubmit}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
}