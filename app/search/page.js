import { Suspense } from "react";
import SearchResultsClient from "./SearchResultsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsClient />
    </Suspense>
  );
}
