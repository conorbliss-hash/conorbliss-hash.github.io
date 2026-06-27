import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import AboutSection from "@/components/portfolio/AboutSection";
import WritingSection from "@/components/portfolio/WritingSection";
import OpenSourceSection from "@/components/portfolio/OpenSourceSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <WritingSection />
        <OpenSourceSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
