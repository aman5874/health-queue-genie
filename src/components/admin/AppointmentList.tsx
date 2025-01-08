import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Appointment {
  id: string;
  patient_name: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface AppointmentListProps {
  selectedDate: Date;
}

const AppointmentList = ({ selectedDate }: AppointmentListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', startOfDay.toISOString())
        .lte('appointment_date', endOfDay.toISOString())
        .order('appointment_time');

      if (error) {
        toast.error("Failed to fetch appointments");
        return;
      }

      setAppointments(data || []);
    };

    fetchAppointments();
  }, [selectedDate]);

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled') => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error(`Failed to ${status} appointment`);
      return;
    }

    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));

    toast.success(`Appointment ${status} successfully`);
  };

  if (appointments.length === 0) {
    return <div className="text-center text-gray-500">No appointments for this date</div>;
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <h3 className="font-medium">{appointment.patient_name}</h3>
            <p className="text-sm text-gray-500">{appointment.appointment_time}</p>
          </div>
          <div className="space-x-2">
            {appointment.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                >
                  Confirm
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                >
                  Cancel
                </Button>
              </>
            )}
            {appointment.status !== 'pending' && (
              <span className={`px-2 py-1 text-sm rounded ${
                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;