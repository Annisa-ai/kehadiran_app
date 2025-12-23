-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Policy untuk employees: Admin bisa akses semua, employee hanya data sendiri
CREATE POLICY "Admin dapat melihat semua karyawan"
  ON employees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

CREATE POLICY "Employee dapat melihat data sendiri"
  ON employees FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin dapat insert karyawan"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

CREATE POLICY "Admin dapat update karyawan"
  ON employees FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

CREATE POLICY "Admin dapat delete karyawan"
  ON employees FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

-- Policy untuk attendance: Admin bisa akses semua, employee hanya data sendiri
CREATE POLICY "Admin dapat melihat semua absensi"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

CREATE POLICY "Employee dapat melihat absensi sendiri"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = attendance.employee_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin dapat insert absensi"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );

CREATE POLICY "Employee dapat insert absensi sendiri"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = attendance.employee_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Employee dapat update absensi sendiri"
  ON attendance FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = attendance.employee_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin dapat update semua absensi"
  ON attendance FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid() AND e.role = 'admin'
    )
  );
