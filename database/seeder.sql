INSERT INTO users (name, email, password, role)
VALUES 
('Admin', 'admin@example.com', '$2a$10$q5CM7J9MgYHxKTxU7kvKuOhq4sLNegENaimB81p6qZWUj2tzhn2xi', 'admin'),
('User', 'user@example.com', '$2a$10$q5CM7J9MgYHxKTxU7kvKuOhq4sLNegENaimB81p6qZWUj2tzhn2xi', 'user');

INSERT INTO books (title, author, isbn, photo, is_available) VALUES
('Clean Code', 'Robert C. Martin', '9780132350884', '/uploads/5c870a5d-5d61-4b07-b19b-8addc5b01e8b_fd3d42961d8516d4ec63666b00cea8da.jpg', TRUE),
('The Pragmatic Programmer', 'Andy Hunt', '9780201616224', '/uploads/5c870a5d-5d61-4b07-b19b-8addc5b01e8b_fd3d42961d8516d4ec63666b00cea8da.jpg', TRUE),
('You Dont Know JS', 'Kyle Simpson', '9781491904244', '/uploads/5c870a5d-5d61-4b07-b19b-8addc5b01e8b_fd3d42961d8516d4ec63666b00cea8da.jpg', TRUE);
