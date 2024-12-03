"use client";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import Page from "./page";
import { CreateModal } from "./components";

export default function Layout({ children, ...t }: { children?: ReactNode }) {
  const router = useRouter();
  const { train_id } = useParams<{ train_id?: string }>();

  return (
    <>
      <Page />

      <CreateModal
        opened={!!train_id}
        train_id={train_id}
        onClose={() => {
          router.push("/trains");
        }}
      />
    </>
  );
}
