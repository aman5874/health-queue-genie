import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Appointment {
  id: string;
  user_id: string;
  hospital_id: string;
  appointment_date: string;
  status: string;
  // Add other fields as needed
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // First get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("No authenticated user");
        }

        // Then fetch their appointments
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('appointment_date', { ascending: true });

        if (error) throw error;

        setAppointments(data || []);
      } catch (error: any) {
        console.error('Error fetching appointments:', error);
        toast.error(error.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Appointments</CardTitle>
          <Button asChild>
            <Link to="/book-appointment">Book New Appointment</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p>No appointments found. Book your first appointment!</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="p-4 border rounded-lg"
                >
                  <p>Date: {new Date(appointment.appointment_date).toLocaleDateString()}</p>
                  <p>Status: {appointment.status}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointments;