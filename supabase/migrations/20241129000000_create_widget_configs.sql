
-- Create widget configurations table
CREATE TABLE IF NOT EXISTS public.widget_configs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL UNIQUE,
    widget_type text NOT NULL DEFAULT 'followers_goal',
    config jsonb NOT NULL DEFAULT '{}',
    current_followers integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.widget_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users" 
ON public.widget_configs 
FOR ALL 
USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.widget_configs;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_widget_configs_user_id ON public.widget_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_widget_configs_updated_at ON public.widget_configs(updated_at);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION public.update_widget_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_widget_configs_timestamp
    BEFORE UPDATE ON public.widget_configs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_widget_config_timestamp();
