"use client";
import { Tally4 } from "lucide-react";

interface FilterSectionProps {
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
}

const FilterSection = ({ isGridView, setIsGridView }: FilterSectionProps) => {
  return (
    // <div className="flex items-center justify-end  bg-white mt-6 md:mb-12 md:mt-16 ">
    //   {/* Filter Buttons */}
    //   <div className=" items-center gap-3 flex-wrap hidden">
    //     <button className="flex items-center gap-2 px-4 py-2 border border-blue-primary text-blue-primary rounded-md  hover:border-blue-400 transition-colors cursor-pointer">
    //       <Plus size={16} className="text-blue-400" />
    //       <span>Make And Model</span>
    //     </button>

    //     <button className="flex items-center gap-2 px-4 py-2 border border-blue-primary text-blue-primary rounded-md  hover:border-blue-400 transition-colors cursor-pointer">
    //       <Plus size={16} className="text-blue-400" />
    //       <span>Price</span>
    //     </button>

    //     <button className="flex items-center gap-2 px-4 py-2 border border-blue-primary text-blue-primary rounded-md  hover:border-blue-400 transition-colors cursor-pointer">
    //       <Plus size={16} className="text-blue-400" />
    //       <span>Year</span>
    //     </button>

    //     <button className="flex items-center gap-2 px-4 py-2 border border-blue-primary text-blue-primary rounded-md  hover:border-blue-400 transition-colors cursor-pointer">
    //       <Plus size={16} className="text-blue-400" />
    //       <span>Mileage</span>
    //     </button>

    //     <button className="flex items-center gap-2 px-4 py-2 border border-blue-primary text-blue-primary rounded-md  hover:border-blue-400 transition-colors cursor-pointer">
    //       <Plus size={16} className="text-blue-400" />
    //       <span>Gearbox</span>
    //     </button>
    //   </div>

    //   {/* Right Side Controls */}
    //   <div className="flex items-center gap-3">
    //     {/* Menu/Hamburger Button */}
    //     <button
    //       onClick={() => setIsGridView(!isGridView)}
    //       className="p-2 border-blue-primary text-blue-primary hover:text-blue-600 transition-colors cursor-pointer"
    //     >
    //       {isGridView ? (
    //         <Tally4 size={28} className="text-blue-400 " />
    //       ) : (
    //         <Tally4 size={28} className="text-blue-400 rotate-90" />
    //       )}
    //     </button>

    //     {/* Filter and Sort Button */}
    //     <button className="flex items-center gap-2 px-6 py-2 bg-blue-primary  text-white rounded-md hover:bg-blue-400 transition-colors cursor-pointer">
    //       <svg
    //         width="16"
    //         height="16"
    //         viewBox="0 0 24 24"
    //         fill="none"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path d="M3 7H21L19 9H5L3 7Z" fill="currentColor" />
    //         <path d="M5 9V17H7V9H5Z" fill="currentColor" />
    //         <path d="M17 9V17H19V9H17Z" fill="currentColor" />
    //         <path d="M9 11V19H11V11H9Z" fill="currentColor" />
    //         <path d="M13 11V19H15V11H13Z" fill="currentColor" />
    //       </svg>
    //       <span>Filter and Sort</span>
    //     </button>
    //   </div>
    // </div>
    <button
      onClick={() => setIsGridView(!isGridView)}
      className="p-2 border-blue-primary text-blue-primary hover:text-blue-600 transition-colors cursor-pointer"
    >
      {isGridView ? (
        <Tally4 size={28} className="text-blue-400 " />
      ) : (
        <Tally4 size={28} className="text-blue-400 rotate-90" />
      )}
    </button>
  );
};

export default FilterSection;
