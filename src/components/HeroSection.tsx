import HeroImage from "../assets/Hero.jpeg";
import SplitText from "@/components/ui/split-text";

export default function HeroSection() {
  return (
    <div className="pt-32 text-black px-6 sm:px-16 flex flex-col-reverse md:flex-row items-center justify-center gap-12 md:gap-8">
      {/* Text Section */}
      <div className="max-w-xl text-center md:text-left">
        <SplitText 
          className="text-5xl font-bold"
          text="Haniel Thomson"
          delay={50}
          duration={0.5}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
        />
        <p className="mt-6 text-lg">
          A passionate software developer with a knack for creating elegant solutions
          to complex problems. Skilled in JavaScript, React, and Node.js, with a strong
          foundation in computer science principles.
        </p>
      </div>

      {/* Image Section */}
      <div className="flex justify-center mb-8 md:mb-0">
        <img
          src={HeroImage}
          alt="Hero Banner"
          className="w-64 h-64 rounded-full object-cover shadow-lg"
        />
      </div>
    </div>
  )
}
