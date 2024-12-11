import { LoaderCircle } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center">
      <LoaderCircle size={64} color="white" className="animate-spin" />;
    </div>
  );
};

export default LoadingSpinner;
