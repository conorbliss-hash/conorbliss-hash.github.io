import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import DesignBetsSection from "@/components/portfolio/DesignBetsSection";
import AntiPortfolioSection from "@/components/portfolio/AntiPortfolioSection";
import WritingSection from "@/components/portfolio/WritingSection";
import Footer from "@/components/portfolio/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <DesignBetsSection />
        <AntiPortfolioSection />
        <WritingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
