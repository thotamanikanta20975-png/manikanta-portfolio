"use client";
import { SmoothScroll } from "@/lib/scroll";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import Contact from "./sections/Contact";
import RevealObserver from "./ui/RevealObserver";

// Certifications and Achievements sections are omitted: no data was provided for them.
export default function App() {
  return (
    <SmoothScroll>
      <a className="skip" href="#main">Skip to content</a>
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Contact />
      </main>
      <RevealObserver />
    </SmoothScroll>
  );
}
