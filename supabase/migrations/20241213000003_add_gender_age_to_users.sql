-- Add gender and age columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 0 AND age <= 150);

-- Optional: simple index if you plan to filter by gender frequently
CREATE INDEX IF NOT EXISTS idx_users_gender ON users(gender);


