import { Suspense } from "react";
import GspinPage from "./GspinPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GspinPage />
    </Suspense>
  );
}


