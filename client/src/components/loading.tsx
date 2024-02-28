import { Icons } from './ui/icons';

export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center font-bold text-white">
      <Icons.Spinner className="animate-spin"></Icons.Spinner>
    </div>
  );
}
