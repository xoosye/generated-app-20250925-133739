# EchoWave

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/BenYegq/myTube)

A retro-themed podcast web application for creating and managing channels and episodes with a nostalgic 90s UI.

## About The Project

EchoWave is a retro-themed podcasting platform built on Cloudflare's edge network. It allows creators to establish their own podcast channels, upload episodes, and manage their content through a visually striking, 90s-inspired interface. The application features a distinct aesthetic with neon color palettes, pixelated fonts, and glitch effects, evoking a sense of early internet nostalgia.

The core experience revolves around a central dashboard for managing channels and a dedicated view for each channel to list and play its episodes.

### Key Features

*   **Retro 90s UI:** A unique, nostalgic interface with neon colors, pixelated fonts, and glitch effects.
*   **Channel Management:** Create, view, and manage your own podcast channels with custom titles and descriptions.
*   **Episode Management:** Add individual episodes to your channels, complete with titles, descriptions, and audio files.
*   **Edge-Powered:** Built entirely on Cloudflare's stack, including Workers for the backend and Durable Objects for stateful storage.
*   **Fully Responsive:** A flawless experience across all device sizes, from mobile to desktop.

## Technology Stack

This project is built with a modern, edge-native technology stack:

*   **Frontend:**
    *   [React](https://reactjs.org/)
    *   [Vite](https://vitejs.dev/)
    *   [React Router](https://reactrouter.com/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn/ui](https://ui.shadcn.com/)
*   **Backend:**
    *   [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)
*   **Storage:**
    *   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
*   **State Management:**
    *   [Zustand](https://zustand-demo.pmnd.rs/)
*   **Tooling & Language:**
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Bun](https://bun.sh/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/echowave.git
    cd echowave
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

### Running Locally

To start the development server for both the frontend and the backend worker, run:

```sh
bun run dev
```

This will start the Vite development server, typically on `http://localhost:3000`, with the Hono worker running in the background.

## Development

The project is structured into three main parts:

*   `src/`: Contains the frontend React application, including pages, components, and hooks.
*   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers. All API logic resides here.
*   `shared/`: Contains TypeScript types and mock data that are shared between the frontend and the backend to ensure type safety.

When developing, changes to both the frontend and backend will trigger a hot reload, allowing for a seamless development experience.

## Deployment

This application is designed to be deployed to the Cloudflare network.

1.  **Login to Wrangler:**
    If you haven't already, authenticate with your Cloudflare account.
    ```sh
    bunx wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the application and deploy it using Wrangler.
    ```sh
    bun run deploy
    ```

This command handles building the Vite frontend, bundling the worker, and publishing them to your Cloudflare account.

Alternatively, you can deploy your own version of this project with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/BenYegq/myTube)