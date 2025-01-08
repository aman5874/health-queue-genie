import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface AppointmentStats {
  total: number;
  today: number;
  pending: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    today: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get total appointments
        const { data: totalData, error: totalError } = await supabase
          .from('appointments')
          .select('count');
        
        if (totalError) throw totalError;

        // Get today's appointments
        const { data: todayData, error: todayError } = await supabase
          .from('appointments')
          .select('count')
          .gte('appointment_date', today.toISOString());

        if (todayError) throw todayError;

        // Get pending payments
        const { data: pendingData, error: pendingError } = await supabase
          .from('appointments')
          .select('count')
          .eq('payment_status', 'pending');

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

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <CardTitle>Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}