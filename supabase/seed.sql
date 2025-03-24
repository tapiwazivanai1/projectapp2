-- Seed data for projects
INSERT INTO projects (title, description, image, category, goal_amount, current_amount, deadline, featured, active)
VALUES
  ('Church Building Renovation', 'Help us renovate the main sanctuary to accommodate our growing congregation and improve facilities.', 'https://images.unsplash.com/photo-1543674892-7d64d45df18d?w=600&q=80', 'Construction', 50000, 15000, '2023-12-31', false, true),
  ('Youth Camp Sponsorship', 'Support our annual youth camp by sponsoring children who cannot afford to attend this life-changing event.', 'https://images.unsplash.com/photo-1516402707257-787c50fc3898?w=600&q=80', 'Youth', 12000, 5000, '2023-08-15', false, true),
  ('Community Outreach Program', 'Fund our monthly outreach program providing food, clothing, and essential supplies to vulnerable communities.', 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600&q=80', 'Outreach', 10000, 8500, '2023-10-01', false, true),
  ('Musical Instruments Fund', 'Help us purchase new musical instruments for our worship team to enhance our Sunday service experience.', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80', 'Worship', 7500, 3000, '2023-11-30', false, true),
  ('Children''s Ministry Resources', 'Support our children''s ministry by helping us purchase educational materials and resources for Sunday School.', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80', 'Children', 3000, 1200, '2023-09-15', false, true),
  ('International Missions Trip', 'Support our team of missionaries traveling to provide aid, share the gospel, and build relationships abroad.', 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80', 'Missions', 25000, 12000, '2024-02-28', false, true),
  ('Guta Ra Mwari Magazine', 'Our featured project until April 2026 - a community-driven magazine showcasing testimonies, articles, and media from our congregation.', 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=1200&q=80', 'Magazine', 50000, 25000, '2026-04-30', true, true);

-- Seed data for magazine posts (assuming we have some users)
-- Note: In a real application, you would need to replace the user_id with actual user IDs
-- For now, we'll use a placeholder that you'll need to update after creating users
INSERT INTO magazine_posts (user_id, title, content, category, content_type, status, likes_count, comments_count)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'Finding Faith in Difficult Times', 'A personal testimony about finding strength through prayer and community support.', 'testimonies', 'article', 'approved', 24, 5),
  ('00000000-0000-0000-0000-000000000000', 'Youth Camp Highlights', 'Photos and stories from our recent youth retreat in the mountains.', 'youth', 'image', 'approved', 42, 12),
  ('00000000-0000-0000-0000-000000000000', 'Sunday Service Reflection', 'Key takeaways from last Sunday''s powerful sermon on community and fellowship.', 'teachings', 'article', 'approved', 87, 23),
  ('00000000-0000-0000-0000-000000000000', 'Community Outreach Success', 'Our recent food drive helped over 200 families in need. See the impact we made together.', 'outreach', 'image', 'approved', 56, 8);
