import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { MultiStepAppointmentForm } from "@/components/appointments/MultiStepAppointmentForm";
import { AppointmentFormValues } from "@/types/appointment";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  
  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      timeSlot: "",
      paymentMethod: "reception",
      additionalNotes: "",
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      if (!selectedDate) {
        toast.error("Please select a date");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to book an appointment");
        return;
      }

      const appointmentData = {
        user_id: user.id,
        appointment_date: selectedDate.toISOString(),
        name: data.name,
        phone: data.phone,
        email: data.email,
        time_slot: data.timeSlot,
        payment_method: data.paymentMethod,
        additional_notes: data.additionalNotes || '',
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('appointments')
        .insert(appointmentData);

      if (error) throw error;

      toast.success("Appointment booked successfully!");
      navigate("/appointments");
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-gray-600">Select your preferred date and time</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AppointmentCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <MultiStepAppointmentForm
              form={form}
              onSubmit={onSubmit}
              selectedDate={selectedDate}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookAppointment;