import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link } from '@inertiajs/react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import password from '../settings/password';
import axios from 'axios';
import { toast } from 'sonner';
import { Inertia } from '@inertiajs/inertia';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6).max(100),
    });

    type Schema = z.infer<typeof schema>;

    const form = useForm<Schema>({
        resolver: zodResolver(schema),
    });

    const { handleSubmit, reset, formState } = form;
    const { errors } = formState;

    const onSubmit = async (data: Schema) => {
        try {
            setIsLoading(true);
            const res = await axios.post('/login', data);
            if (res.status === 200) {
                toast.success('Login successful');
                Inertia.visit('/dashboard');
            }
        } catch (error) {
            toast.error('Login failed');
            console.error(error);
        } finally {
            setIsLoading(false);
        }

    }
    return (
        <AuthLayout>
            <Head title="Log in" />
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-0">
                    <CardHeader className="text-center pb-3">
                        <div className="flex justify-center">
                            <img
                                src="/images/logo-kampoeng-asia.png"
                                alt="Logo"
                                className="w-16 h-w-16"
                            />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Login Admin
                        </CardTitle>
                        <p className="mt-2">
                            RT 01 RW 23 Kemirisewu
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@rt01rw23.com"
                                    className="h-12"
                                    {...form.register('email')}
                                    error={!!errors.email}
                                    msgError={errors.email?.message}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Masukkan password"
                                        className="h-12 pr-12"
                                        {...form.register('password')}
                                        error={!!errors.password}
                                        msgError={errors.password?.message}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-gray-500" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-rt-primary to-rt-accent hover:from-rt-accent hover:to-rt-primary text-white font-semibold"
                                disabled={isLoading}
                                isLoading={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <LogIn className="w-4 h-4" />
                                        <span>Login</span>
                                    </div>
                                )}
                            </Button>
                            <div className='text-center'>
                                <Link href="/" className="text-sm text-rt-primary hover:underline">
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        </form>

                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2 font-medium">Demo Login:</p>
                            <p className="text-xs text-gray-500">Email: kampoengasia@getnada.com</p>
                            <p className="text-xs text-gray-500">Password: kampoeng123asia</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}
