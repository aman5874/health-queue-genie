export interface AppointmentFormValues {
  date: Date | undefined;
  timeSlot: string;
  name: string;
  phone: string;
  email: string;
  paymentMethod: "online" | "reception";
  additionalNotes: string;
}