# Komponen Pagination

Komponen Pagination yang reusable untuk menampilkan navigasi halaman dengan Inertia.js.

## Penggunaan

```tsx
import Pagination from "@/components/ui/pagination";

// Dalam komponen Anda
<Pagination data={dataPagination} />
```

## Props

| Prop | Type | Default | Deskripsi |
|------|------|---------|-----------|
| `data` | `PaginationData` | - | Data paginasi dari Laravel |
| `showInfo` | `boolean` | `true` | Menampilkan info "Showing X to Y of Z results" |
| `className` | `string` | `""` | Custom CSS class |
| `size` | `"sm" \| "default" \| "lg"` | `"sm"` | Ukuran tombol pagination |

## Type Definition

```typescript
interface PaginationData {
  current_page: number;
  data: any[];
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
}
```

## Contoh Lengkap

### Backend (Laravel Controller)

```php
public function index(Request $request)
{
    $items = Item::orderBy('created_at', 'asc')
        ->paginate(10); // 10 items per page

    return Inertia::render('items/index', [
        'items' => $items
    ]);
}
```

### Frontend (React/TypeScript)

```tsx
import Pagination from "@/components/ui/pagination";

type Item = { id: number; name: string; description: string };
type PaginationData = {
  current_page: number;
  data: Item[];
  // ... other pagination properties
};
type Props = { items: PaginationData };

export default function ItemsIndex() {
  const { items } = usePage<Props>().props;

  return (
    <div>
      <Table>
        <TableBody>
          {items?.data?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Menggunakan komponen Pagination */}
      <Pagination data={items} />
    </div>
  );
}
```

## Opsi Kustomisasi

### Menyembunyikan Info Pagination

```tsx
<Pagination data={items} showInfo={false} />
```

### Mengubah Ukuran Tombol

```tsx
<Pagination data={items} size="lg" />
```

### Menambah Custom Class

```tsx
<Pagination data={items} className="my-custom-pagination" />
```

## Fitur

- ✅ Navigasi Previous/Next
- ✅ Nomor halaman yang dapat diklik
- ✅ Info jumlah data yang ditampilkan
- ✅ Responsive design
- ✅ Integrasi penuh dengan Inertia.js
- ✅ TypeScript support
- ✅ Customizable styling

## Implementasi di Aplikasi

Komponen ini sudah digunakan di:
- `resources/js/pages/settings/documentation-setting.tsx`
- `resources/js/pages/settings/general-setting.tsx`

Untuk menambahkannya ke halaman lain, ikuti langkah-langkah berikut:

1. Pastikan controller mengembalikan data dengan `paginate()`
2. Import komponen Pagination
3. Gunakan `<Pagination data={namaData} />` setelah tabel
4. Update type definitions sesuai kebutuhan
