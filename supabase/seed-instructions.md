# Updating Seed Data with Valid User ID

After you've created a user account in your app, follow these steps to update the seed data with your valid user ID:

1. Sign up for an account in your app using the Auth page
2. Go to your Supabase dashboard → Authentication → Users
3. Find your user and copy their UUID
4. Open the `supabase/seed.sql` file
5. Replace all instances of `'00000000-0000-0000-0000-000000000000'` with your actual UUID (keep the single quotes)
6. Run the updated seed SQL in the Supabase SQL Editor

Example:

```sql
-- Original line in seed.sql
INSERT INTO magazine_posts (user_id, title, content, category, content_type, status, likes_count, comments_count)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'Finding Faith in Difficult Times', ...)

-- Updated line with your UUID
INSERT INTO magazine_posts (user_id, title, content, category, content_type, status, likes_count, comments_count)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-1234567890ab', 'Finding Faith in Difficult Times', ...)
```

This will resolve the foreign key constraint error you were experiencing.