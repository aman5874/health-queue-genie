import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AppointmentFormValues } from "@/types/appointment";
import { UseFormReturn } from "react-hook-form";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepProps {
  form: UseFormReturn<AppointmentFormValues>;
  onNext: () => void;
  onPrevious: () => void;
}

const Step1 = ({ form, onNext }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <h2 className="text-2xl font-semibold">Personal Information</h2>
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            {...form.register("name")}
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone Number</label>
          <input
            {...form.register("phone")}
            className="w-full p-2 border rounded"
            placeholder="Enter phone number"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          {...form.register("email")}
          className="w-full p-2 border rounded"
          placeholder="Enter email"
        />
      </div>
    </div>
    <Button onClick={onNext} className="w-full mt-4">
      Next <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  </motion.div>
);

const Step2 = ({ form, onNext, onPrevious }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <h2 className="text-2xl font-semibold">Appointment Details</h2>
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Select Time Slot</label>
        <select
          {...form.register("timeSlot")}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a time</option>
          <option value="09:00 AM">09:00 AM</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="02:00 PM">02:00 PM</option>
          <option value="03:00 PM">03:00 PM</option>
          <option value="04:00 PM">04:00 PM</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Additional Notes</label>
        <textarea
          {...form.register("additionalNotes")}
          className="w-full p-2 border rounded"
          placeholder="Any additional information"
          rows={4}
        />
      </div>
    </div>
    <div className="flex gap-4">
      <Button onClick={onPrevious} variant="outline" className="w-full">
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <Button onClick={onNext} className="w-full">
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </motion.div>
);

const Step3 = ({ form, onPrevious }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <h2 className="text-2xl font-semibold">Payment Method</h2>
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <label className="inline-flex items-center">
          <input
            type="radio"
            {...form.register("paymentMethod")}
            value="reception"
            className="mr-2"
          />
          Pay at Reception
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            {...form.register("paymentMethod")}
            value="online"
            className="mr-2"
          />
          Pay Online
        </label>
      </div>
    </div>
    <div className="flex gap-4">
      <Button onClick={onPrevious} variant="outline" className="w-full">
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <Button type="submit" className="w-full">
        Confirm Booking
      </Button>
    </div>
  </motion.div>
);

interface MultiStepAppointmentFormProps {
  form: UseFormReturn<AppointmentFormValues>;
  onSubmit: (data: AppointmentFormValues) => void;
  selectedDate: Date | undefined;
}

export function MultiStepAppointmentForm({
  form,
  onSubmit,
  selectedDate,
}: MultiStepAppointmentFormProps) {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const previousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Progress value={(step / 3) * 100} className="mb-8" />
      
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1 form={form} onNext={nextStep} onPrevious={previousStep} />
          )}
          {step === 2 && (
            <Step2 form={form} onNext={nextStep} onPrevious={previousStep} />
          )}
          {step === 3 && (
            <Step3 form={form} onNext={nextStep} onPrevious={previousStep} />
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}