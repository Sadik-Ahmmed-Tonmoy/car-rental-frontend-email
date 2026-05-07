import Image from "next/image";
import { Car, Users, MapPin, Shield } from "lucide-react";
import aboutImage from "@/assets/images/about.png";

export default function AboutUsSection() {
  return (
    <section className="py-16  ">
      <div className=" px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-blue-primary text-xl font-bold mb-8 md:mb-16">About Us</h2>

          <div className="flex items-center justify-center gap-2 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.3413 9.08231L16.6414 10.9576L15.115 13.5599L11.8149 11.6845V15.4353H8.76211V11.6845L5.46193 13.5599L3.93555 10.9576L7.2357 9.08231L3.93555 7.20692L5.46193 4.60473L8.76211 6.48012V2.72937H11.8149V6.48012L15.115 4.60475L16.6414 7.20696L13.3413 9.08231Z"
                fill="#02ACEE"
              />
            </svg>
            <span className="text-blue-primary text-base font-medium">
              Why Choose Us
            </span>
          </div>

          <h1 className="text-2xl md:text-5xl font-bold text-[#040401] leading-tight">
            Unmatched quality and service
            <br />
            for your needs
          </h1>
        </div>

        {/* Features Grid with Central Image */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Column Features */}
            <div className="space-y-12">
              {/* Extensive Options */}
              <div className="text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Extensive Options
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Choose from a diverse selection of vehicles to match your
                  preferences and budget.
                </p>
              </div>

              {/* Exceptional Customer Service */}
              <div className="text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Exceptional Customer Service
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Experience top-notch support every step of the way, from
                  choosing your car to after-sale.
                </p>
              </div>
            </div>

            {/* Central Image */}
            <div className="flex justify-center">
              <div className="relative w-80 h-64 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={aboutImage}
                  alt="Scenic coastal road with red car"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Column Features */}
            <div className="space-y-12">
              {/* Convenient Locations */}
              <div className="text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Convenient Locations
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Easily accessible locations to help you find your perfect car,
                  no matter where you are.
                </p>
              </div>

              {/* Reliability And Safety */}
              <div className="text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Reliability And Safety
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Drive with confidence, knowing that every vehicle meets the
                  highest standards of safety and reliability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
