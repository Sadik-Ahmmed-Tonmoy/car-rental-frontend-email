import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/NavBar/navbar";
import { Container } from "@/components/ui-library/container";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <Container>
        <div className="h-full min-h-[calc(100vh-120px)]">{children}</div>
      </Container>
      <Footer />
    </>
  );
};

export default layout;
