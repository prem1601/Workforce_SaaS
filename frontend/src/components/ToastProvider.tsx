import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        className: 'text-sm',
        duration: 4000,
      }}
    />
  );
}
