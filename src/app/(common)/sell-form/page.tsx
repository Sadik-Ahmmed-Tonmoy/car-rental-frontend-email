import CreateListingForm from "@/components/ui/create-listing-form";
import React from "react";

const SellFormPage = () => {
  return (
    <main className="min-h-screen  py-5 sm:py-16">
      <div className="max-w-4xl mx-auto sm:px-4">
        <CreateListingForm />
      </div>
    </main>
  );
};

export default SellFormPage;
