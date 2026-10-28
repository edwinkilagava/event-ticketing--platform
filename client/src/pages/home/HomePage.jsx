
import HeroSection from "../../components/home/HeroSection.jsx";
import RecentEventsSection from "../../components/home/RecentEventsSection.jsx";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#080f20] text-white">
   

      <main>
        <HeroSection />
        <RecentEventsSection />
      </main>

      
    </div>
  );
}

export default HomePage;