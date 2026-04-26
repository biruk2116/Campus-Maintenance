# Database Schema Details

## `users`
Stores all registered accounts.

Main fields:
- `id`: primary key
- `user_code`: unique login ID
- `name`: full name
- `email`: email address
- `phone_number`: phone number
- `password`: hashed password
- `role`: `admin`, `student`, or `technician`
- `status`: `active` or `inactive`
- `skills`: technician ability
- `must_change_password`: forces password update on next login
- `created_at`, `updated_at`: audit timestamps

## `requests`
Stores every maintenance request with the current live links and request snapshots.

Main fields:
- `student_id`: live link to the student account
- `technician_id`: live link to the assigned technician
- `title`, `description`, `category`
- `dorm`, `block`, `location`
- `priority`, `status`, `progress_percentage`
- `admin_seen`, `tech_seen`, `student_seen`
- `student_hidden`

Student snapshot fields:
- `student_name_snapshot`
- `student_code_snapshot`
- `student_phone_snapshot`
- `student_email_snapshot`

Technician snapshot fields:
- `technician_name_snapshot`
- `technician_code_snapshot`
- `technician_phone_snapshot`
- `technician_email_snapshot`
- `technician_skills_snapshot`

These snapshot fields preserve history even if a user is later deleted.

## `maintenance_logs`
Stores the full request timeline.

Main fields:
- `request_id`: request being updated
- `user_id`: live link to the actor when still present
- `actor_name`, `actor_role`, `actor_code`: preserved actor snapshot
- `action_taken`
- `remarks`
- `progress_percentage`
- `created_at`

## `request_attachments`
Stores files that belong to a request directly in the database.

Main fields:
- `request_id`: request owner
- `uploaded_by_user_id`: live uploader link
- `uploader_name_snapshot`, `uploader_role_snapshot`, `uploader_code_snapshot`
- `file_name`
- `file_extension`
- `mime_type`
- `file_category`
- `file_size_bytes`
- `file_description`
- `file_data`: binary file content as `LONGBLOB`
- `created_at`

## `user_files`
Stores files that belong to a user directly in the database.

Main fields:
- `user_id`: live user link
- `owner_name_snapshot`, `owner_role_snapshot`, `owner_code_snapshot`
- `file_name`
- `file_extension`
- `mime_type`
- `file_category`
- `file_size_bytes`
- `file_description`
- `file_data`: binary file content as `LONGBLOB`
- `created_at`

## Placement Summary
- User account details go in `users`
- Maintenance request details go in `requests`
- Request progress history goes in `maintenance_logs`
- Request-related uploaded files go in `request_attachments`
- User-related files go in `user_files`
