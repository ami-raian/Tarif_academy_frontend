import { Suspense } from "react";
import McqManagement from "./_components/mcq-management";

export const dynamic = "force-dynamic";

const McqPage = () => {
  return (
    <Suspense>
      <McqManagement />
    </Suspense>
  );
};

export default McqPage;
