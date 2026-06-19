import { Suspense } from "react";
import GspinPage from "./GspinPage";

export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GspinPage params={params} />
    </Suspense>
  );
}