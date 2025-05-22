# Supabase Authentication Configuration Notes

For the email/password authentication features implemented in this application to work correctly, you need to ensure your Supabase project is configured appropriately:

1.  **Enable Email Provider**:
    *   Go to your Supabase Project Dashboard.
    *   Navigate to **Authentication** -> **Providers**.
    *   Ensure the **Email** provider is enabled. It usually is by default.

2.  **Email Confirmation Settings (Important for Sign Up)**:
    *   Navigate to **Authentication** -> **Settings**.
    *   Find the **Email** section.
    *   **Confirm email**: By default, this is often **ON**.
        *   If **ON**: Supabase will send a confirmation email to the user upon sign-up. The user must click the link in this email before they can log in. The `SignUpForm.tsx` component provides a message indicating this.
        *   If **OFF**: Users can log in immediately after signing up without email confirmation. This is less secure but might be acceptable for testing or certain use cases.
    *   **Secure email change**: Usually enabled by default, requires confirmation for email changes.

3.  **Site URL Configuration**:
    *   Navigate to **Authentication** -> **Settings**.
    *   Under **General**, set your **Site URL**. This URL is used for generating links in confirmation emails, password reset emails, etc.
        *   For local development, this is typically `http://localhost:3000`.
        *   For production, set it to your application's deployed URL.

4.  **Email Templates (Optional Customization)**:
    *   Supabase uses default email templates for confirmation, password reset, etc.
    *   You can customize these under **Authentication** -> **Email Templates** if needed.

5.  **RLS Policies for `auth.users`**:
    *   Ensure your Row Level Security policies on `public.users` (if you have a separate user profile table) or other tables correctly reference `auth.uid()` for operations that should only be performed by authenticated users.
    *   The `creator_id` in `group_buys` and `user_id` in `participants` tables reference `auth.users(id)`. Your RLS policies for these tables should allow authenticated users to insert/update/delete their own records. For example:
        *   Policy for creating group buys: `(auth.uid() = creator_id)`
        *   Policy for joining group buys (inserting into participants): `(auth.uid() = user_id)`

By checking these settings in your Supabase project, you can ensure the authentication flow works as expected. If users report issues with sign-up (e.g., not receiving confirmation emails) or login, these are the primary areas to investigate.
