import TestimonialSlider from "./TestimonialSlider";


export default function TestimonialsSection() {
  return (
    <>
      <div className="my-8 md:my-24">
        <p className="text-blue-primary text-lg font-semibold text-center ">
          Testimonials
        </p>
        <h4 className="font-bold text-xl md:text-[44px] text-center max-w-xl mx-auto">
          What our customers are saying about us
        </h4>

        <TestimonialSlider  />
      </div>
    </>
  );
}
