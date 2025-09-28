import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Monitor, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
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

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Upload Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <Camera className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Design</h3>
            <p className="text-gray-600 mb-6">
              Scan the QR code at the museum kiosk to upload your hand-drawn design.
            </p>
            <Link href="/upload">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl">
                Start Upload
              </Button>
            </Link>
          </div>

          {/* Admin Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h3>
            <p className="text-gray-600 mb-6">
              Manage uploaded designs and curate selections for the slideshow display.
            </p>
            <Link href="/admin">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
                Admin Login
              </Button>
            </Link>
          </div>

          {/* Slideshow Section */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6">
              <Monitor className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">View Gallery</h3>
            <p className="text-gray-600 mb-6">
              Experience the curated collection of designs in our interactive slideshow.
            </p>
            <div className="space-y-2">
              <Link href="/slideshow/men" className="block">
                <Button variant="outline" className="w-full border-cyan-200 hover:bg-cyan-50 py-3 rounded-xl">
                  Men's Gallery
                </Button>
              </Link>
              <Link href="/slideshow/women" className="block">
                <Button variant="outline" className="w-full border-cyan-200 hover:bg-cyan-50 py-3 rounded-xl">
                  Women's Gallery
                </Button>
              </Link>
            </div>
          </div>
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