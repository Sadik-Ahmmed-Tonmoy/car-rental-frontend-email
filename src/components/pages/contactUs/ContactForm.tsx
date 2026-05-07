/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from "@/components/ui/buttons/button";
import MyFormInput from "@/components/ui/MyForm/MyFormInput/MyFormInput";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number must be at least 6 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm() {
  const handleSubmit = async (formData: any) => {
    // Handle form submission
    console.log("Form submitted:", formData);
    // You would typically send this data to your backend here
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Contact information</h3>
        <p className="text-gray-600 mb-2">Let us know about any site issues here</p>
        <a href="mailto:enquiries@cardicknl.com" className="text-blue-600 hover:underline">
          enquiries@cardicknl.com
        </a>
      </div>

      <MyFormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(contactSchema)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MyFormInput
            name="firstName"
            type="text"
            label="First name"
           
            labelClassName="text-gray-700 font-medium"
          />
          <MyFormInput
            name="lastName"
            type="text"
            label="Last name"
    
            labelClassName="text-gray-700 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MyFormInput
            name="email"
            type="email"
            label="Email"
    
            labelClassName="text-gray-700 font-medium"
          />
          <MyFormInput
            name="phone"
            type="tel"
            label="Phone"
   
            labelClassName="text-gray-700 font-medium"
          />
        </div>

        <MyFormInput
          name="message"
          type="textarea"
          label="Message"

          labelClassName="text-gray-700 font-medium"
 
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
          >
            Send Message
          </Button>
        </div>
      </MyFormWrapper>
    </div>
  );
}