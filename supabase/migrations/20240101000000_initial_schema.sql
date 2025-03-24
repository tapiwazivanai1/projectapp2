-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  goal_amount DECIMAL NOT NULL,
  current_amount DECIMAL NOT NULL DEFAULT 0,
  deadline DATE NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create contributions table
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL NOT NULL,
  anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create magazine_posts table
CREATE TABLE IF NOT EXISTS magazine_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create magazine_likes table
CREATE TABLE IF NOT EXISTS magazine_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES magazine_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create magazine_comments table
CREATE TABLE IF NOT EXISTS magazine_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES magazine_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create functions for incrementing/decrementing counts
CREATE OR REPLACE FUNCTION increment_magazine_post_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE magazine_posts
  SET likes_count = likes_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_magazine_post_likes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE magazine_posts
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_magazine_post_comments(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE magazine_posts
  SET comments_count = comments_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_magazine_post_comments(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE magazine_posts
  SET comments_count = GREATEST(0, comments_count - 1)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_project_amount(project_id UUID, contribution_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE projects
  SET current_amount = current_amount + contribution_amount
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazine_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazine_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazine_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: Everyone can view projects, only admins can create/update/delete
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);

-- Contributions: Users can see their own contributions, admins can see all
CREATE POLICY "Users can view their own contributions" ON contributions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create contributions" ON contributions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Magazine posts: Approved posts are viewable by everyone, users can see their own pending posts
CREATE POLICY "Approved magazine posts are viewable by everyone" ON magazine_posts 
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Users can create magazine posts" ON magazine_posts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own magazine posts" ON magazine_posts 
  FOR UPDATE USING (auth.uid() = user_id);

-- Magazine likes: Users can see all likes, but only create/delete their own
CREATE POLICY "Likes are viewable by everyone" ON magazine_likes FOR SELECT USING (true);
CREATE POLICY "Users can create their own likes" ON magazine_likes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON magazine_likes 
  FOR DELETE USING (auth.uid() = user_id);

-- Magazine comments: Comments are viewable by everyone, users can create their own
CREATE POLICY "Comments are viewable by everyone" ON magazine_comments FOR SELECT USING (true);
CREATE POLICY "Users can create their own comments" ON magazine_comments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON magazine_comments 
  FOR DELETE USING (auth.uid() = user_id);
