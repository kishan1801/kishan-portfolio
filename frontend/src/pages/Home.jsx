import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import AIArchitecture from "@/components/AIArchitecture";
import Timeline from "@/components/Timeline";
import Journal from "@/components/Journal";
import ResumeSection from "@/components/ResumeSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Home = () => {
  useEffect(() => {
    document.title = "Kishan Kumar — Full-Stack Developer | MERN & Backend";
  }, []);

  return (
    <div data-testid="home-page">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <AIArchitecture />
        <Timeline />
        <Journal />
        <ResumeSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
