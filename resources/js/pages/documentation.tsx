import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LandingFooterLayout from "@/layouts/landing/landing-footer-layout";
import LandingHeaderLayout from "@/layouts/landing/landing-header-layout";
import { usePage } from "@inertiajs/react";
import { Calendar, ExternalLink, FileText } from "lucide-react";

type Setting = { id: number; key: string; value: string };
type Props = { settings: Setting[] };
export default function DocumentationPage() {
  const { settings } = usePage<Props>().props;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return (
    <div>
      <LandingHeaderLayout settings={settings} />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-rt-primary/80 via-rt-accent/30 to-rt-primary/20 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-6 text-rt-secondary/80" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Dokumentasi
              </h1>
              <p className="text-xl max-w-2xl mx-auto">
                Kumpulan dokumen dan informasi penting RT 01 RW 23 Kemirisewu
              </p>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Belum Ada Dokumentasi
              </h3>
              <p className="text-gray-500">
                Dokumentasi akan ditampilkan di sini setelah ditambahkan oleh admin.
              </p>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Title
                    </span>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    Description
                  </p>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Ditambahkan: {formatDate("2023-01-01")}</span>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-rt-primary to-rt-accent hover:from-rt-accent hover:to-rt-primary"
                  >
                    <a
                      href={"https://ui.shadcn.com/docs/components/dialog"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2"
                    >
                      <span>Buka Dokumen</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <LandingFooterLayout settings={settings} />
    </div>
  );
}