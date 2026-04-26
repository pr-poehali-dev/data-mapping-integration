CREATE TABLE t_p64984322_data_mapping_integra.videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);