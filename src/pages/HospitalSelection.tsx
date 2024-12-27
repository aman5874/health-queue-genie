import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  address: string;
  waitTime: string;
  phone: string;
}

const hospitals: Hospital[] = [
  {
    id: "1",
    name: "City General Hospital",
    address: "123 Healthcare Ave, City, State",
    waitTime: "15-20 mins",
    phone: "(555) 123-4567"
  },
  {
    id: "2",
    name: "Memorial Medical Center",
    address: "456 Medical Blvd, City, State",
    waitTime: "30-35 mins",
    phone: "(555) 234-5678"
  },
  {
    id: "3",
    name: "Community Health Center",
    address: "789 Wellness Way, City, State",
    waitTime: "10-15 mins",
    phone: "(555) 345-6789"
  }
];

const HospitalSelection = () => {
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Select a Hospital</h1>
          <p className="text-gray-600">Choose from available hospitals in your area</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((hospital) => (
            <Card 
              key={hospital.id}
              className={`cursor-pointer transition-all ${
                selectedHospital === hospital.id 
                  ? 'ring-2 ring-primary' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedHospital(hospital.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{hospital.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {hospital.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Current wait time: {hospital.waitTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{hospital.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            size="lg"
            disabled={!selectedHospital}
            onClick={() => {
              if (selectedHospital) {
                // TODO: Handle hospital selection
                console.log("Selected hospital:", selectedHospital);
              }
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HospitalSelection;