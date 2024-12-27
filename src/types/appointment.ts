export interface AppointmentFormValues {
  name: string;
  phone: string;
  email: string;
  timeSlot: string;
  paymentMethod: "reception" | "online";
  additionalNotes?: string;
  hospital_id?: string;
  appointment_date?: string;
}