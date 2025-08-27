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
import { onlyAllowNumbers, handlePasteAllowNumbers, sanitizeNumericValue } from '@/lib/numberOnly';
import { Textarea } from "@/components/ui/textarea";
import AlertDelete from "@/components/alert-delete";
import axios from "axios";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Achievement Settings',
    href: '/achievement-settings',
  }
];

type Achievement = { id: number; title: string; description: string; points: string; icon?: string };
type Props = { achievements: Achievement[] };

export default function AchievementSetting() {
  const { achievements } = usePage<Props>().props;
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const schema = z.object({
    title: z.string().min(2).max(255),
    description: z.string().min(1),
    points: z.string(),
    icon: z.any().optional(),
  })

  type Schema = z.infer<typeof schema>

  const form = useForm<Schema>({
    resolver: zodResolver(schema)
  })

  const { register, handleSubmit, formState, reset, setValue, watch } = form
  const { errors } = formState

  const onSubmit = async (data: Schema) => {
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('title', data.title as unknown as string)
      formData.append('description', data.description as unknown as string)
      formData.append('points', String(data.points))

      const fileList = data.icon as unknown as FileList | undefined
      if (fileList && fileList.length > 0) {
        formData.append('icon', fileList[0])
      }

      if (selectedAchievement) {
        formData.append('_method', 'PUT')
        const res = await axios.post(`/achievement-settings/${selectedAchievement.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (res.status === 200) {
          toast.success('Achievement updated successfully.')
          onClose()
          Inertia.reload()
        }
      } else {
        const res = await axios.post('/achievement-settings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (res.status === 200) {
          toast.success('Achievement created successfully.')
          onClose()
          Inertia.reload()
        }
      }
    } catch (error) {
      toast.error('An error occurred while saving the achievement.')
    } finally {
      setIsLoading(false)
    }
  }

  const onClose = () => {
    setOpen(false)
    setSelectedAchievement(null)
    reset()
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post(`/achievement-settings/${selectedAchievement?.id}`, { _method: 'DELETE' })
      if (res.status === 200) {
        toast.success('Achievement deleted successfully.')
        Inertia.reload()
      }
    } catch (error) {
      toast.error('An error occurred while deleting the achievement.')
    } finally {
      setIsLoading(false)
      setConfirm(false)
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Achievement Settings" />
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Achievement Settings</h1>
          <Button onClick={() => setOpen(true)}>+ Add Achievement</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {achievements?.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.title}</TableCell>
                <TableCell>{a.points}</TableCell>
                <TableCell>
                  {a.icon ? (
                    // show thumbnail
                    <img src={`/storage/${a.icon}`} alt={a.title} className="h-10" />
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button onClick={() => {
                      reset()
                      setSelectedAchievement(a)
                      setValue('title', a.title)
                      setValue('description', a.description)
                      setValue('points', a.points)
                      setOpen(true)
                    }}>Edit</Button>
                    <Button variant="destructive" onClick={() => { setSelectedAchievement(a); setConfirm(true) }}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {
              !achievements || achievements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No achievements found.
                  </TableCell>
                </TableRow>
              ) : null
            }
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={() => onClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedAchievement ? 'Edit Achievement' : 'Add Achievement'}</DialogTitle>
              <DialogDescription>{selectedAchievement ? 'Edit the achievement' : 'Create a new achievement'}</DialogDescription>
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
                  <Label>Points</Label>
                  <Input
                    {...register('points')}
                    placeholder="Enter points"
                    error={!!errors.points}
                    msgError={errors.points?.message}
                  />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>Icon</Label>
                  <Input type="file" accept=".jpg,.jpeg,.png,.svg,image/*" {...register('icon')} />
                  {selectedAchievement && selectedAchievement.icon && (
                    <div className="mt-2">
                      <p className="text-sm">Current icon preview:</p>
                      <img src={`/storage/${selectedAchievement.icon}`} alt="icon" className="h-16 mt-1" />
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <Button type="submit" className="w-full mt-4" isLoading={isLoading}>{selectedAchievement ? 'Save Changes' : 'Create Achievement'}</Button>
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