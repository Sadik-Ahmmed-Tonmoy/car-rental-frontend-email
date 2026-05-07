import CarSearchFilter from "@/components/pages/home/CarSearchFilter/CarSearchFilter";
import OurCar from "@/components/ui/OurCar/OurCar";
import TestimonialsSection from "@/components/ui/testimonials-section";

const HomePage = () => {
  return (
    <>
      <CarSearchFilter />

      {/* <FilterArea/> */}
      {/* <FilterSection /> */}
      {/* <SwiperSliderComponent /> */}
      {/* <CarListView cars={sampleCarListings} /> */}
      <OurCar />
      <TestimonialsSection />
    </>
  );
};

export default HomePage;
