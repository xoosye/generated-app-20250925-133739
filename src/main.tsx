import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { ChannelPage } from "@/pages/ChannelPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ChannelFormPage } from "@/pages/ChannelFormPage";
import { EpisodeFormPage } from "@/pages/EpisodeFormPage";
import { HealthCheckPage } from "@/pages/HealthCheckPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/create-channel",
    element: <ChannelFormPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/channels/:channelId",
    element: <ChannelPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/channels/:channelId/edit",
    element: <ChannelFormPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/channels/:channelId/add-episode",
    element: <EpisodeFormPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/episodes/:episodeId/edit",
    element: <EpisodeFormPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/health-check",
    element: <HealthCheckPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  }
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)