import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface AppointmentStats {
  total: number;
  today: number;
  pending: number;
}

export function AppointmentStats() {
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    today: 0,
    pending: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

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

  return (
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
  );
}