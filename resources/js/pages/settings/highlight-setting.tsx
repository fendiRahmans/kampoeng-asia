import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AlertDelete from "@/components/alert-delete";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";
import { toast } from "sonner";
import { Inertia } from "@inertiajs/inertia";

type Highlight = { id: number; title: string; description: string, image: string, pinned: boolean };
type Props = { highlights: Highlight[] };

export default function Highlight() {
  const { highlights } = usePage<Props>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Highlight Settings',
      href: '/highlight-settings',
    }
  ];

  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<Highlight | null>(null);

  const schema = z.object({
    title: z.string().min(2).max(255),
    description: z.string().optional(),
    image: z.any().optional(),
  })

  type Schema = z.infer<typeof schema>

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', image: undefined }
  })

  const { register, handleSubmit, formState, reset, setValue, watch } = form
  const { errors } = formState

  const watchedTitle = watch('title')

  const onClose = () => {
    setOpen(false)
    setSelected(null)
    reset()
  }

  const onSubmit = async (data: Schema) => {
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('title', data.title)
      if (data.description) formData.append('description', data.description)

      const fileList = data.image as FileList | undefined
      if (fileList && fileList.length > 0) {
        formData.append('image', fileList[0])
      }

      if (selected) {
        // use POST to update the resource
        formData.append('_method', 'PUT')
        const res = await axios.post(`/highlight-settings/${selected.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (res.status === 200) {
          toast.success('Highlight updated successfully.')
          onClose()
          Inertia.reload()
        }
      } else {
        const res = await axios.post('/highlight-settings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (res.status === 200) {
          toast.success('Highlight created successfully.')
          onClose()
          Inertia.reload()
        }
      }
    } catch (error) {
      toast.error('An error occurred while saving the highlight.')
    } finally {
      setIsLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post(`/highlight-settings/${selected?.id}`, { _method: 'DELETE' })
      if (res.status === 200) {
        toast.success('Highlight deleted successfully.')
        Inertia.reload()
      }
    } catch (error) {
      toast.error('An error occurred while deleting the highlight.')
    } finally {
      setIsLoading(false)
      setConfirm(false)
    }
  }

  const pinHighlight = async (h: Highlight) => {
    try {
      setIsLoading(true)
      // send the desired pinned state (toggle)
      const res = await axios.post(`/highlight-settings/${h.id}/pin`, { pinned: !h.pinned }, {
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.status === 200) {
        toast.success(!h.pinned ? 'Highlight pinned successfully.' : 'Highlight unpinned successfully.')
        Inertia.reload()
      }
    } catch (error) {
      toast.error('An error occurred while toggling the highlight pin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Highlight Settings" />
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Highlight Settings</h1>
          <Button onClick={() => { reset(); setSelected(null); setOpen(true); }}>
            + Add New Highlight
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {highlights?.map((h) => (
            <div key={h.id} className="border p-4 rounded-xl relative">
              <div className="h-32 w-full flex items-center justify-center overflow-hidden mb-3">
                {h.image ? (
                  <img src={`/storage/${h.image}`} alt={h.title} className="object-cover h-full w-full" />
                ) : (
                  <div className="text-sm text-muted-foreground">No image</div>
                )}
              </div>
              <h2 className="font-bold">{h.title}</h2>
              <p className="text-sm">{h.description}</p>
              <div className="flex space-x-2 mt-3">
                <Button onClick={() => {
                  reset()
                  setSelected(h)
                  setValue('title', h.title)
                  setValue('description', h.description)
                  // do not set file input for image (leave empty to keep existing)
                  setOpen(true)
                }}>Edit</Button>
                <Button variant="destructive" onClick={() => { setSelected(h); setConfirm(true); }}>Delete</Button>
                <Button variant={h.pinned ? "default" : "outline"} onClick={() => {
                  pinHighlight(h)
                }}>{h.pinned ? 'Unpin' : 'Pin to Top'}</Button>
              </div>
            </div>
          ))}
          {!highlights || highlights?.length === 0 ? (
            <div className="col-span-4 text-center text-sm text-muted-foreground h-60 flex items-center justify-center">
              <div>
                No highlights found.
              </div>
            </div>
          ) : null}
        </div>

        <Dialog open={open} onOpenChange={() => onClose()}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selected ? 'Edit Highlight' : 'Add Highlight'}</DialogTitle>
              <DialogDescription>{selected ? 'Edit the highlight' : 'Add a new highlight'}</DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)} className="py-3">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input {...register('title')} placeholder="Enter title" error={!!errors.title} msgError={errors.title?.message} />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>Description</Label>
                  <Textarea {...register('description')} placeholder="Enter description" error={!!errors.description} msgError={errors.description?.message} />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>Image</Label>
                  <Input type="file" accept="image/*" {...register('image')} />
                  {selected && selected.image && (
                    <div className="mt-2">
                      <p className="text-sm">Current image preview:</p>
                      <img src={`/storage/${selected.image}`} alt="highlight" className="h-24 mt-1 object-contain" />
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <Button type="submit" className="w-full mt-4" isLoading={isLoading}>{selected ? 'Save Changes' : 'Create Highlight'}</Button>
                </div>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <AlertDelete open={confirm} onOpenChange={setConfirm} handleDelete={onDelete} loading={isLoading} />
      </div>
    </AppLayout>
  )
}
