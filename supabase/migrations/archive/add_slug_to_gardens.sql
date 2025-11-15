-- Migration: Add slug column to gardens table
-- Created: 2025-11-13
-- Purpose: Add URL-friendly slug field for better SEO and user-friendly URLs

-- Add slug column to gardens table
ALTER TABLE gardens
ADD COLUMN slug VARCHAR(255);

-- Create unique index on slug
CREATE UNIQUE INDEX gardens_slug_idx ON gardens(slug);

-- Function to generate slug from nama
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          trim(text_input),
          '\s+', '-', 'g'  -- Replace spaces with hyphens
        ),
        '[^a-z0-9\-]', '', 'gi'  -- Remove non-alphanumeric except hyphens
      ),
      '\-+', '-', 'g'  -- Replace multiple hyphens with single hyphen
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing gardens with slugs
UPDATE gardens
SET slug = generate_slug(nama);

-- Make slug NOT NULL after populating existing records
ALTER TABLE gardens
ALTER COLUMN slug SET NOT NULL;

-- Create trigger to auto-generate slug on insert/update if not provided
CREATE OR REPLACE FUNCTION gardens_auto_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate slug if not provided or empty
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.nama);

    -- Handle duplicate slugs by appending a number
    DECLARE
      counter INTEGER := 1;
      temp_slug TEXT := NEW.slug;
    BEGIN
      WHILE EXISTS (SELECT 1 FROM gardens WHERE slug = temp_slug AND id != NEW.id) LOOP
        temp_slug := NEW.slug || '-' || counter;
        counter := counter + 1;
      END LOOP;
      NEW.slug := temp_slug;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gardens_auto_slug_trigger
  BEFORE INSERT OR UPDATE ON gardens
  FOR EACH ROW
  EXECUTE FUNCTION gardens_auto_slug();

-- Add comment
COMMENT ON COLUMN gardens.slug IS 'URL-friendly slug generated from nama, used for SEO-friendly URLs';
