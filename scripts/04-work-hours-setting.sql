-- Tambah tabel untuk pengaturan jam kerja
CREATE TABLE IF NOT EXISTS work_hours_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  start_time TIME NOT NULL DEFAULT '08:00:00',
  end_time TIME NOT NULL DEFAULT '17:00:00',
  late_threshold_minutes INTEGER NOT NULL DEFAULT 15,
  early_leave_threshold_minutes INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default settings
INSERT INTO work_hours_settings (start_time, end_time, late_threshold_minutes, early_leave_threshold_minutes)
VALUES ('08:00:00', '17:00:00', 15, 30)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE work_hours_settings ENABLE ROW LEVEL SECURITY;

-- Policy untuk admin bisa read/update
CREATE POLICY "Admin dapat melihat pengaturan jam kerja" ON work_hours_settings
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.role = 'admin'
    )
  );

CREATE POLICY "Admin dapat mengubah pengaturan jam kerja" ON work_hours_settings
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.user_id = auth.uid()
      AND employees.role = 'admin'
    )
  );

-- Auto update timestamp
CREATE TRIGGER update_work_hours_settings_updated_at
  BEFORE UPDATE ON work_hours_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
