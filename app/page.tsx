import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow/10 via-amber/10 to-navyblue/10 flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl md:text-6xl font-bold text-navyblue mb-3 md:mb-6">
            Cultre Sulabh
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
            A digital collection platform where museum visitors can upload their hand-drawn designs 
            and showcase their creativity to the world.
          </p>
        </div>

        {/* Upload Design Card - Centered */}
        <div className="max-w-md mx-auto mb-6 md:mb-12">
          <div className="bg-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-none">
            <div className="flex items-center justify-center mb-4 md:mb-6 mx-auto">
              <Camera className="w-12 h-12 md:w-16 md:h-16 text-amber" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-navyblue mb-3 md:mb-4 text-center">Upload Design</h3>
            <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6 text-center">
              Upload your hand-drawn design to the museum collection.
            </p>
            <Link href="/upload">
              <Button className="w-full bg-amber hover:bg-amber/90 text-white py-3 rounded-none shadow-lg">
                Start Upload
              </Button>
            </Link>
          </div>
        </div>

        {/* Admin CTA */}
        <div className="text-center mb-4">
          <Link href="/admin" className="text-gray-500 hover:text-navyblue transition-colors text-xs md:text-sm">
            Are you an Admin? <span className="underline">Click here</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 md:mt-16 pt-4 md:pt-8 border-t border-gray-200">
          <p className="text-xs md:text-sm text-gray-500">
            Built with ❤️ for creative expression in museums
          </p>
        </div>
      </div>
    </div>
  );
}