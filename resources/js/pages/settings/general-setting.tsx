import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'General Settings',
    href: '/general-settings',
  }
];

export default function GeneralSetting() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="General Settings" />
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">General Settings</h1>
          <Button>
            + Add New Setting
          </Button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>
      </div>
    </AppLayout>
  );
}
