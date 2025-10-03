import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Cultre Sulabh
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A digital collection platform where museum visitors can upload their hand-drawn designs 
            and showcase their creativity to the world.
          </p>
        </div>

        {/* Upload Design Card - Centered */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Camera className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Upload Design</h3>
            <p className="text-gray-600 mb-6 text-center">
              Scan the QR code at the museum kiosk to upload your hand-drawn design.
            </p>
            <Link href="/upload">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl">
                Start Upload
              </Button>
            </Link>
          </div>
        </div>

        {/* Admin CTA */}
        <div className="text-center">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
            Are you an Admin? <span className="underline">Click here</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Built with ❤️ for creative expression in museums
          </p>
        </div>
      </div>
    </div>
  );
}