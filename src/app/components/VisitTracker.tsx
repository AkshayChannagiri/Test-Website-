"use client";

import { useEffect } from "react";
import { trackVisit } from "../functions/TrackVisit";
import type { TrackingConfig } from "../types/portfolio-data.type";

/**
 * Fires the visit tracking ping once per browser session. Renders nothing.
 *
 * The flag is set before the ping fires so React Strict Mode's double-invoked
 * effects in development cannot send a duplicate visit.
 */
export default function VisitTracker({ tracking }: { tracking: TrackingConfig }) {
  useEffect(() => {
    if (!tracking?.enabled) return;
    if (sessionStorage.getItem("hasTrackedVisit")) return;

    sessionStorage.setItem("hasTrackedVisit", "true");
    void trackVisit(tracking);
  }, [tracking]);

  return null;
}
