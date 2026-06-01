import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

// Marketing + onboarding load eagerly (small, first paint)
import { LandingPage } from "@/features/marketing/LandingPage";
import { ConnectPage } from "@/features/onboarding/ConnectPage";
import { OnboardingPage } from "@/features/onboarding/OnboardingPage";
import { NotFoundPage } from "@/features/shared/NotFoundPage";

// App pages are code-split (they pull in charts)
const lazyPage = <T extends Record<string, React.ComponentType>>(
  loader: () => Promise<T>,
  key: keyof T,
) => lazy(() => loader().then((m) => ({ default: m[key] })));

const OverviewPage = lazyPage(() => import("@/features/overview/OverviewPage"), "OverviewPage");
const SecretsPage = lazyPage(() => import("@/features/security/SecretsPage"), "SecretsPage");
const VulnerabilitiesPage = lazyPage(
  () => import("@/features/security/VulnerabilitiesPage"),
  "VulnerabilitiesPage",
);
const CodeScanningPage = lazyPage(
  () => import("@/features/security/CodeScanningPage"),
  "CodeScanningPage",
);
const SupplyChainPage = lazyPage(
  () => import("@/features/supplyChain/SupplyChainPage"),
  "SupplyChainPage",
);
const DependenciesPage = lazyPage(
  () => import("@/features/dependencies/DependenciesPage"),
  "DependenciesPage",
);
const ArtifactsPage = lazyPage(() => import("@/features/artifacts/ArtifactsPage"), "ArtifactsPage");
const RepositoriesPage = lazyPage(
  () => import("@/features/repositories/RepositoriesPage"),
  "RepositoriesPage",
);
const RepoDetailPage = lazyPage(
  () => import("@/features/repositories/RepoDetailPage"),
  "RepoDetailPage",
);
const AccessPage = lazyPage(() => import("@/features/access/AccessPage"), "AccessPage");
const NotificationsPage = lazyPage(
  () => import("@/features/notifications/NotificationsPage"),
  "NotificationsPage",
);
const SettingsPage = lazyPage(() => import("@/features/settings/SettingsPage"), "SettingsPage");

function PageFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="size-5 animate-spin text-ink-tertiary" />
    </div>
  );
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/overview" replace />} />
            <Route
              element={
                <Suspense fallback={<PageFallback />}>
                  <Outlet />
                </Suspense>
              }
            >
              <Route path="overview" element={<OverviewPage />} />
              <Route path="security/secrets" element={<SecretsPage />} />
              <Route path="security/vulnerabilities" element={<VulnerabilitiesPage />} />
              <Route path="security/code-scanning" element={<CodeScanningPage />} />
              <Route path="supply-chain" element={<SupplyChainPage />} />
              <Route path="dependencies" element={<DependenciesPage />} />
              <Route path="artifacts" element={<ArtifactsPage />} />
              <Route path="repositories" element={<RepositoriesPage />} />
              <Route path="repositories/:repoId" element={<RepoDetailPage />} />
              <Route path="access" element={<AccessPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}
