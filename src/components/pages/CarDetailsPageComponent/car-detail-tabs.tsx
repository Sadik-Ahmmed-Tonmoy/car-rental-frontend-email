// {
//         "id": "687208bb48d865d63a159cec",
//         "registrationNumber": "AA19AAA",
//         "vrm": "N1RAU",
//         "vinLast5": "21269",
//         "make": "MERCEDES-BENZ",
//         "model": "CLA 180 AMG LINE AUTO",
//         "bodyType": "COUPE",
//         "fuelType": "PETROL",
//         "dateRegistered": "2019-07-19T00:00:00.000Z",
//         "co2": 126,
//         "color": "WHITE",
//         "seats": 5,
//         "grossWeightKg": 1945,
//         "massInServiceKg": 1410,
//         "currentMilage": "14000",
//         "images": [
//             "https://smartcdn.gprod.postmedia.digital/driving/wp-content/uploads/2023/09/2024-Mercedes-Benz-CLE-mouzourispic014.jpg",
//             "https://i.ytimg.com/vi/MLjY_OQYvYE/maxresdefault.jpg",
//             "https://content.api.news/v3/images/bin/7bd7e8fa2cad26703d343a6806b8871c",
//             "https://www.topgear.com/sites/default/files/2024/01/16-Mercedes-CLE-Coupe-review.jpg"
//         ],
//         "description": "this is description",
//         "dvlaArtEndDate": "2025-03-30T00:00:00.000Z",
//         "dvlaCo2Emissions": 300,
//         "dvlaEngineCapacity": 2000,
//         "dvlaEuroStatus": "EURO1",
//         "dvlaMarkedForExport": false,
//         "dvlaMotStatus": "No details held by DVLA",
//         "dvlaRevenueWeight": 0,
//         "dvlaTypeApproval": "M1",
//         "dvlaYearOfManufacture": 2019,
//         "dvlaTaxDueDate": "2026-07-12T00:00:00.000Z",
//         "dvlaTaxStatus": "Taxed",
//         "dvlaDateOfLastV5CIssued": "2019-05-20T00:00:00.000Z",
//         "dvlaWheelplan": "2 AXLE RIGID BODY",
//         "dvlaMonthOfFirstDvlaRegistration": "2019-03",
//         "dvlaMonthOfFirstRegistration": "2019-03",
//         "dvlaRealDrivingEmissions": "1",
//         "range": "CLA",
//         "variant": "CLA 180 AMG Line",
//         "series": "C118",
//         "bodyStyle": "Coupe",
//         "wheelbaseType": "Short Wheelbase",
//         "doors": 4,
//         "heightMm": 1439,
//         "lengthMm": 4688,
//         "widthMm": 1830,
//         "kerbWeightKg": 1410,
//         "powerKw": null,
//         "torqueNm": null,
//         "euroStatus": "6d-temp",
//         "transmission": "Automatic",
//         "yearFrom": 2019,
//         "yearTo": 2019,
//         "minPrice": 1000,
//         "maxPrice": 2000,
//         "sellerType": "private",
//         "vehicleType": "car",
//         "maxMiles": 10000,
//         "engineSize": "2000",
//         "manufactureYear": 2019,
//         "brandId": "687208b748d865d63a159ce8",
//         "vehicleModelId": "687208b848d865d63a159ce9",
//         "vehicleVariantId": "687208ba48d865d63a159ceb",
//         "vehicleEngineCapacityId": "687208b948d865d63a159cea",
//         "userId": "686cb4bf8948702e792f93fc",
//         "createdAt": "2025-07-12T07:03:23.121Z",
//         "updatedAt": "2025-07-15T06:09:58.822Z",
//         "user": {
//             "id": "686cb4bf8948702e792f93fc",
//             "email": "vonije4108@fuasha.com",
//             "firstName": "sadik",
//             "lastName": "ahmed",
//             "phoneNumber": "+1234567890"
//         }
//     }

"use client";

import { cn } from "@/lib/utils";
import { useGetSingleVehicleQuery } from "@/redux/features/vehicle/vehicleApi";
import { ChevronDown, ChevronRight } from "lucide-react";
import moment from "moment";
import { useParams } from "next/navigation";
import { useState } from "react";

interface CarDetailTabsProps {
  className?: string;
}

export default function CarDetailTabs({ className = "" }: CarDetailTabsProps) {
  const params = useParams();
  const id = params?.id as string;
  const { isLoading, data: getSingleVehicleQuery } = useGetSingleVehicleQuery(
    id,
    {
      skip: !id,
    }
  );
  const carData = getSingleVehicleQuery?.data;

  console.log(carData);

  const [activeTab, setActiveTab] = useState("description");
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(
    new Set()
  );
  const [allExpanded, setAllExpanded] = useState(false);

  const descriptionData = [
    {
      label: "Year of Registration",
      value: moment(carData?.dateRegistered).format("MMMM YYYY") || "Unknown",
    },
    { label: "Mileage", value: `${carData?.currentMilage} Miles` },
    { label: "Location", value: carData?.address || "Unknown" },
    { label: "Color", value: carData?.color || "Unknown" },
    { label: "Engine Size", value: `${carData?.engineSize} L` },
    { label: "Seats", value: carData?.seats || "Unknown" },
    { label: "Body style", value: carData?.bodyType || "Unknown" },
    { label: "CO2 Emission", value: `${carData?.co2} g/km` },
  ];

  const featuresData = {
    "Engine/Transmission": [
      `Transmission: ${carData?.transmission}`,
      ,
      `Engine Size: ${carData?.engineSize} cc`,
      `Engine Power: ${carData?.powerKw} kW`,
      `Torque: ${carData?.torqueNm} Nm`,
      `Fuel Type: ${carData?.fuelType}`,
      `Euro Status: ${carData?.euroStatus}`,
      `Mass in Service: ${carData?.massInServiceKg} kg`,
    ],
    "Exterior Features": [
      `Color: ${carData?.color}`,
      `Body Type: ${carData?.bodyType}`,
      `Doors: ${carData?.doors}`,
      `Height: ${carData?.heightMm} mm`,
      `Length: ${carData?.lengthMm} mm`,
      `Width: ${carData?.widthMm} mm`,
      `Wheelbase Type: ${carData?.wheelbaseType}`,

      `Gross Weight: ${carData?.grossWeightKg} kg`,
      `Kerb Weight: ${carData?.kerbWeightKg} kg`,
      `VIN Last 5: ${carData?.vinLast5}`,
      `Registration Number: ${carData?.registrationNumber}`,
      `VRM: ${carData?.vrm}`,
    ],
    "Interior Features": [
      `Seats: ${carData?.seats}`,
      `Body Style: ${carData?.bodyStyle || "Unknown"}`,
      `Range: ${carData?.range || "Unknown"}`,
      `Variant: ${carData?.variant || "Unknown"}`,
      `Series: ${carData?.series || "Unknown"}`,
      `Manufacture Year: ${carData?.manufactureYear || "Unknown"}`,
    ],
    // Safety: [
    //  `Airbags: ${carData?.safety?.airbags || "Unknown"}`,
    //   `Blind Spot Monitoring: ${carData?.safety?.blindSpotMonitoring || "Unknown"}`,
    //   `Lane Departure Warning: ${carData?.safety?.laneDepartureWarning || "Unknown"}`,
    //   `Forward Collision Warning: ${carData?.safety?.forwardCollisionWarning || "Unknown"}`,
    //   `Automatic Emergency Braking: ${carData?.safety?.automaticEmergencyBraking || "Unknown"}`,
    //   `Rear Cross Traffic Alert: ${carData?.safety?.rearCrossTrafficAlert || "Unknown"}`,
    //   `Parking Sensors: ${carData?.safety?.parkingSensors || "Unknown"}`,
    //   `Backup Camera: ${carData?.safety?.backupCamera || "Unknown"}`,
    //   `Tire Pressure Monitoring: ${carData?.safety?.tirePressureMonitoring || "Unknown"}`,
    // ],
    // Security: [
    //   `Remote Keyless Entry: ${carData?.security?.remoteKeylessEntry || "Unknown"}`,
    //   `Push Button Start: ${carData?.security?.pushButtonStart || "Unknown"}`,
    //   `Immobilizer: ${carData?.security?.immobilizer || "Unknown"}`,
    //   `Car Alarm System: ${carData?.security?.carAlarmSystem || "Unknown"}`,
    //   `Central Locking: ${carData?.security?.centralLocking || "Unknown"}`,
    //   `Child Safety Locks: ${carData?.security?.childSafetyLocks || "Unknown"}`,
    //   `Auto Door Lock: ${carData?.security?.autoDoorLock || "Unknown"}`,
    //   `Panic Button: ${carData?.security?.panicButton || "Unknown"}`,
    //   // "Remote Keyless Entry",
    //   // "Push Button Start",
    //   // "Immobilizer",
    //   // "Car Alarm System",
    //   // "Central Locking",
    //   // "Child Safety Locks",
    //   // "Auto Door Lock",
    //   // "Panic Button"
    // ],
    Wheels: [
      `Wheelbase Type: ${carData?.wheelbaseType || "Unknown"}`,

      // '18-inch Alloy Wheels',
      // 'Run-flat Tires',
      // 'Tire Pressure Monitoring System',
      // 'Spare Tire',
      // 'Wheel Locks',
      // 'Chrome Wheel Trim'
    ],
  };

  const keyInfoData = [
    { label: "Make", value: carData?.make || "Unknown" },
    { label: "Model", value: carData?.model || "Unknown" },
    { label: "Body Type", value: carData?.bodyType || "Unknown" },
    { label: "Fuel Type", value: carData?.fuelType || "Unknown" },
    { label: "Transmission", value: carData?.transmission || "Unknown" },
    { label: "Year of Manufacture", value: carData?.yearFrom || "Unknown" },
    { label: "Mileage", value: `${carData?.currentMilage} Miles` },
    { label: "Color", value: carData?.color || "Unknown" },
    { label: "Seats", value: carData?.seats || "Unknown" },
    { label: "CO2 Emission", value: `${carData?.co2} g/km` },
    // { label: "Engine Size", value: `${carData?.engineSize} L` },
    // { label: "Trim", value: "Trim" },
    // { label: "Engine Size", value: "1997 cc" },
    // { label: "Engine Power", value: "138 bhp" },
    // { label: "Acceleration", value: "9.2 seconds" },
    // { label: "Top Speed", value: "130 mph" },
    // { label: "Fuel consumption - Urban", value: "37.2 mpg" },
    // { label: "Fuel consumption - Extra Urban", value: "145 g/km" },
    // { label: "Fuel Tank Capacity", value: "70 Liters" },
    // { label: "Co2 Emission", value: "155 g/km" },
    // { label: "Insurance Group", value: "20E" },
  ];

  const engineData = [
    { label: "Engine Capacity", value: `${carData?.dvlaEngineCapacity} cc` },
    { label: "Euro Status", value: carData?.dvlaEuroStatus || "Unknown" },
    { label: "Engine Power", value: `${carData?.powerKw} kW` },
    { label: "Torque", value: `${carData?.torqueNm} Nm` },
    { label: "Fuel Type", value: carData?.fuelType || "Unknown" },
    { label: "Transmission", value: carData?.transmission || "Unknown" },
    { label: "Mass in Service", value: `${carData?.massInServiceKg} kg` },
    { label: "Gross Weight", value: `${carData?.grossWeightKg} kg` },
    { label: "Kerb Weight", value: `${carData?.kerbWeightKg} kg` },
    { label: "CO2 Emission", value: `${carData?.co2} g/km` },
    { label: "Engine Size", value: `${carData?.engineSize} L` },

    // { label: "Insurance Group", value: "MANUAL" },
    // { label: "Number of Gears", value: "6 SPEED" },
    // { label: "Engine Torque - Lb/Ft", value: "236.8 Lb/Ft" },
    // { label: "Engine Torque - NM", value: "320 NM" },
    // { label: "Engine Power - RPM", value: "4000 RPM" },
    // { label: "Engine Power - PS", value: "140 PS" },
    // { label: "Fuel Delivery", value: "COMMON RAIL" },
    // { label: "Engine Layout", value: "FRONT TRANSVERSE" },
    // { label: "Cylinder Layout", value: "IN-LINE" },
    // { label: "Number of Cylinders", value: "4" },
    // { label: "Number of Valves", value: "16" },
    // { label: "Cylinders - Bore", value: "85 mm" },
    // { label: "Cylinders - Stroke", value: "88 mm" },
    // { label: "Camshaft", value: "DOHC" },
    // { label: "Vehicle Homologation Class", value: "M1" },
    // { label: "Standard Euro Emissions (1-6)", value: "EURO 4" },
  ];

  // const warrantyData = [
  //   { label: "Standard manufacturers warranty - Years", value: "3 years" },
  //   {
  //     label: "Standard manufacturers warranty - Mileage",
  //     value: "60000 miles",
  //   },
  //   { label: "Manufacturers Paintwork Guarantee - Years", value: "1 years" },
  //   { label: "Man Corrosion Perforation Guarantee - Years", value: "6 years" },
  // ];

  const toggleFeature = (featureName: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureName)) {
      newExpanded.delete(featureName);
    } else {
      newExpanded.add(featureName);
    }
    setExpandedFeatures(newExpanded);

    // Update allExpanded state
    setAllExpanded(newExpanded.size === Object.keys(featuresData).length);
  };

  const toggleExpandAll = () => {
    if (allExpanded) {
      // Collapse all
      setExpandedFeatures(new Set());
      setAllExpanded(false);
    } else {
      // Expand all
      setExpandedFeatures(new Set(Object.keys(featuresData)));
      setAllExpanded(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!getSingleVehicleQuery) {
    return <div className="text-center text-red-500">Vehicle not found</div>;
  }

  return (
    <div className={`bg-white mb-6 md:mb-28 ${className} `}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "description"
                ? "text-blue-500 border-blue-500"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specification")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "specification"
                ? "text-blue-500 border-blue-500"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Specification
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === "description" && (
          <div className="space-y-6">
            {/* Description Text */}
            <div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {/* July 2024 Citroen Ami 6kW 5.5kWh 2dr Auto. Warranted 400 miles
                from new, July 2028 MOT. As new condition. For any enquiries
                Call or WhatsApp 07518265198. €5250 */}
                {carData?.description ||
                  "No description available for this vehicle."}
              </p>
            </div>

            {/* Specifications Table */}
            <div className="">
              {descriptionData.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex justify-between py-3 border-b border-gray-300 md:px-2",
                    index % 2 === 0 ? "bg-gray-100" : ""
                  )}
                >
                  <span className="text-gray-600 text-sm">{item.label}</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Features Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Features
                </h3>
                <button
                  onClick={toggleExpandAll}
                  className="text-blue-primary text-sm hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {allExpanded ? "Collapse All" : "Expand All"}
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(featuresData).map(
                  ([featureName, featureItems]) => {
                    const isExpanded = expandedFeatures.has(featureName);
                    return (
                      <div
                        key={featureName}
                        className=" border-b border-gray-300"
                      >
                        <button
                          onClick={() => toggleFeature(featureName)}
                          className="w-full flex justify-between items-center py-3  hover:bg-gray-50 transition-colors  cursor-pointer"
                        >
                          <span className="text-blue-primary text-sm font-medium">
                            {featureName}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400 transition-transform" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                              {featureItems.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center py-1"
                                >
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                                  <span className="text-gray-700 text-sm ">
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "specification" && (
          <div className="space-y-8">
            {/* Description Text */}
            <div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {carData?.description ||
                  "No description available for this vehicle."}
              </p>
            </div>

            {/* Key Info Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb- text-center pb-3 border-b border-gray-300">
                Key Info
              </h3>
              <div className="">
                {keyInfoData.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex justify-between py-3 border-b border-gray-300 md:px-2",
                      index % 2 === 0 ? "bg-gray-100" : ""
                    )}
                  >
                    <span className="text-gray-600 text-sm">{item.label}</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engine Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900  pb-3 text-center border-b border-gray-300">
                Engine
              </h3>
              <div className="">
                {engineData.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex justify-between py-3 border-b border-gray-300 md:px-2",
                      index % 2 === 0 ? "bg-gray-100" : ""
                    )}
                  >
                    <span className="text-gray-600 text-sm">{item.label}</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warranty and Servicing Section */}
            {/* <div>
              <h3 className="text-lg font-semibold text-gray-900  pb-3 text-center border-b border-gray-300">
                Warranty and Servicing
              </h3>
              <div className="">
                {warrantyData.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex justify-between py-3 border-b border-gray-300",
                      index % 2 === 0 ? "bg-gray-100" : ""
                    )}
                  >
                    <span className="text-gray-600 text-sm">{item.label}</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}
