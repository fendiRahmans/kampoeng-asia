
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const props = usePage().props as any;
    const settings = props.settings;

    // safe accessor for settings; handles array, paginator ({ data: [] }), or keyed object
    const getSettingValue = (list: any, key: string) => {
        if (!list) return null;
        if (Array.isArray(list)) return list.find((s: any) => s.key === key)?.value ?? null;
        if (list.data && Array.isArray(list.data)) return list.data.find((s: any) => s.key === key)?.value ?? null;
        if (typeof list === 'object') return (list[key] ?? null);
        return null;
    };

    const siteLogo = getSettingValue(settings, 'site_logo');
    const logoSrc = siteLogo ? `/storage/${siteLogo}` : 'images/logo-kampoeng-asia.png';

    return (
        <>
            <div className="flex aspect-square items-center justify-center rounded-md text-sidebar-primary-foreground">
                <img src={logoSrc} alt="Logo" className="h-12 w-12" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold">
                    {getSettingValue(settings, 'site_name') ?? 'title site'}
                </span>
            </div>
        </>
    );
}
