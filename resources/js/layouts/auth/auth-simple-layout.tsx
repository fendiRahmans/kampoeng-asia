import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rt-primary/80 via-rt-accent/30 to-rt-primary/20 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
