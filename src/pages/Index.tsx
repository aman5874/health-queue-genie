import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Phone } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // For Indian numbers, ensure exactly 10 digits
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('+91') && cleaned.length === 13) {
      return cleaned;
    }
    
    throw new Error('Invalid phone number format. Please enter a 10-digit number');
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          channel: 'sms'  // Explicitly specify SMS channel
        }
      });

      if (error) {
        throw error;
      }

      setShowOTP(true);
      toast.success("OTP sent to your phone number");
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast.error(error.error_description || error.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // First, get the session to check if we're already authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otp,
          type: 'sms',
        });

        if (error) {
          console.error('Verification error:', error);
          throw error;
        }

        if (!data?.user) {
          throw new Error('No user data received');
        }

        // Create or update user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            phone_number: formattedPhone,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Profile error:', profileError);
          // Continue even if profile update fails
        }
      }

      toast.success("Successfully logged in!");
      navigate('/appointments');
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.error_description || error.message || "Failed to verify OTP");
    }
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
                    pattern="[0-9]*"
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
                <div className="flex gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl border-2 border-gray-200 rounded-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      value={otp[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 1) {
                          const newOtp = otp.split('');
                          newOtp[index] = value;
                          setOtp(newOtp.join(''));
                          
                          // Auto-focus next input
                          if (value && index < 5) {
                            const nextInput = e.target.nextElementSibling as HTMLInputElement;
                            if (nextInput) nextInput.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace
                        if (e.key === 'Backspace' && !otp[index] && index > 0) {
                          const prevInput = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
                          if (prevInput) prevInput.focus();
                        }
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Enter the 6-digit code sent to your phone
                </p>
              </div>
              <div className="flex justify-between items-center pt-4">
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