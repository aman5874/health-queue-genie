import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const AppointmentStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: totalAppointments } = await supabase
        .from('appointments')
        .select('count');

      const { data: todayAppointments } = await supabase
        .from('appointments')
        .select('count')
        .gte('appointment_date', today.toISOString());

      const { data: pendingAppointments } = await supabase
        .from('appointments')
        .select('count')
        .eq('status', 'pending');

      setStats({
        total: totalAppointments?.[0]?.count || 0,
        today: todayAppointments?.[0]?.count || 0,
        pending: pendingAppointments?.[0]?.count || 0
      });
    };

    fetchStats();
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.today}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
        </CardContent>
      </Card>
    </>
  );
};

export default AppointmentStats;