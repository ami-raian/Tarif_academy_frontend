"use client";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { ThemeProvider } from "./theme-provider";
import { ReactNode } from "react";

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SimpleBar style={{ height: "100vh" }} autoHide={false}>
        {children}
      </SimpleBar>
    </ThemeProvider>
  );
}
