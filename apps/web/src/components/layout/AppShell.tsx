import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "./CommandPalette";
import { Toaster } from "@/components/ui/Toaster";
import { useOrgStore } from "@/stores/useOrgStore";
import { useUiStore } from "@/stores/useUiStore";

export function AppShell() {
  const connected = useOrgStore((s) => s.connected);
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const setMobileNav = useUiStore((s) => s.setMobileNav);
  const location = useLocation();

  // close the mobile drawer on navigation
  useEffect(() => {
    setMobileNav(false);
  }, [location.pathname, setMobileNav]);

  if (!connected) return <Navigate to="/connect" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-canvas text-ink">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNav(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 38 }}
            >
              <Sidebar forceExpanded />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster />
      <CommandPalette />
    </div>
  );
}
