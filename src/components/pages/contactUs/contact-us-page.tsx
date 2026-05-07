/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import MyFormInput from "@/components/ui/MyForm/MyFormInput/MyFormInput";
import MyFormTextArea from "@/components/ui/MyForm/MyFormTextArea/MyFormTextArea";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Linkedin, Mail, Phone } from "lucide-react";
import contactDesign from "@/assets/images/contact-design.png";
import { z } from "zod";
import Image from "next/image";
import { useCreateContactMutation } from "@/redux/features/contactUs/contactUsApi";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";

const validationSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required",
    })
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(2, "Last name must be at least 2 characters"),

  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),
  phone: z
    .string({
      required_error: "Mobile number is required",
    })
    .min(6, "Mobile number must be at least 6 characters"),
  message: z
    .string({
      required_error: "Message is required",
    })
    .min(10, "Message must be at least 10 characters"),
});

export default function ContactUsPageComponent() {
  const [createContactMutation] = useCreateContactMutation(); 
   
  const handleSubmit = async (formData: any, reset: any) => {
    const response = await handleAsyncWithToast(async () => {
      return createContactMutation(formData);
    });
    if (response?.data?.success) {
      reset(); 
    }
  };

  return (
    <div className=" my-10 sm:my-16 ">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-xl font-bold text-blue-primary mb-8">
            Contact Us
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto md:border border-gray-200 rounded-3xl md:p-8  relative overflow-hidden ">
          <div className="hidden lg:block absolute bottom-0 right-0 w-36 h-full z-10">
            <Image
              src={contactDesign}
              alt="Contact Design"
             
              width={500}
              height={500}
              layout="responsive"
              loading="eager"
              placeholder="blur"
              unoptimized={true}
              className="hidden lg:block absolute bottom-0 right-0 w-36 h-full z-10"
            />
          </div>
          {/* Left Side - Contact Information */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-gradient-to-br from-blue-primary to-blue-primary rounded-3xl p-8 text-white max-w-sm w-full relative z-0">
              <h2 className="text-2xl font-bold mb-4">
                Contact
                <br />
                information
              </h2>
              <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                Let us know about any site issues here
              </p>

              {/* Email */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm z-30">enquires@carclickni.com</span>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-4 z-30">
                <button
                  onClick={() => window.open("tel:+1234567890", "_blank")}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-30 cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-30 cursor-pointer">
                  <Mail className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-30 cursor-pointer">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-30 cursor-pointer">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
              <div className=" absolute bottom-0 right-0 z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="234"
                  height="246"
                  viewBox="0 0 234 246"
                  fill="none"
                >
                  <g clip-path="url(#clip0_282_12342)">
                    <path
                      d="M162.703 295.832C236.985 295.832 297.203 235.614 297.203 161.332C297.203 87.0497 236.985 26.832 162.703 26.832C88.4208 26.832 28.2031 87.0497 28.2031 161.332C28.2031 235.614 88.4208 295.832 162.703 295.832Z"
                      fill="white"
                      fill-opacity="0.12"
                    />
                    <path
                      d="M69.2031 138.832C107.311 138.832 138.203 107.94 138.203 69.8319C138.203 31.7243 107.311 0.831909 69.2031 0.831909C31.0955 0.831909 0.203125 31.7243 0.203125 69.8319C0.203125 107.94 31.0955 138.832 69.2031 138.832Z"
                      fill="white"
                      fill-opacity="0.13"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_282_12342">
                      <rect
                        width="234"
                        height="245"
                        fill="white"
                        transform="translate(0 0.160034)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-">
              <MyFormWrapper
                onSubmit={handleSubmit}
                resolver={zodResolver(validationSchema)}
                className="space-y-6"
              >
                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                  <MyFormInput
                    name="firstName"
                    type="text"
                    label="First name"
                    labelClassName="text-[#000] font-dm-sans text-base font-medium mb-1"
                  />
                  <MyFormInput
                    name="lastName"
                    type="text"
                    label="Last name"
                    labelClassName="text-[#000] font-dm-sans text-base font-medium mb-1"
                  />
                  <MyFormInput
                    name="email"
                    type="email"
                    label="Email"
                    labelClassName="text-[#000] font-dm-sans text-base font-medium mb-1"
                  />
                  <MyFormInput
                    name="phone"
                    type="text"
                    label="Mobile Number"
                    labelClassName="text-[#000] font-dm-sans text-base font-medium mb-1"
                  />
                  <div className="col-span-1 sm:col-span-2 ">
                    <MyFormTextArea
                      name="message"
                      label="Message"
                      labelClassName="text-[#000] font-dm-sans text-base font-medium mb-0 w-full"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="bg-blue-primary hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-4xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Send Message
                  </button>
                </div>
              </MyFormWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
