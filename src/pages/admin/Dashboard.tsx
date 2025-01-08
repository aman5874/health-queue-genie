import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface AppointmentStats {
  total: number;
  today: number;
  pending: number;
}

interface Appointment {
  id: string;
  name: string;
  appointment_date: string;
  status: string;
  email: string;
  phone: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    today: 0,
    pending: 0
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchStats();
    fetchAppointments();
  }, [selectedDate]);

  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: totalData, error: totalError } = await supabase
        .from('appointments')
        .select('count');
      
      if (totalError) throw totalError;

      const { data: todayData, error: todayError } = await supabase
        .from('appointments')
        .select('count')
        .gte('appointment_date', today.toISOString());

      if (todayError) throw todayError;

      const { data: pendingData, error: pendingError } = await supabase
        .from('appointments')
        .select('count')
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      setStats({
        total: totalData[0]?.count || 0,
        today: todayData[0]?.count || 0,
        pending: pendingData[0]?.count || 0
      });
    } catch (error: any) {
      toast.error("Failed to fetch statistics");
      console.error('Error fetching stats:', error);
    }
  };

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
      fetchStats();
    } catch (error: any) {
      toast.error("Failed to update appointment status");
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Total Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.today}</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Pending Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </Card>

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
        </div>
      </motion.div>
    </div>
  );
}