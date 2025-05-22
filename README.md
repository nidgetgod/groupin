# Group Buying App

## Overview

This is a Next.js application designed for group buying. It allows users to create and join group purchase deals. The application is built with Next.js and utilizes Supabase for backend services, including database and authentication.

It is configured as a Progressive Web App (PWA) for an enhanced user experience and is set up for static export, enabling deployment on platforms like GitHub Pages.

## Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js**: Version 20.x is recommended (as used in the deployment workflow). You can download it from [nodejs.org](https://nodejs.org/).
-   **npm**: This is the Node Package Manager and typically comes with Node.js.
-   **Git**: For cloning the repository. You can download it from [git-scm.com](https://git-scm.com/).

## Setup Instructions (Local Development)

1.  **Clone the repository:**
    Replace `<repository_url>` with the actual URL of your repository and `<repository_name>` with the name of your repository folder (likely `group-buying-app`).
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Install dependencies:**
    This command will install all the necessary project dependencies.
    ```bash
    npm install
    ```
    (Note: The deployment workflow uses `npm ci` for reproducibility, but `npm install` is standard for local development.)

3.  **Set up environment variables:**
    The application requires Supabase credentials to connect to your Supabase backend.
    Create a file named `.env.local` in the root of your project.
    Add the following content to `.env.local`, replacing the placeholder values with your actual Supabase project credentials:
    ```
    NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
    ```
    You can find these values in your Supabase project settings:
    - Go to your Supabase project.
    - Navigate to Project Settings (the gear icon).
    - Click on "API".
    - You'll find the "Project URL" (which is your `NEXT_PUBLIC_SUPABASE_URL`) and the "anon" "public" key (which is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Next.js development server, typically available at `http://localhost:3000`. Open this URL in your browser to see the application.

## Building for Production (Locally)

To create a production-ready build of the application, run:
```bash
npm run build
```
This command compiles the Next.js application and generates a static export in the `./out` directory. This `out` directory contains all the static files that can be deployed to a web server or static hosting service.

## Deployment (GitHub Pages)

This project is configured for automated deployment to GitHub Pages using GitHub Actions.

1.  **Prerequisites for Deployment:**
    -   You have a GitHub repository where your project code is pushed.
    -   You have a Supabase project created, and you have noted its URL and Anon key.

2.  **Configure GitHub Secrets:**
    For the deployment workflow to access your Supabase instance, you must securely store your Supabase credentials as GitHub secrets:
    -   Go to your GitHub repository.
    -   Click on "Settings" -> "Secrets and variables" (in the sidebar) -> "Actions".
    -   Click "New repository secret" for each of the following secrets:
        -   `NEXT_PUBLIC_SUPABASE_URL`: Paste your Supabase project URL here.
        -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Paste your Supabase anon public key here.
    These secrets will be used by the GitHub Actions workflow during the build process.

3.  **Enable GitHub Pages:**
    Configure your repository to serve a GitHub Pages site from the correct branch:
    -   Go to your GitHub repository's "Settings" tab.
    -   In the "Code and automation" section of the sidebar, click on "Pages".
    -   Under "Build and deployment", for "Source", select `Deploy from a branch`.
    -   Under "Branch", select `gh-pages` as the branch and `/ (root)` as the folder. (The GitHub Actions workflow is configured to push the static site to the `gh-pages` branch).
    -   Click "Save".

4.  **Automatic Deployment:**
    The GitHub Actions workflow defined in `.github/workflows/deploy.yml` is triggered automatically whenever you push changes to the `main` branch of your repository.
    This workflow will:
    -   Check out your code.
    -   Set up Node.js.
    -   Install dependencies.
    -   Build the Next.js application (using the Supabase secrets you configured).
    -   Deploy the contents of the `./out` directory to the `gh-pages` branch.

5.  **Accessing the Deployed Site:**
    Once the workflow completes successfully, your site will be live.
    The URL will follow this pattern: `https://<your-github-username>.github.io/<your-repository-name>/`.
    -   Replace `<your-github-username>` with your GitHub username.
    -   Replace `<your-repository-name>` with the name of your GitHub repository. Given the `basePath` in `next.config.ts` is `/group-buying-app`, the URL will likely be `https://<your-github-username>.github.io/group-buying-app/`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
