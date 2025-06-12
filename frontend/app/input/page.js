import { Suspense } from 'react';
import InputBibPage from './InputBibPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Memuat halaman...</div>}>
      <InputBibPage />
    </Suspense>
  );
}
