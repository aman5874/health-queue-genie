import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface TestCategory {
  id: string;
  name: string;
  description: string;
  price: number;
}

const testCategories: TestCategory[] = [
  {
    id: "1",
    name: "General Health Checkup",
    description: "Complete body checkup including blood tests",
    price: 1500
  },
  {
    id: "2",
    name: "Cardiac Assessment",
    description: "Heart health evaluation and ECG",
    price: 2500
  },
  {
    id: "3",
    name: "Diabetes Screening",
    description: "Blood sugar and HbA1c tests",
    price: 1000
  }
];

export default function TestCategories() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const handleTestSelection = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleContinue = () => {
    if (selectedTests.length === 0) {
      toast({
        title: "No tests selected",
        description: "Please select at least one test to continue",
        variant: "destructive"
      });
      return;
    }

    // Store selected tests in session storage for appointment page
    sessionStorage.setItem('selectedTests', JSON.stringify(selectedTests));
    navigate('/appointments');
  };

  const totalPrice = selectedTests.reduce((sum, testId) => {
    const test = testCategories.find(t => t.id === testId);
    return sum + (test?.price || 0);
  }, 0);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Select Tests</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {testCategories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all ${
              selectedTests.includes(category.id) ? 'ring-2 ring-primary' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Checkbox
                  checked={selectedTests.includes(category.id)}
                  onCheckedChange={() => handleTestSelection(category.id)}
                />
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">₹{category.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">₹{totalPrice}</p>
          </div>
          <Button 
            size="lg"
            onClick={handleContinue}
            disabled={selectedTests.length === 0}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}