import TokenApp from "@/components/Landing";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
      <Toaster />
      <div>
        <TokenApp />
      </div>
    </>
  );
}
