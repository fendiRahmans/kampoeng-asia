import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AlertDelete from "@/components/alert-delete";
import { useState, useMemo } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";
import { toast } from "sonner";
import { Inertia } from "@inertiajs/inertia";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type User = { id?: number; name: string; email: string; role?: string };
type Setting = { id: number; key: string; value: string };
type Props = { users: User[]; settings?: Setting[] };

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'User Settings',
    href: '/user-settings',
  }
];

export default function UserSettings() {
  // props may include general settings; if not present we still work
  const props = usePage<Props>().props as any;
  const users: User[] = props.users || [];
  const settings: Setting[] | undefined = props.settings || props.generalSettings || props.general_settings;

  // try to find a roles setting (comma separated or json) to populate role options
  const roleOptions = useMemo(() => {
    const s = settings?.find((g: Setting) => g.key === 'roles' || g.key === 'user_roles');
    if (!s) return ['superadmin', 'admin'];
    try {
      // if value is JSON array
      const parsed = JSON.parse(s.value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // not JSON, fallthrough
    }
    // comma separated fallback
    return s.value.split(',').map((r: string) => r.trim()).filter((r: string) => r.length > 0);
  }, [settings]);

  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email'),
    role: z.string().optional(),
    // password optional in schema; creation will enforce it in onSubmit
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
  });

  type Schema = z.infer<typeof schema>;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', role: roleOptions[0], password: '', password_confirmation: '' }
  });

  const { register, handleSubmit, formState, reset, setValue, control, setError } = form;
  const { errors } = formState;

  const onSubmit = async (data: Schema) => {
    try {
      // enforce password on create: set form field error so user sees inline message
      if (!selectedUser && (!data.password || data.password.length < 6)) {
        setError('password', { type: 'required', message: 'Password is required and must be at least 6 characters' });
        return;
      }

      setIsLoading(true);
      // prepare payload without empty password when editing
      const payload: any = { name: data.name, email: data.email, role: data.role };
      // include password and its confirmation only when provided
      if (data.password && data.password.length > 0) {
        payload.password = data.password;
        payload.password_confirmation = data.password;
      }

      if (selectedUser && selectedUser.id) {
        const res = await axios.post(`/user-settings/${selectedUser.id}`, { ...payload, _method: 'PUT' });
        if (res.status === 200) {
          toast.success('User updated.')
          setOpen(false)
          Inertia.reload()
        }
      } else {
        const res = await axios.post('/user-settings', payload);
        if (res.status === 200) {
          toast.success('User created.')
          setOpen(false)
          Inertia.reload()
        }
      }
    } catch (err) {
      toast.error('An error occurred while saving the user.')
    } finally {
      setIsLoading(false)
    }
  }

  const onClose = () => {
    setOpen(false)
    setSelectedUser(null)
    reset()
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post(`/user-settings/${selectedUser?.id}`, { _method: 'DELETE' })
      if (res.status === 200) {
        toast.success('User deleted.')
        Inertia.reload()
      }
    } catch (err) {
      toast.error('An error occurred while deleting the user.')
    } finally {
      setIsLoading(false)
      setConfirm(false)
    }
  }
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Settings" />
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">User Settings</h1>
          <Button onClick={() => { reset(); setSelectedUser(null); setValue('role', roleOptions[0]); setOpen(true); }}>
            + Add New User
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((u, idx) => (
              <TableRow key={u.id ?? idx}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role ?? '-'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button onClick={() => {
                      reset();
                      setSelectedUser(u);
                      setValue('name', u.name);
                      setValue('email', u.email);
                      setValue('role', u.role || roleOptions[0]);
                      setOpen(true);
                    }}>Edit</Button>
                    <Button variant="destructive" onClick={() => { setSelectedUser(u); setConfirm(true); }}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={open} onOpenChange={() => onClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedUser ? 'Edit User' : 'Add User'}</DialogTitle>
              <DialogDescription>{selectedUser ? 'Edit user details' : 'Create a new user'}</DialogDescription>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2 py-3">
                  <Label>Name</Label>
                  <Input
                    {...register('name')}
                    placeholder="Full name"
                    error={!!errors.name}
                    msgError={errors.name?.message}
                  />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>Email</Label>
                  <Input
                    {...register('email')}
                    placeholder="Email"
                    error={!!errors.email}
                    msgError={errors.email?.message}
                  />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    {...register('password')}
                    placeholder={selectedUser ? 'Leave blank to keep current password' : 'Password'}
                    error={!!errors.password}
                    msgError={errors.password?.message}
                  />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    {...register('password_confirmation')}
                    placeholder={selectedUser ? 'Leave blank to keep current password' : 'Confirm Password'}
                    error={!!errors.password_confirmation}
                    msgError={errors.password_confirmation?.message}
                  />
                </div>
                <div className="grid gap-2 py-3">
                  <Label>Role</Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="w-full">
                  <Button type="submit" className="w-full mt-4" isLoading={isLoading}>{selectedUser ? 'Save Changes' : 'Create User'}</Button>
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