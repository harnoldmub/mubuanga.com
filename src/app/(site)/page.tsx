import Builds from "@/components/home/Builds";
import ContactCta from "@/components/home/ContactCta";
import Figures from "@/components/home/Figures";
import Hero from "@/components/home/Hero";
import LabTeaser from "@/components/home/LabTeaser";
import Process from "@/components/home/Process";
import SelectedWork from "@/components/home/SelectedWork";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Builds />
      <SelectedWork />
      <Process />
      <LabTeaser />
      <Figures />
      <ContactCta />
    </>
  );
}
