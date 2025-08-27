import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AlertDelete from "@/components/alert-delete";
import axios from "axios";
import { toast } from "sonner";
import { Inertia } from "@inertiajs/inertia";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Vision & Mission Settings',
    href: '/vision-mission-settings',
  }
];

type VisionMission = { id: number; title: string; description: string; icon?: string, color?: string };
type Props = { visionMissions: VisionMission[] };

export default function VisionMissionSetting() {
  const { visionMissions } = usePage<Props>().props;
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<VisionMission | null>(null);

  const schema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().min(1),
    icon: z.any().optional(),
    color: z.string().min(1).max(255).optional()
  })

  type Schema = z.infer<typeof schema>

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const { register, handleSubmit, formState, reset, setValue, watch } = form
  const { errors } = formState

  const onSubmit = async (data: Schema) => {
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      const fileList = data.icon as FileList | undefined

      if (fileList && fileList.length > 0) {
        formData.append('icon', fileList[0])
      }

      if (data.color) {
        formData.append('color', data.color)
      }

      if (selected) {
        formData.append('_method', 'PUT')
        const res = await axios.post(`/vision-mission-settings/${selected.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (res.status === 200) {
          toast.success('Vision/Mission updated successfully.')
          onClose()
          Inertia.reload()
        }
      } else {
        const res = await axios.post('/vision-mission-settings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (res.status === 200) {
          toast.success('Vision/Mission created successfully.')
          onClose()
          Inertia.reload()
        }
      }
    } catch (error) {
      toast.error('An error occurred while saving.')
    } finally {
      setIsLoading(false)
    }
  }

  const onClose = () => {
    setOpen(false)
    setSelected(null)
    reset()
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post(`/vision-mission-settings/${selected?.id}`, {
        _method: 'DELETE'
      })
      if (res.status === 200) {
        toast.success('Vision/Mission deleted successfully.')
        Inertia.reload()
      }
    } catch (error) {
      toast.error('An error occurred while deleting.')
    } finally {
      setIsLoading(false)
      setConfirm(false)
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Vision & Mission Settings" />
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Vision & Mission</h1>
          <Button onClick={() => setOpen(true)}>+ Add Vision/Mission</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visionMissions?.map((vm) => (
              <TableRow key={vm.id}>
                <TableCell>{vm.title}</TableCell>
                <TableCell className="max-w-xl break-words whitespace-pre-wrap">
                  {vm.description}
                </TableCell>
                <TableCell>
                  {vm.icon ? (
                    <img src={`/storage/${vm.icon}`} alt={vm.title} className="h-10" />
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {vm.color ? (
                    <div className="flex items-center space-x-2">
                      <span>{vm.color}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button onClick={() => {
                      reset()
                      setSelected(vm)
                      setValue('title', vm.title)
                      setValue('description', vm.description)
                      // file input left empty
                      setOpen(true)
                    }}>Edit</Button>
                    <Button variant="destructive" onClick={() => { setSelected(vm); setConfirm(true) }}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!visionMissions || visionMissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No vision/mission found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={() => onClose()}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selected ? 'Edit Vision/Mission' : 'Add Vision/Mission'}</DialogTitle>
              <DialogDescription>{selected ? 'Edit item' : 'Create new item'}</DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2 py-3">
                  <Label>Title</Label>
                  <Input {...register('title')} placeholder="Enter title" error={!!errors.title} msgError={errors.title?.message} />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>Description</Label>
                  <Textarea {...register('description')} placeholder="Enter description" error={!!errors.description} msgError={errors.description?.message} />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>Icon</Label>
                  <div>
                    <Input type="file" accept=".jpg,.jpeg,.png,.svg,image/*" {...register('icon')} />
                    {selected && selected.icon && (
                      <div className="mt-2">
                        <p className="text-sm">Current icon preview:</p>
                        <img src={`/storage/${selected.icon}`} alt="icon" className="h-16 mt-1" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid gap-2 py-3">
                  <Label>Color</Label>
                  <Input {...register('color')} error={!!errors.color} msgError={errors.color?.message} />
                </div>
                <div className="w-full">
                  <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                    {selected ? 'Save Changes' : 'Create'}
                  </Button>
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