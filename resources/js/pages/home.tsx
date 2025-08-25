import { Card, CardContent } from "@/components/ui/card";
import { RTInfo } from "@/interfaces";
import LandingLayout from "@/layouts/landing-layout";
import { Heart, Leaf, Shield, Users } from "lucide-react";

export default function HomePage() {

  const rtInfo: RTInfo = {
    name: 'RT 01 RW 23 Kemirisewu',
    address: 'Kemirisewu, Yogyakarta',
    description: 'Rukun Tetangga yang mengedepankan nilai-nilai kebersamaan, keamanan, dan kesejahteraan warga.',
    highlights: [],
    sections: {
      agamis: {
        id: 'agamis',
        title: 'Agamis',
        description: 'Membangun kehidupan beragama yang harmonis dengan kegiatan pengajian rutin, peringatan hari besar keagamaan, dan pembinaan akhlak mulia bagi seluruh warga RT.'
      },
      sehat: {
        id: 'sehat',
        title: 'Sehat',
        description: 'Menjaga kesehatan warga melalui program posyandu, senam pagi bersama, penyuluhan kesehatan, dan menjaga kebersihan lingkungan RT.'
      },
      indah: {
        id: 'indah',
        title: 'Indah',
        description: 'Menciptakan lingkungan yang asri dan indah dengan program penghijauan, penataan taman RT, dan gotong royong kebersihan lingkungan.'
      },
      aman: {
        id: 'aman',
        title: 'Aman',
        description: 'Menjamin keamanan dan ketertiban lingkungan melalui sistem ronda malam, CCTV, dan koordinasi dengan pihak keamanan setempat.'
      }
    }
  };

  const sectionIcons = {
    agamis: Heart,
    sehat: Shield,
    indah: Leaf,
    aman: Users
  };

  const sectionColors = {
    agamis: 'from-purple-500 to-pink-500',
    sehat: 'from-green-500 to-emerald-500',
    indah: 'from-blue-500 to-cyan-500',
    aman: 'from-orange-500 to-red-500'
  };


  return (
    <LandingLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-rt-primary via-rt-accent to-rt-primary  py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-rt-secondary/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold">RT</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {rtInfo.name}
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                {rtInfo.address}
              </p>
              <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                {rtInfo.description}
              </p>
            </div>
          </div>
        </section>

        {/* Sections */}
        {/* Banner Highlight */}
        <section className="py-16 bg-gradient-to-r from-rt-primary/10 via-rt-secondary/20 to-rt-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Kegiatan RT 01 RW 23 Kemirisewu"
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-rt-text mb-2">
                      Kegiatan Gotong Royong
                    </h3>
                    <p className="text-rt-text/70 text-sm">
                      Warga RT 01 RW 23 bergotong royong membersihkan lingkungan untuk menciptakan kampung yang bersih dan sehat.
                    </p>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="bg-rt-secondary/20 backdrop-blur-sm rounded-2xl p-8 border border-rt-secondary/30">
                  <h2 className="text-3xl md:text-4xl font-bold text-rt-text mb-6">
                    🏆 Prestasi Terbaru
                  </h2>
                  <div className="space-y-4">
                    {rtInfo.highlights.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-rt-text/70">Belum ada highlight yang ditambahkan</p>
                      </div>
                    ) : (
                      rtInfo.highlights.map((highlight) => (
                        <div key={highlight.id} className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl">
                          <div className="w-12 h-12 bg-gradient-to-br from-rt-primary to-rt-accent rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{highlight.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-rt-text">{highlight.title}</h4>
                            <p className="text-sm text-rt-text/70">{highlight.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="py-20 bg-rt-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-rt-text mb-4">
                Visi & Misi RT 01 RW 23
              </h2>
              <p className="text-lg text-rt-text/70 max-w-2xl mx-auto">
                Membangun lingkungan yang harmonis dengan mengedepankan empat pilar utama
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(rtInfo.sections).map(([key, section]) => {
                const IconComponent = sectionIcons[key as keyof typeof sectionIcons];
                const colorClass = sectionColors[key as keyof typeof sectionColors];

                return (
                  <Card key={section.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 " />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {section.title}
                      </h3>
                      <p className="text-rt-text/70 leading-relaxed">
                        {section.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-rt-primary mb-2">150+</div>
                <div className="text-rt-text/70">Kepala Keluarga</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-rt-accent mb-2">500+</div>
                <div className="text-rt-text/70">Total Warga</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-rt-primary mb-2">25+</div>
                <div className="text-rt-text/70">Program Kegiatan</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-rt-accent mb-2">10+</div>
                <div className="text-rt-text/70">Tahun Berdiri</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LandingLayout>
  );
}