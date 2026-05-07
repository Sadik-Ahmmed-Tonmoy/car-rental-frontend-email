export interface IVehicle {
  id: string;
  make: string;
  model: string;
  registrationNumber: string;
  currentMilage: string; // or number, see note below
  minPrice: number;
  maxPrice: number;
  priceRange: string;
  sellerType: "private" | "trade"; // If you know all options
  images: string[]; // assuming URLs or base64 strings
  userId: string;
  maxMiles: number;
  engineSize: string; // it's "undefined" as a string — consider fixing!
  engineCapacityLitres: string; // or number, depending on your API
  engineCapacityCc: string; // or number
  transmission: string; // Optional, if not always present
  fuelType: string; // Optional, if not always present
  bodyStyle: string; // Optional, if not always present
  doors: number; // Optional, if not always present
  address: string; // Optional, if not always present
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  user?: {
    firstName: string;
    lastName: string;
    address: string;
  };
}
