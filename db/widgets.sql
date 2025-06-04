-- Step 2: Create widgets table
CREATE TABLE widgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  default_amounts JSONB DEFAULT '[5,10,25]',
  allow_custom_amount BOOLEAN DEFAULT true,
  button_text TEXT DEFAULT 'Buy me a coffee',
  primary_color TEXT DEFAULT '#4fd1c7',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);