"use client";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { ThemeProvider } from "./theme-provider";
import { ReactNode } from "react";

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {/* Use dvh for mobile browser compatibility, fallback to vh for older browsers */}
      <SimpleBar
        className="app-scrollbar"
        style={{ height: "100dvh", maxHeight: "100dvh" }}
        autoHide={false}
      >
        {children}
      </SimpleBar>
    </ThemeProvider>
  );
}
