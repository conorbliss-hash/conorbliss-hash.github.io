import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import AboutSection from "@/components/portfolio/AboutSection";
import PrinciplesSection from "@/components/portfolio/PrinciplesSection";
import WritingSection from "@/components/portfolio/WritingSection";
import Footer from "@/components/portfolio/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <PrinciplesSection />
        <WritingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
