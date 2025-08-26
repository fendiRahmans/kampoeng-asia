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
import axios from "axios";
import { toast } from "sonner";

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

type Setting = { id: number; key: string; value: string };
type Props = { settings: Setting[] };

export default function GeneralSetting() {
  const { settings } = usePage<Props>().props;
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);

  // allow value to be either a string (regular settings) or a FileList (site_logo)
  const schema = z.object({
    key: z.string().min(2).max(100),
    value: z.any().optional(),
  })

  type Schema = z.infer<typeof schema>

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { key: '', value: '' }
  })

  const { register, handleSubmit, formState, reset, watch, setValue } = form

  const watchedKey = watch('key')

  const { errors } = formState

  const onSubmit = async (data: Schema) => {
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('key', data.key)

      // if key is site_logo, value is expected to be a FileList (from input[type=file])
      if (data.key === 'site_logo') {
        const fileList = data.value as FileList | undefined
        if (fileList && fileList.length > 0) {
          formData.append('value', fileList[0])
        }
        // if no file provided during update, do not append 'value' so backend keeps existing path
      } else {
        // normal string value
        formData.append('value', data.value as string)
      }

      if (selectedSetting) {
        // For Laravel PUT via POST, include _method in FormData
        formData.append('_method', 'PUT')

        const res = await axios.post(`/general-settings/${selectedSetting.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (res.status === 200) {
          toast.success("Setting updated successfully.")
          onClose()
          Inertia.reload()
        }
      } else {
        const res = await axios.post('/general-settings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (res.status === 200) {
          toast.success("Setting created successfully.")
          onClose()
          Inertia.reload()
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving the setting.")
    } finally {
      setIsLoading(false)
    }
  }
  const onClose = () => {
    setOpen(false)
    setSelectedSetting(null)
    reset()
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post(`/general-settings/${selectedSetting?.id}`, {
        _method: 'DELETE'
      })
      if (res.status === 200) {
        toast.success("Setting deleted successfully.")
        Inertia.reload()
      }
    } catch (error) {
      toast.error("An error occurred while deleting the setting.")
    } finally {
      setIsLoading(false)
      setConfirm(false)
    }
  }


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="General Settings" />
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">General Settings</h1>
          <Button onClick={() => setOpen(true)}>
            + Add New Setting
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings?.map((setting) => (
              <TableRow key={setting.id}>
                <TableCell>{setting.key}</TableCell>
                <TableCell>{setting.value}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        reset()
                        setSelectedSetting(setting)
                        setValue("key", setting.key)
                        // for string values we can set the value; for file-based keys we leave file input empty
                        setValue("value", setting.value)
                        setOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedSetting(setting)
                        setConfirm(true)
                      }}
                    >Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={() => onClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedSetting ? "Edit Setting" : "Add Setting"}
              </DialogTitle>
              <DialogDescription>
                {selectedSetting ? "Edit the setting" : "Add a new setting"}
              </DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2 py-3">
                  <Label>
                    Key
                  </Label>
                  <Input
                    {...register("key")}
                    placeholder="Enter key"
                    disabled={!!selectedSetting}
                    error={!!errors.key}
                    msgError={errors.key?.message}
                  />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>
                    Value
                  </Label>
                  {watchedKey === 'site_logo' ? (
                    <div>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.svg,image/*"
                        {...register('value')}
                      />
                      {selectedSetting && selectedSetting.key === 'site_logo' && selectedSetting.value && (
                        <div className="mt-2">
                          <p className="text-sm">Current logo preview:</p>
                          <img src={`/storage/${selectedSetting.value}`} alt="site logo" className="h-16 mt-1" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Textarea
                      {...register("value")}
                      placeholder="Enter value"
                      error={!!errors.value}
                      msgError={!!errors.value?.message}
                    />
                  )}
                </div>
                <div className="w-full">
                  <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
                    {selectedSetting ? "Save Changes" : "Create Setting"}
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
