import { Suspense } from "react";
import GcPage from "./GcPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GcPage />
    </Suspense>
  );
}


