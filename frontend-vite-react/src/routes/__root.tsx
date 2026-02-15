import { createRootRoute, Outlet } from '@tanstack/react-router';
import * as pino from "pino";
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayout } from "@/layouts/layout";
import { MidnightMeshProvider } from "@/modules/midnight/wallet-widget/contexts/wallet";

export const logger = pino.pino({
  level: "trace",
});

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  console.log('RootComponent rendering - simple version');
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <MidnightMeshProvider logger={logger}>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </MidnightMeshProvider>
    </ThemeProvider>
  );
}
