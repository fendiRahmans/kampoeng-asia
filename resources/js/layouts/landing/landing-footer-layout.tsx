import { Mail, MapPin, Phone } from "lucide-react";

export default function LandingFooterLayout() {
  return (
    <footer className="bg-rt-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/images/logo-kampoeng-asia.png"
                alt="Logo"
                className="w-15 h-15"
              />
              <div>
                <h3 className="text-lg font-bold">RT 01 RW 23</h3>
                <p className="text-gray-400 text-sm">Kemirisewu</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Rukun Tetangga yang mengedepankan nilai-nilai kebersamaan,
              keamanan, dan kesejahteraan warga.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-rt-secondary/80" />
                <span className="text-gray-400 text-sm">
                  Kemirisewu, Yogyakarta
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-rt-secondary/80" />
                <span className="text-gray-400 text-sm">
                  +62 812-3456-7890
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-rt-secondary/80" />
                <span className="text-gray-400 text-sm">
                  rt01rw23@kemirisewu.com
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Jam Pelayanan</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex justify-between">
                <span>Senin - Jumat</span>
                <span>08:00 - 16:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sabtu</span>
                <span>08:00 - 12:00</span>
              </div>
              <div className="flex justify-between">
                <span>Minggu</span>
                <span>Tutup</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} RT 01 RW 23 Kemirisewu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}