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

  const schema = z.object({
    key: z.string().min(2).max(100),
    value: z.string().min(2).max(100),
  })

  type Schema = z.infer<typeof schema>

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const { register, handleSubmit, formState, reset } = form

  const { errors } = formState

  const onSubmit = async (data: Schema) => {
    try {
      setIsLoading(true)
      if (selectedSetting) {
        const res = await axios.post(`/general-settings/${selectedSetting.id}`, {
          ...data,
          _method: 'PUT'
        })
        console.log(res);
        if (res.status === 200) {
          toast.success("Setting updated successfully.")
          onClose()
          Inertia.reload()
        }
      } else {
        const res = await axios.post('/general-settings', data)
        console.log(res);
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
                        form.setValue("key", setting.key)
                        form.setValue("value", setting.value)
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
                  <Textarea
                    {...register("value")}
                    placeholder="Enter value"
                    error={!!errors.value}
                    msgError={errors.value?.message}
                  />
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
