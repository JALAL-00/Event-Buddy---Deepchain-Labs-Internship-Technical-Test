// src/app/page.tsx

import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/shared/Hero";
import EventList from "@/components/shared/EventList";
import Footer from "@/components/shared/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <EventList title="Upcoming Events" />
        <EventList title="Previous Events" />
      </main>
      <Footer />
    </>
  );
}