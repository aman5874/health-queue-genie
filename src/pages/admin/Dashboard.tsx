import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { AppointmentStats } from "@/components/admin/AppointmentStats";
import { AppointmentList } from "@/components/admin/AppointmentList";

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <AppointmentStats />

        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </Card>

          <AppointmentList selectedDate={selectedDate} />
        </div>
      </motion.div>
    </div>
  );
}