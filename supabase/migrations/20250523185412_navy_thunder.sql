/*
  # Create overlays table
  
  1. New Tables
    - `overlays`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `html` (text)
      - `css` (text) 
      - `js` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on overlays table
    - Add policies for authenticated users to:
      - Read their own overlays
      - Create new overlays
      - Update their own overlays
      - Delete their own overlays
*/

CREATE TABLE overlays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  html text NOT NULL,
  css text NOT NULL,
  js text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE overlays ENABLE ROW LEVEL SECURITY;

-- Policy pour lire ses propres overlays
CREATE POLICY "Users can read own overlays" 
  ON overlays
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy pour créer des overlays
CREATE POLICY "Users can create overlays" 
  ON overlays
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy pour mettre à jour ses propres overlays
CREATE POLICY "Users can update own overlays" 
  ON overlays
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy pour supprimer ses propres overlays
CREATE POLICY "Users can delete own overlays" 
  ON overlays
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);