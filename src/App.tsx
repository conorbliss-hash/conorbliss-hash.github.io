import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Index from "./pages/Index";

// Rarely visited routes are split out so they don't weigh down the home page.
const Stats = lazy(() => import("./pages/Stats"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Router-agnostic: main.tsx wraps this in BrowserRouter, entry-server.tsx in StaticRouter.
const App = () => (
  <MotionConfig reducedMotion="user">
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/stats" element={<Stats />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </MotionConfig>
);

export default App;
