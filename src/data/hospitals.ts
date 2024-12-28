export interface Hospital {
  id: string;
  name: string;
  address: string;
  waitTime: string;
}

export const hospitals: Hospital[] = [
  {
    id: "1",
    name: "City General Hospital",
    address: "123 Main Street, City Center",
    waitTime: "15-20 minutes"
  },
  {
    id: "2",
    name: "Community Medical Center",
    address: "456 Park Avenue, Downtown",
    waitTime: "30-45 minutes"
  },
  // Add more hospitals as needed
]; 