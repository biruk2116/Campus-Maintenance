# Database Schema Details

Database name: `campus_maintenance_system`

The schema now contains the normalized campus-maintenance tables requested for assets, locations, work orders, inventory, history, notifications, and preventive schedules. It also preserves the existing application workflow through the `requests`, `maintenance_logs`, `request_attachments`, and `user_files` tables.

## Core Tables

### `departments`
Stores campus departments.

Main fields: `department_id`, `department_name`, `office_location`

### `users`
Stores all people and login accounts.

Main fields: `user_id`, `user_code`, `full_name`, `email`, `phone`, `password_hash`, `role`, `department_id`, `status`, `created_at`

Compatibility fields used by the current app: `skills`, `must_change_password`, `updated_at`

### `buildings`, `locations`, `assets`
Normalize where maintenance happens and which physical assets are maintained.

`assets.serial_number` and `buildings.building_code` are unique.

### `technicians`
Stores technician-specific details linked one-to-one to `users`.

Main fields: `technician_id`, `user_id`, `specialization`, `experience_years`, `availability_status`

### `maintenance_requests`
Stores normalized maintenance reports for asset/location reporting.

Main fields: `request_id`, `reported_by`, `asset_id`, `location_id`, `issue_title`, `issue_description`, `priority_level`, `request_status`, `assigned_to`

### `requests`
Stores the live request workflow used by the React/PHP dashboards.

It includes `maintenance_request_id` so new app requests are linked to the normalized `maintenance_requests` table.

### `work_orders`, `inventory`, `maintenance_parts_usage`, `maintenance_history`
Track technician work, spare parts, costs, and historical maintenance records.

### `notifications`, `preventive_schedules`
Support user messages and planned asset servicing.

## Setup

Run `backend/setup.php` or import `database/init.sql` in phpMyAdmin.

Default credentials:

- Admin: `ADMIN001` / `admin123`
- Student: `DBU2024001` / `admin123`
- Technician: `DBU2024002` / `admin123`
