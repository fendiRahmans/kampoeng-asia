import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import LandingLayout from "@/layouts/landing-layout";
import { usePage } from "@inertiajs/react";
import Autoplay from "embla-carousel-autoplay";

type Setting = { id: number; key: string; value: string };
type Highlight = { id: number; title: string; description: string, image: string, pinned: boolean };
type Achievement = { id: number; title: string; description: string; points: string; icon?: string };
type VisionMission = { id: number; title: string; description: string; icon?: string, color?: string };
type Props = { settings: Setting[], highlights: Highlight[], achievements: Achievement[], visionMissions: VisionMission[] };
export default function HomePage() {

  const { settings, highlights, achievements, visionMissions } = usePage<Props>().props;

  const siteTitle = settings.find(s => s.key === 'site_title')?.value ?? 'Site Title';
  const siteAddress = settings.find(s => s.key === 'site_address')?.value ?? 'Site Address';
  const siteDescription = settings.find(s => s.key === 'site_description')?.value ?? 'Site Description';
  return (
    <LandingLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-rt-primary/80 via-rt-accent/30 to-rt-primary/20 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <img
                  src="/images/logo-kampoeng-asia.png"
                  alt="Logo"
                  className="w-xs h-w-xs"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {siteTitle}
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                {siteAddress}
              </p>
              <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                {siteDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Sections */}
        {/* Banner Highlight */}
        <section className="py-16 banner-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 rounded-2xl overflow-hidden">
                <Carousel
                  opts={{
                    loop: true,
                  }}
                  plugins={[
                    Autoplay({
                      delay: 2500,
                      stopOnInteraction: false,
                    })
                  ]}
                >
                  <CarouselContent>
                    {highlights.map((highlight) => (
                      <CarouselItem key={highlight.id}>
                        <div className="bg-white rounded-2xl overflow-hidden">
                          <img
                            src={highlight.image}
                            alt={highlight.title}
                            className="w-full h-64 lg:h-80 object-cover"
                          />
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-rt-text mb-2">
                              {highlight.title}
                            </h3>
                            <p className="text-rt-text/70 text-sm">
                              {highlight.description}
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                    {!highlights || highlights.length === 0 ? (
                      <CarouselItem>
                        <div className="bg-white rounded-2xl overflow-hidden">
                          <img
                            src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
                            alt="Kegiatan RT 01 RW 23 Kemirisewu"
                            className="w-full h-64 lg:h-80 object-cover"
                          />
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-rt-text mb-2">
                              Belum Ada Highlight
                            </h3>
                            <p className="text-rt-text/70 text-sm">
                              Saat ini belum ada highlight yang ditambahkan. Silakan cek kembali nanti.
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ) : null}
                  </CarouselContent>
                </Carousel>

              </div>

              <div className="order-1 lg:order-2">
                <div className="bg-rt-secondary/20 backdrop-blur-sm rounded-2xl p-8 border border-rt-secondary/30">
                  <h2 className="text-3xl md:text-4xl font-bold text-rt-text mb-6">
                    🏆 Prestasi Terbaru
                  </h2>
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-rt-primary to-rt-accent rounded-full flex items-center justify-center">
                          {achievement.icon ? (
                            <img src={`/storage/${achievement.icon}`} alt={achievement.title} className="w-8 h-8" />
                          ) :
                            <span className="text-white font-bold text-sm">{achievement.points}</span>
                          }
                        </div>
                        <div>
                          <h4 className="font-semibold text-rt-text">{achievement.title}</h4>
                          <p className="text-sm text-rt-text/70">{achievement.description}</p>
                        </div>
                      </div>
                    ))
                    }
                    {achievements.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-rt-text/70">Belum ada prestasi yang ditambahkan</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="py-20 bg-rt-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-rt-text dark:!text-white mb-4">
                Visi & Misi RT 01 RW 23
              </h2>
              <p className="text-lg text-rt-text/70 dark:!text-white max-w-2xl mx-auto">
                Membangun lingkungan yang harmonis dengan mengedepankan empat pilar utama
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {visionMissions && visionMissions.length > 0 ? visionMissions.map((section) => (
                <Card key={section.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <img src={section.icon ? `/storage/${section.icon}` : '/images/default-icon.png'} alt={section.title} className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:!text-white mb-4">
                      {section.title}
                    </h3>
                    <p className="text-rt-text/70 leading-relaxed dark:!text-white">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              )) :
                (
                  <Card className="col-span-1 md:col-span-2 lg:col-span-4">
                    <CardContent className="p-6 text-center">
                      <p className="text-rt-text/70 dark:!text-white">
                        Tidak ada visi/misi yang tersedia.
                      </p>
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-rt-primary mb-2">
                  {settings?.find(s => s.key === 'info_head_of_family')?.value ?? '0+'}
                </div>
                <div className="">Kepala Keluarga</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-rt-accent mb-2">
                  {settings?.find(s => s.key === 'info_total_population')?.value ?? '0+'}
                </div>
                <div className="">Total Warga</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-rt-primary mb-2">
                  {settings?.find(s => s.key === 'info_activity_program')?.value ?? '0+'}
                </div>
                <div className="">Program Kegiatan</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-rt-accent mb-2">
                  {settings?.find(s => s.key === 'info_established_since')?.value ?? '0+'}
                </div>
                <div className="">Tahun Berdiri</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LandingLayout>
  );
}