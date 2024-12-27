import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hospitals } from "../data/hospitals"; // You'll need to move the hospitals data to a separate file
import { AppointmentFormValues } from "@/types/appointment";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  
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
      if (!selectedDate || !selectedHospital) {
        toast.error("Please select a date and hospital");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to book an appointment");
        return;
      }

      // Format the appointment data to match Supabase table structure
      const appointmentData = {
        user_id: user.id,
        hospital_id: selectedHospital,
        appointment_date: selectedDate.toISOString(),
        name: data.name,
        phone: data.phone,
        email: data.email,
        time_slot: data.timeSlot,
        payment_method: data.paymentMethod,
        additional_notes: data.additionalNotes || '',  // Ensure it's not undefined
        status: 'pending',
        created_at: new Date().toISOString()  // Add created_at if your table requires it
      };

      // Save to Supabase - simplified query
      const { error } = await supabase
        .from('appointments')
        .insert(appointmentData);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Send WhatsApp notifications
      await sendWhatsAppNotifications(appointmentData);

      toast.success("Appointment booked successfully!");
      navigate("/appointments");
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
    }
  };

  // WhatsApp notification function using WhatsApp Business API
  const sendWhatsAppNotifications = async (appointment: any) => {
    const TWILIO_ACCOUNT_SID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.REACT_APP_TWILIO_PHONE_NUMBER;
    const ADMIN_PHONE = process.env.REACT_APP_ADMIN_PHONE;

    const appointmentDate = new Date(appointment.appointment_date).toLocaleDateString();
    
    try {
      // Message to user
      const userMessage = `Your appointment has been confirmed for ${appointmentDate} at ${appointment.time_slot}. Thank you for booking with us!`;
      
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'From': `whatsapp:${TWILIO_PHONE_NUMBER}`,
          'To': `whatsapp:${appointment.phone}`,
          'Body': userMessage
        })
      });

      // Message to admin
      const adminMessage = `New appointment booked!\nPatient: ${appointment.name}\nPhone: ${appointment.phone}\nDate: ${appointmentDate}\nTime: ${appointment.time_slot}`;
      
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'From': `whatsapp:${TWILIO_PHONE_NUMBER}`,
          'To': `whatsapp:${ADMIN_PHONE}`,
          'Body': adminMessage
        })
      });
    } catch (error) {
      console.error('Twilio WhatsApp notification error:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-gray-600">Select a hospital and your preferred time</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Hospital</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {hospitals.map((hospital) => (
                    <Card 
                      key={hospital.id}
                      className={`cursor-pointer transition-all ${
                        selectedHospital === hospital.id 
                          ? 'ring-2 ring-primary' 
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedHospital(hospital.id)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{hospital.name}</h3>
                        <p className="text-sm text-gray-600">{hospital.address}</p>
                        <p className="text-sm mt-2">Wait time: {hospital.waitTime}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <AppointmentCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>

          <AppointmentForm
            form={form}
            onSubmit={onSubmit}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default BookAppointment; 