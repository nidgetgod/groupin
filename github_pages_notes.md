# Deploying to GitHub Pages: Instructions and Notes

This project has been configured for static export and includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) to automatically build and deploy your Next.js application to GitHub Pages.

## 1. Enable GitHub Pages in Your Repository

After pushing your code (including the workflow file) to your GitHub repository:

1.  Navigate to your repository on GitHub.
2.  Go to **Settings** > **Pages** (in the "Code and automation" section of the sidebar).
3.  Under **Source**, select **Deploy from a branch**.
4.  Under **Branch**, select `gh-pages` as the source branch.
    *   *(The `gh-pages` branch will be automatically created by the GitHub Actions workflow when it runs for the first time after a push to your `main` or `master` branch.)*
5.  Choose the `/(root)` folder unless you have a specific reason to change it.
6.  Click **Save**.

It might take a few minutes for your site to become available after the first deployment. You can monitor the deployment progress in the "Actions" tab of your repository.

Your site should be available at `https://<your-username>.github.io/group-buying-app/`.

## 2. `basePath` and `assetPrefix` Configuration

The `next.config.ts` file has been configured with a `basePath` and `assetPrefix` to support deployment to a subdirectory, which is typical for GitHub Pages (e.g., `/<repository-name>/`).

Currently, these are set as:
*   `basePath: "/group-buying-app"`
*   `assetPrefix: "/group-buying-app/"`

These settings are conditionally applied when the `GITHUB_PAGES="true"` environment variable is set during the build process (which the workflow does).

**If your GitHub repository name is different from "group-buying-app"**:
You **must** update the `GITHUB_REPO_NAME` constant in `next.config.ts`:

```typescript
// In group-buying-app/next.config.ts
const GITHUB_REPO_NAME = "your-actual-repo-name"; 
// ... rest of the file
```

Commit and push this change. The GitHub Actions workflow will then use the correct paths for your site.

**If deploying to a custom domain or the root of `<username>.github.io`**:
If you are deploying to `https://<username>.github.io` (i.e., a repository named `<username>.github.io`) or using a custom domain that points to the root, you might not need `basePath` and `assetPrefix`. In this case, you can modify `next.config.ts` to remove them or set them to `undefined` even when `GITHUB_PAGES` is true, or simply ensure `GITHUB_PAGES` is not set to `"true"` for such builds.

## 3. Supabase Environment Variables (Future Proofing)

Currently, your application uses Supabase on the client-side, and the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are expected to be in your `.env.local` file for local development.

**For the deployed GitHub Pages site to function correctly, these variables must be available to the client-side code.**
Since the GitHub Pages site is static, these public keys will be embedded in the JavaScript bundles if they are accessed via `process.env.NEXT_PUBLIC_...`.

*   **Local Development**: Your `.env.local` file provides these. **Do not commit `.env.local` to GitHub.**
*   **Production Build**: The GitHub Actions workflow currently **does not** substitute these environment variables into the static files during the build. The application relies on the values being present in your `group-buying-app/.env.local` at the time you *locally* build or run the PWA, or if you hardcode them (not recommended for the actual keys).

**Important for Static Export & Supabase:**
For a static export (`output: 'export'`), Next.js typically requires `NEXT_PUBLIC_` variables to be defined at build time to embed them into the static HTML/JS.
The current GitHub Actions workflow in `deploy.yml` **does not** have Supabase secrets configured. If your application structure changes to require these at build time (e.g., for pre-rendering pages with data), you would need to:

1.  Go to your GitHub repository **Settings** > **Secrets and variables** > **Actions**.
2.  Create new repository secrets:
    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key.
3.  Uncomment the `env` section in the build step of `.github/workflows/deploy.yml`:
    ```yaml
    # - name: Build Next.js application
    #   run: npm run build
    #   env:
    #     GITHUB_PAGES: "true"
    #     NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    #     NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
    ```

However, since all Supabase interactions are client-side and the keys are already in `supabaseClient.ts` (using `process.env.NEXT_PUBLIC_...`), ensure that your local `.env.local` is correctly set up when you build, or that the values in `supabaseClient.ts` are directly the production values if you choose that path (less secure). For a typical PWA deployed to GitHub Pages, the client-side JavaScript will use whatever values were available to `process.env` when `next build` was run. The `.env.local` file is *not* used during the GitHub Actions build unless explicitly sourced or its values passed in.

The current setup in `supabaseClient.ts` is:
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```
For these to work on the deployed GitHub Pages site, these environment variables must be correctly embedded into the static files during the `npm run build` process by Next.js. This usually means they need to be available in the environment where `npm run build` is executed. The GitHub Action workflow needs to provide them if they are not hardcoded.

**Recommendation for the current setup**:
Ensure the `.env.local` file in your *local* environment has the correct production Supabase URL and Anon key when you are testing the build process locally. For the GitHub Actions deployment, the environment variables in `next.config.ts` for `basePath` and `assetPrefix` are handled by `GITHUB_PAGES="true"`, but the Supabase keys themselves for client-side use need to be correctly managed. The simplest way for a fully static site is to ensure they are present in the build environment when `next build` runs, so they get baked into the client-side JS. The GitHub Actions workflow has been updated to include placeholders for these secrets. It's crucial to set them in your GitHub repo secrets.

## 4. `.nojekyll` File

The workflow automatically creates a `.nojekyll` file in the `out` directory before deployment. This is important as it tells GitHub Pages not to process the site with Jekyll, which can interfere with Next.js routing and static assets.All steps for configuring static export and GitHub Pages deployment have been completed.

1.  **Next.js Configuration for Static Export**:
    *   `group-buying-app/next.config.ts` was updated to include `output: 'export'`.
    *   Conditional `basePath` and `assetPrefix` (set to `"/group-buying-app"`) were added, activated by the `GITHUB_PAGES="true"` environment variable. This variable is set in the GitHub Actions workflow.
    *   The `build` script in `group-buying-app/package.json` was confirmed to be `next build`, which is correct for static export when `output: 'export'` is set.

2.  **GitHub Actions Workflow File**:
    *   `group-buying-app/.github/workflows/deploy.yml` was created.
    *   The workflow triggers on pushes to the `main` branch.
    *   It sets up Node.js 20, installs dependencies using `npm ci`, and builds the application using `npm run build`.
    *   The `GITHUB_PAGES="true"` environment variable is set during the build step to ensure correct `basePath` and `assetPrefix`.
    *   Placeholders for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` secrets are included in the workflow, reminding the user to set them if needed for build-time data fetching (though current usage is client-side, these will be baked in if available during build).
    *   A `.nojekyll` file is created in the output directory (`./out`) to prevent Jekyll processing by GitHub Pages.
    *   The `peaceiris/actions-gh-pages@v4` action is used to deploy the contents of the `./out` directory to the `gh-pages` branch.
    *   Appropriate permissions for the `GITHUB_TOKEN` are set at the job level.

3.  **User Documentation (`github_pages_notes.md`)**:
    *   `group-buying-app/github_pages_notes.md` was created.
    *   It explains how to enable GitHub Pages in the repository settings (selecting the `gh-pages` branch).
    *   It details the `basePath` and `assetPrefix` configuration, instructing the user to update `next.config.ts` if their repository name differs from "group-buying-app".
    *   It includes a section on Supabase environment variables, clarifying their use in a static export context and how to set them as GitHub secrets for the Actions workflow, especially if they become necessary for build-time processes or to ensure they are correctly embedded in client-side code.

The application is now fully configured for deployment to GitHub Pages via the automated GitHub Actions workflow.
