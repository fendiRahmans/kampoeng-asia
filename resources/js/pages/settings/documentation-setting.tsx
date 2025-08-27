import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AlertDelete from "@/components/alert-delete";
import Pagination from "@/components/ui/pagination";
import axios from "axios";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Documentation Settings',
    href: '/documentation-settings',
  }
];

type Documentation = { id: number; title: string; description: string; link: string };
type PaginationData = {
  current_page: number;
  data: Documentation[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};
type Props = { documentations: PaginationData };

export default function DocumentationSetting() {
  const { documentations } = usePage<Props>().props;
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocumentation, setSelectedDocumentation] = useState<Documentation | null>(null);

  const schema = z.object({
    title: z.string().min(2).max(255),
    description: z.string().min(1),
    link: z.string().url(),
  })

  type Schema = z.infer<typeof schema>

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', link: '' }
  })

  const { register, handleSubmit, formState, reset } = form

  const { errors } = formState

  const onSubmit = async (data: Schema) => {
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('link', data.link)

      if (selectedDocumentation) {
        // For Laravel PUT via POST, include _method in FormData
        formData.append('_method', 'PUT')

        const res = await axios.post(`/documentation-settings/${selectedDocumentation.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (res.status === 200) {
          toast.success("Documentation updated successfully.")
          onClose()
          Inertia.reload()
        }
      } else {
        const res = await axios.post('/documentation-settings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (res.status === 200) {
          toast.success("Documentation created successfully.")
          onClose()
          Inertia.reload()
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving the documentation.")
    } finally {
      setIsLoading(false)
    }
  }

  const onClose = () => {
    setOpen(false)
    setSelectedDocumentation(null)
    reset()
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post(`/documentation-settings/${selectedDocumentation?.id}`, {
        _method: 'DELETE'
      })
      if (res.status === 200) {
        toast.success("Documentation deleted successfully.")
        Inertia.reload()
      }
    } catch (error) {
      toast.error("An error occurred while deleting the documentation.")
    } finally {
      setIsLoading(false)
      setConfirm(false)
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Documentation Settings" />
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Documentation Settings</h1>
          <Button onClick={() => setOpen(true)}>
            + Add New Documentation
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentations?.data?.map((documentation) => (
              <TableRow key={documentation.id}>
                <TableCell>{documentation.title}</TableCell>
                <TableCell>{documentation.description}</TableCell>
                <TableCell>
                  <a href={documentation.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {documentation.link}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        reset()
                        setSelectedDocumentation(documentation)
                        form.setValue("title", documentation.title)
                        form.setValue("description", documentation.description)
                        form.setValue("link", documentation.link)
                        setOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedDocumentation(documentation)
                        setConfirm(true)
                      }}
                    >Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {
              !documentations?.data || documentations.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No documentation found.
                  </TableCell>
                </TableRow>
              ) : null
            }
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination data={documentations} />

        <Dialog open={open} onOpenChange={() => onClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedDocumentation ? "Edit Documentation" : "Add Documentation"}
              </DialogTitle>
              <DialogDescription>
                {selectedDocumentation ? "Edit the documentation" : "Add a new documentation"}
              </DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2 py-3">
                  <Label>
                    Title
                  </Label>
                  <Input
                    {...register("title")}
                    placeholder="Enter title"
                    error={!!errors.title}
                    msgError={errors.title?.message}
                  />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>
                    Description
                  </Label>
                  <Textarea
                    {...register("description")}
                    placeholder="Enter description"
                    error={!!errors.description}
                    msgError={errors.description?.message}
                  />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>
                    Link
                  </Label>
                  <Input
                    {...register("link")}
                    placeholder="Enter link (URL)"
                    error={!!errors.link}
                    msgError={errors.link?.message}
                  />
                </div>
                <div className="w-full">
                  <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                    {selectedDocumentation ? "Save Changes" : "Create Documentation"}
                  </Button>
                </div>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <AlertDelete
          open={confirm}
          onOpenChange={setConfirm}
          handleDelete={onDelete}
          loading={isLoading}
        />
      </div>
    </AppLayout>
  );
}
