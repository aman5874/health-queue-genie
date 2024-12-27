import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Phone } from "lucide-react";

const Index = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    // TODO: Integrate with Supabase phone auth
    setShowOTP(true);
    toast.success("OTP sent to your phone number");
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    // TODO: Verify OTP with Supabase
    toast.success("OTP verified successfully");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>Health Queue Genie</CardTitle>
          <CardDescription>
            Login or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showOTP ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSendOTP}>
                    <Phone className="h-4 w-4 mr-2" />
                    Send OTP
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Enter OTP
                </label>
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowOTP(false);
                    setOtp("");
                  }}
                >
                  Back
                </Button>
                <Button onClick={handleVerifyOTP}>
                  Verify OTP
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;