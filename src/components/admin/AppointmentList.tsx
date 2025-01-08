import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Appointment {
  id: string;
  name: string;
  appointment_date: string;
  status: string;
  email: string;
  phone: string;
}

interface AppointmentListProps {
  selectedDate: Date | undefined;
}

export function AppointmentList({ selectedDate }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        query = query
          .gte('appointment_date', startOfDay.toISOString())
          .lte('appointment_date', endOfDay.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch appointments");
      console.error('Error fetching appointments:', error);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error: any) {
      toast.error("Failed to update appointment status");
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{appointment.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(appointment.appointment_date).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{appointment.email}</p>
                <p className="text-sm text-gray-500">{appointment.phone}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                  disabled={appointment.status === 'confirmed'}
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                  disabled={appointment.status === 'cancelled'}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <p className="text-center text-gray-500">No appointments found for this date</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}