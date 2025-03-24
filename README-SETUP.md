# Guta Ra Mwari App Setup Guide

## Setting Up Supabase

1. **Create a Supabase Project**
   - Go to [Supabase](https://supabase.com/) and sign up or log in
   - Create a new project
   - Note your project URL and anon key

2. **Set Environment Variables**
   - In the Tempo platform, go to Project Settings
   - Add the following environment variables:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

3. **Initialize Database Schema**
   - In the Supabase dashboard, go to the SQL Editor
   - Copy the contents of `supabase/migrations/20240101000000_initial_schema.sql`
   - Run the SQL to create all necessary tables and functions

4. **Seed Initial Data**
   - In the SQL Editor, copy the contents of `supabase/seed.sql`
   - Run the SQL to add sample data
   - Note: You'll need to update the user_id in the magazine_posts table after creating users

## Authentication Setup

1. **Configure Auth Providers**
   - In the Supabase dashboard, go to Authentication > Providers
   - Ensure Email provider is enabled
   - Configure any additional providers as needed (Google, Facebook, etc.)

2. **Set Up Email Templates**
   - Customize email templates for confirmation, password reset, etc.

## Storage Setup

1. **Create Buckets**
   - In the Supabase dashboard, go to Storage
   - Create the following buckets:
     - `avatars`: For user profile pictures
     - `magazine_content`: For magazine images, videos, and audio

2. **Configure Bucket Permissions**
   - Set appropriate RLS policies for each bucket
   - For public content, ensure public access is enabled

## Testing the App

1. **Create a Test User**
   - Use the sign-up form in the app to create a test user
   - Verify the user is created in the Supabase Auth dashboard

2. **Test Core Functionality**
   - Test user authentication (sign up, sign in, sign out)
   - Test viewing projects and magazine content
   - Test making contributions to projects
   - Test submitting magazine content

## Troubleshooting

- **Authentication Issues**: Check browser console for errors, verify environment variables
- **Database Issues**: Check Supabase logs, verify SQL migrations ran correctly
- **Storage Issues**: Check bucket permissions, verify file upload paths

## Next Steps

- Set up proper error handling throughout the app
- Implement real-time updates using Supabase subscriptions
- Add admin functionality for managing content
- Implement payment processing integration
