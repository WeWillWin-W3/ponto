INSERT INTO 
    "User" ("id", "email", "password", "name", "user_role")
VALUES 
    (1, 'jorge.dullius.19@gmail.com', '$2b$04$f1mxXumrK0eqKBTybvk4reDxDhHkEdS8.2ZbudTJL6LlycJgIeUvK', 'Jorge Dullius', 'admin'),
    (2, 'eu@llbarbosas.dev', '$2b$04$pEmj17ECtA1OxGzF.P3kNO92dAlpcJkSv3MMVmHKMus5qaP8.AUmC', 'Lucas Barbosa', 'basic'),
    (3, 'carloseduardo.diasgiacomini@gmail.com', '$2b$04$R6PcHWO9xUZf.lBENjTYme9bgoPPYyyE/8yDZgwQtA5323t4MiBUe', 'Carlos Giacomini', 'basic'),
    (4, 'olucasmoro@gmail.com', '$2b$04$dJYHgJsvSLV1SeWCo3StrOSHV5wLMOUGFWqorjb4wJnWIZMlzxF8i', 'Lucas Moro', 'manager');

SELECT setval('"User_id_seq"', 4);

INSERT INTO "Company" ("id", "name") 
VALUES 
    (1, 'w3');

SELECT setval('"Company_id_seq"', 1);

INSERT INTO 
    "Employee" ("id", "user", "company")
VALUES 
    (1, 1, 1),
    (2, 2, 1),
    (3, 3, 1),
    (4, 4, 1);

SELECT setval('"Employee_id_seq"', 4);

INSERT INTO "WorkSchedule" ("id", "description", "workable") 
VALUES 
    (1, 'Desenvolvedor Android 40h/semanais', TRUE),
    (2, 'Desenvolvedor Android 20h/semanais', TRUE),
    (3, 'Desenvolvedor front-end 40h/semanais', TRUE),
    (4, 'Desenvolvedor back-end 20h/semanais', TRUE),
    (5, 'Horário noturno', FALSE),
    (6, 'Final de semana', FALSE);

SELECT setval('"WorkSchedule_id_seq"', 6);

INSERT INTO "WorkScheduleEmployee" ("work_schedule", "employee") 
VALUES 
    (1,1), (2,4), (3,3), (4,2),
    (5,1), (5,2), (5,3), (5,4),
    (6,1), (6,2), (6,3), (6,4);

INSERT INTO 
    "TimeRange" ("id", "start", "end") 
VALUES
    (1, '07:30', '12:30'),
    (2, '13:30', '16:30'),
    (3, '08:00', '12:00'),
    (4, '13:00', '17:00'),
    (5, '19:00', '07:00'),
    (6, '00:00', '24:00');

SELECT setval('"TimeRange_id_seq"', 6);

INSERT INTO 
    "WorkScheduleTimeRange" ("work_schedule", "time_range", "repeat_days") 
VALUES
    (1, 1, B'0111110'),
    (1, 2, B'0111110'),
    (2, 3, B'0111110'),
    (3, 1, B'0111110'),
    (3, 2, B'0111110'),
    (4, 4, B'0111110'),
    (5, 5, B'0111110'),
    (6, 6, B'1000001');

INSERT INTO 
    "Attendance" ("id", "time", "description", "employee") 
VALUES
    (1, '2021-08-01 07:30:00', NULL, 1),
    (2, '2021-08-01 12:30:00', NULL, 1),
    (3, '2021-08-01 13:30:00', NULL, 1),
    (4, '2021-08-01 16:30:00', NULL, 1),
    (5, '2021-08-02 07:30:00', NULL, 1),
    (6, '2021-08-02 12:30:00', NULL, 1),
    (7, '2021-08-02 13:30:00', NULL, 1),
    (8, '2021-08-02 16:30:00', NULL, 1),
    (9, '2021-08-03 07:30:00', NULL, 1),
    (10, '2021-08-03 12:30:00', NULL, 1),
    (11, '2021-08-03 13:30:00', NULL, 1),
    (12, '2021-08-03 16:30:00', NULL, 1),
    (13, '2021-08-04 07:30:00', NULL, 1),
    (14, '2021-08-04 12:30:00', NULL, 1),
    (15, '2021-08-04 13:30:00', NULL, 1),
    (16, '2021-08-04 16:30:00', NULL, 1),
    (17, '2021-08-05 07:30:00', NULL, 1),
    (18, '2021-08-05 12:30:00', NULL, 1),
    (19, '2021-08-05 13:30:00', NULL, 1),
    (20, '2021-08-05 16:30:00', NULL, 1),
    (21, '2021-08-06 07:30:00', NULL, 1),
    (22, '2021-08-06 12:30:00', NULL, 1),
    (23, '2021-08-06 13:30:00', NULL, 1),
    (24, '2021-08-06 16:30:00', NULL, 1),
    (25, '2021-08-07 07:30:00', NULL, 1),
    (26, '2021-08-07 12:30:00', NULL, 1),
    (27, '2021-08-07 13:30:00', NULL, 1),
    (28, '2021-08-07 16:30:00', NULL, 1),
    (29, '2021-08-08 07:30:00', NULL, 1),
    (30, '2021-08-08 12:30:00', NULL, 1),
    (31, '2021-08-08 13:30:00', NULL, 1),
    (32, '2021-08-08 16:30:00', NULL, 1),
    (33, '2021-08-09 07:30:00', NULL, 1),
    (34, '2021-08-09 12:30:00', NULL, 1),
    (35, '2021-08-09 13:30:00', NULL, 1),
    (36, '2021-08-09 16:30:00', NULL, 1),
    (37, '2021-08-10 07:30:00', NULL, 1),
    (38, '2021-08-10 12:30:00', NULL, 1),
    (39, '2021-08-10 13:30:00', NULL, 1),
    (40, '2021-08-10 16:30:00', NULL, 1),
    (41, '2021-08-11 07:30:00', NULL, 1),
    (42, '2021-08-11 12:30:00', NULL, 1),
    (43, '2021-08-11 13:30:00', NULL, 1),
    (44, '2021-08-11 16:30:00', NULL, 1),
    (45, '2021-08-12 07:30:00', NULL, 1),
    (46, '2021-08-12 12:30:00', NULL, 1),
    (47, '2021-08-12 13:30:00', NULL, 1),
    (48, '2021-08-12 16:30:00', NULL, 1),
    (49, '2021-08-13 07:30:00', NULL, 1),
    (50, '2021-08-13 12:30:00', NULL, 1),
    (51, '2021-08-13 13:30:00', NULL, 1),
    (52, '2021-08-13 16:30:00', NULL, 1),
    (53, '2021-08-14 07:30:00', NULL, 1),
    (54, '2021-08-14 12:30:00', NULL, 1),
    (55, '2021-08-14 13:30:00', NULL, 1),
    (56, '2021-08-14 16:30:00', NULL, 1),
    (57, '2021-08-15 07:30:00', NULL, 1),
    (58, '2021-08-15 12:30:00', NULL, 1),
    (59, '2021-08-15 13:30:00', NULL, 1),
    (60, '2021-08-15 16:30:00', NULL, 1),
    (61, '2021-08-16 07:30:00', NULL, 1),
    (62, '2021-08-16 12:30:00', NULL, 1),
    (63, '2021-08-16 13:30:00', NULL, 1),
    (64, '2021-08-16 16:30:00', NULL, 1),
    (65, '2021-08-17 07:30:00', NULL, 1),
    (66, '2021-08-17 12:30:00', NULL, 1),
    (67, '2021-08-17 13:30:00', NULL, 1),
    (68, '2021-08-17 16:30:00', NULL, 1),
    (69, '2021-08-18 07:30:00', NULL, 1),
    (70, '2021-08-18 12:30:00', NULL, 1),
    (71, '2021-08-18 13:30:00', NULL, 1),
    (72, '2021-08-18 16:30:00', NULL, 1),
    (73, '2021-08-19 07:30:00', NULL, 1),
    (74, '2021-08-19 12:30:00', NULL, 1),
    (75, '2021-08-19 13:30:00', NULL, 1),
    (76, '2021-08-19 16:30:00', NULL, 1),
    (77, '2021-08-20 07:30:00', NULL, 1),
    (78, '2021-08-20 12:30:00', NULL, 1),
    (79, '2021-08-20 13:30:00', NULL, 1),
    (80, '2021-08-20 16:30:00', NULL, 1),
    (81, '2021-08-21 07:30:00', NULL, 1),
    (82, '2021-08-21 12:30:00', NULL, 1),
    (83, '2021-08-21 13:30:00', NULL, 1),
    (84, '2021-08-21 16:30:00', NULL, 1),
    (85, '2021-08-22 07:30:00', NULL, 1),
    (86, '2021-08-22 12:30:00', NULL, 1),
    (87, '2021-08-22 13:30:00', NULL, 1),
    (88, '2021-08-22 16:30:00', NULL, 1),
    (89, '2021-08-23 07:30:00', NULL, 1),
    (90, '2021-08-23 12:30:00', NULL, 1),
    (91, '2021-08-23 13:30:00', NULL, 1),
    (92, '2021-08-23 16:30:00', NULL, 1),
    (93, '2021-08-24 07:30:00', NULL, 1),
    (94, '2021-08-24 12:30:00', NULL, 1),
    (95, '2021-08-24 13:30:00', NULL, 1),
    (96, '2021-08-24 16:30:00', NULL, 1),
    (97, '2021-08-25 07:30:00', NULL, 1),
    (98, '2021-08-25 12:30:00', NULL, 1),
    (99, '2021-08-25 13:30:00', NULL, 1),
    (100, '2021-08-25 16:30:00', NULL, 1),
    (101, '2021-08-26 07:30:00', NULL, 1),
    (102, '2021-08-26 12:30:00', NULL, 1),
    (103, '2021-08-26 13:30:00', NULL, 1),
    (104, '2021-08-26 16:30:00', NULL, 1),
    (105, '2021-08-27 07:30:00', NULL, 1),
    (106, '2021-08-27 12:30:00', NULL, 1),
    (107, '2021-08-27 13:30:00', NULL, 1),
    (108, '2021-08-27 16:30:00', NULL, 1),
    (109, '2021-08-28 07:30:00', NULL, 1),
    (110, '2021-08-28 12:30:00', NULL, 1),
    (111, '2021-08-28 13:30:00', NULL, 1),
    (112, '2021-08-28 16:30:00', NULL, 1),
    (113, '2021-08-29 07:30:00', NULL, 1),
    (114, '2021-08-29 12:30:00', NULL, 1),
    (115, '2021-08-29 13:30:00', NULL, 1),
    (116, '2021-08-29 16:30:00', NULL, 1),
    (117, '2021-08-30 07:30:00', NULL, 1),
    (118, '2021-08-30 12:30:00', NULL, 1),
    (119, '2021-08-30 13:30:00', NULL, 1),
    (120, '2021-08-30 16:30:00', NULL, 1),
    (121, '2021-08-31 07:30:00', NULL, 1),
    (122, '2021-08-31 12:30:00', NULL, 1),
    (123, '2021-08-31 13:30:00', NULL, 1),
    (124, '2021-08-31 16:30:00', NULL, 1),
    (125, '2021-08-01 13:00:00', NULL, 2),
    (126, '2021-08-01 17:00:00', NULL, 2),
    (127, '2021-08-02 13:00:00', NULL, 2),
    (128, '2021-08-02 17:00:00', NULL, 2),
    (129, '2021-08-03 13:00:00', NULL, 2),
    (130, '2021-08-03 17:00:00', NULL, 2),
    (131, '2021-08-04 13:00:00', NULL, 2),
    (132, '2021-08-04 17:00:00', NULL, 2),
    (133, '2021-08-05 13:00:00', NULL, 2),
    (134, '2021-08-05 17:00:00', NULL, 2),
    (135, '2021-08-06 13:00:00', NULL, 2),
    (136, '2021-08-06 17:00:00', NULL, 2),
    (137, '2021-08-07 13:00:00', NULL, 2),
    (138, '2021-08-07 17:00:00', NULL, 2),
    (139, '2021-08-08 13:00:00', NULL, 2),
    (140, '2021-08-08 17:00:00', NULL, 2),
    (141, '2021-08-09 13:00:00', NULL, 2),
    (142, '2021-08-09 17:00:00', NULL, 2),
    (143, '2021-08-10 13:00:00', NULL, 2),
    (144, '2021-08-10 17:00:00', NULL, 2),
    (145, '2021-08-11 13:00:00', NULL, 2),
    (146, '2021-08-11 17:00:00', NULL, 2),
    (147, '2021-08-12 13:00:00', NULL, 2),
    (148, '2021-08-12 17:00:00', NULL, 2),
    (149, '2021-08-13 13:00:00', NULL, 2),
    (150, '2021-08-13 17:00:00', NULL, 2),
    (151, '2021-08-14 13:00:00', NULL, 2),
    (152, '2021-08-14 17:00:00', NULL, 2),
    (153, '2021-08-15 13:00:00', NULL, 2),
    (154, '2021-08-15 17:00:00', NULL, 2),
    (155, '2021-08-16 13:00:00', NULL, 2),
    (156, '2021-08-16 17:00:00', NULL, 2),
    (157, '2021-08-17 13:00:00', NULL, 2),
    (158, '2021-08-17 17:00:00', NULL, 2),
    (159, '2021-08-18 13:00:00', NULL, 2),
    (160, '2021-08-18 17:00:00', NULL, 2),
    (161, '2021-08-19 13:00:00', NULL, 2),
    (162, '2021-08-19 17:00:00', NULL, 2),
    (163, '2021-08-20 13:00:00', NULL, 2),
    (164, '2021-08-20 17:00:00', NULL, 2),
    (165, '2021-08-21 13:00:00', NULL, 2),
    (166, '2021-08-21 17:00:00', NULL, 2),
    (167, '2021-08-22 13:00:00', NULL, 2),
    (168, '2021-08-22 17:00:00', NULL, 2),
    (169, '2021-08-23 13:00:00', NULL, 2),
    (170, '2021-08-23 17:00:00', NULL, 2),
    (171, '2021-08-24 13:00:00', NULL, 2),
    (172, '2021-08-24 17:00:00', NULL, 2),
    (173, '2021-08-25 13:00:00', NULL, 2),
    (174, '2021-08-25 17:00:00', NULL, 2),
    (175, '2021-08-26 13:00:00', NULL, 2),
    (176, '2021-08-26 17:00:00', NULL, 2),
    (177, '2021-08-27 13:00:00', NULL, 2),
    (178, '2021-08-27 17:00:00', NULL, 2),
    (179, '2021-08-28 13:00:00', NULL, 2),
    (180, '2021-08-28 17:00:00', NULL, 2),
    (181, '2021-08-29 13:00:00', NULL, 2),
    (182, '2021-08-29 17:00:00', NULL, 2),
    (183, '2021-08-30 13:00:00', NULL, 2),
    (184, '2021-08-30 17:00:00', NULL, 2),
    (185, '2021-08-31 13:00:00', NULL, 2),
    (186, '2021-08-31 17:00:00', NULL, 2),
    (187, '2021-08-01 07:30:00', NULL, 3),
    (188, '2021-08-01 12:30:00', NULL, 3),
    (189, '2021-08-01 13:30:00', NULL, 3),
    (190, '2021-08-01 16:30:00', NULL, 3),
    (191, '2021-08-02 07:30:00', NULL, 3),
    (192, '2021-08-02 12:30:00', NULL, 3),
    (193, '2021-08-02 13:30:00', NULL, 3),
    (194, '2021-08-02 16:30:00', NULL, 3),
    (195, '2021-08-03 07:30:00', NULL, 3),
    (196, '2021-08-03 12:30:00', NULL, 3),
    (197, '2021-08-03 13:30:00', NULL, 3),
    (198, '2021-08-03 16:30:00', NULL, 3),
    (199, '2021-08-04 07:30:00', NULL, 3),
    (200, '2021-08-04 12:30:00', NULL, 3),
    (201, '2021-08-04 13:30:00', NULL, 3),
    (202, '2021-08-04 16:30:00', NULL, 3),
    (203, '2021-08-05 07:30:00', NULL, 3),
    (204, '2021-08-05 12:30:00', NULL, 3),
    (205, '2021-08-05 13:30:00', NULL, 3),
    (206, '2021-08-05 16:30:00', NULL, 3),
    (207, '2021-08-06 07:30:00', NULL, 3),
    (208, '2021-08-06 12:30:00', NULL, 3),
    (209, '2021-08-06 13:30:00', NULL, 3),
    (210, '2021-08-06 16:30:00', NULL, 3),
    (211, '2021-08-07 07:30:00', NULL, 3),
    (212, '2021-08-07 12:30:00', NULL, 3),
    (213, '2021-08-07 13:30:00', NULL, 3),
    (214, '2021-08-07 16:30:00', NULL, 3),
    (215, '2021-08-08 07:30:00', NULL, 3),
    (216, '2021-08-08 12:30:00', NULL, 3),
    (217, '2021-08-08 13:30:00', NULL, 3),
    (218, '2021-08-08 16:30:00', NULL, 3),
    (219, '2021-08-09 07:30:00', NULL, 3),
    (220, '2021-08-09 12:30:00', NULL, 3),
    (221, '2021-08-09 13:30:00', NULL, 3),
    (222, '2021-08-09 16:30:00', NULL, 3),
    (223, '2021-08-10 07:30:00', NULL, 3),
    (224, '2021-08-10 12:30:00', NULL, 3),
    (225, '2021-08-10 13:30:00', NULL, 3),
    (226, '2021-08-10 16:30:00', NULL, 3),
    (227, '2021-08-11 07:30:00', NULL, 3),
    (228, '2021-08-11 12:30:00', NULL, 3),
    (229, '2021-08-11 13:30:00', NULL, 3),
    (230, '2021-08-11 16:30:00', NULL, 3),
    (231, '2021-08-12 07:30:00', NULL, 3),
    (232, '2021-08-12 12:30:00', NULL, 3),
    (233, '2021-08-12 13:30:00', NULL, 3),
    (234, '2021-08-12 16:30:00', NULL, 3),
    (235, '2021-08-13 07:30:00', NULL, 3),
    (236, '2021-08-13 12:30:00', NULL, 3),
    (237, '2021-08-13 13:30:00', NULL, 3),
    (238, '2021-08-13 16:30:00', NULL, 3),
    (239, '2021-08-14 07:30:00', NULL, 3),
    (240, '2021-08-14 12:30:00', NULL, 3),
    (241, '2021-08-14 13:30:00', NULL, 3),
    (242, '2021-08-14 16:30:00', NULL, 3),
    (243, '2021-08-15 07:30:00', NULL, 3),
    (244, '2021-08-15 12:30:00', NULL, 3),
    (245, '2021-08-15 13:30:00', NULL, 3),
    (246, '2021-08-15 16:30:00', NULL, 3),
    (247, '2021-08-16 07:30:00', NULL, 3),
    (248, '2021-08-16 12:30:00', NULL, 3),
    (249, '2021-08-16 13:30:00', NULL, 3),
    (250, '2021-08-16 16:30:00', NULL, 3),
    (251, '2021-08-17 07:30:00', NULL, 3),
    (252, '2021-08-17 12:30:00', NULL, 3),
    (253, '2021-08-17 13:30:00', NULL, 3),
    (254, '2021-08-17 16:30:00', NULL, 3),
    (255, '2021-08-18 07:30:00', NULL, 3),
    (256, '2021-08-18 12:30:00', NULL, 3),
    (257, '2021-08-18 13:30:00', NULL, 3),
    (258, '2021-08-18 16:30:00', NULL, 3),
    (259, '2021-08-19 07:30:00', NULL, 3),
    (260, '2021-08-19 12:30:00', NULL, 3),
    (261, '2021-08-19 13:30:00', NULL, 3),
    (262, '2021-08-19 16:30:00', NULL, 3),
    (263, '2021-08-20 07:30:00', NULL, 3),
    (264, '2021-08-20 12:30:00', NULL, 3),
    (265, '2021-08-20 13:30:00', NULL, 3),
    (266, '2021-08-20 16:30:00', NULL, 3),
    (267, '2021-08-21 07:30:00', NULL, 3),
    (268, '2021-08-21 12:30:00', NULL, 3),
    (269, '2021-08-21 13:30:00', NULL, 3),
    (270, '2021-08-21 16:30:00', NULL, 3),
    (271, '2021-08-22 07:30:00', NULL, 3),
    (272, '2021-08-22 12:30:00', NULL, 3),
    (273, '2021-08-22 13:30:00', NULL, 3),
    (274, '2021-08-22 16:30:00', NULL, 3),
    (275, '2021-08-23 07:30:00', NULL, 3),
    (276, '2021-08-23 12:30:00', NULL, 3),
    (277, '2021-08-23 13:30:00', NULL, 3),
    (278, '2021-08-23 16:30:00', NULL, 3),
    (279, '2021-08-24 07:30:00', NULL, 3),
    (280, '2021-08-24 12:30:00', NULL, 3),
    (281, '2021-08-24 13:30:00', NULL, 3),
    (282, '2021-08-24 16:30:00', NULL, 3),
    (283, '2021-08-25 07:30:00', NULL, 3),
    (284, '2021-08-25 12:30:00', NULL, 3),
    (285, '2021-08-25 13:30:00', NULL, 3),
    (286, '2021-08-25 16:30:00', NULL, 3),
    (287, '2021-08-26 07:30:00', NULL, 3),
    (288, '2021-08-26 12:30:00', NULL, 3),
    (289, '2021-08-26 13:30:00', NULL, 3),
    (290, '2021-08-26 16:30:00', NULL, 3),
    (291, '2021-08-27 07:30:00', NULL, 3),
    (292, '2021-08-27 12:30:00', NULL, 3),
    (293, '2021-08-27 13:30:00', NULL, 3),
    (294, '2021-08-27 16:30:00', NULL, 3),
    (295, '2021-08-28 07:30:00', NULL, 3),
    (296, '2021-08-28 12:30:00', NULL, 3),
    (297, '2021-08-28 13:30:00', NULL, 3),
    (298, '2021-08-28 16:30:00', NULL, 3),
    (299, '2021-08-29 07:30:00', NULL, 3),
    (300, '2021-08-29 12:30:00', NULL, 3),
    (301, '2021-08-29 13:30:00', NULL, 3),
    (302, '2021-08-29 16:30:00', NULL, 3),
    (303, '2021-08-30 07:30:00', NULL, 3),
    (304, '2021-08-30 12:30:00', NULL, 3),
    (305, '2021-08-30 13:30:00', NULL, 3),
    (306, '2021-08-30 16:30:00', NULL, 3),
    (307, '2021-08-31 07:30:00', NULL, 3),
    (308, '2021-08-31 12:30:00', NULL, 3),
    (309, '2021-08-31 13:30:00', NULL, 3),
    (310, '2021-08-31 16:30:00', NULL, 3),
    (311, '2021-08-01 08:00:00', NULL, 4),
    (312, '2021-08-01 12:00:00', NULL, 4),
    (313, '2021-08-02 08:00:00', NULL, 4),
    (314, '2021-08-02 12:00:00', NULL, 4),
    (315, '2021-08-03 08:00:00', NULL, 4),
    (316, '2021-08-03 12:00:00', NULL, 4),
    (317, '2021-08-04 08:00:00', NULL, 4),
    (318, '2021-08-04 12:00:00', NULL, 4),
    (319, '2021-08-05 08:00:00', NULL, 4),
    (320, '2021-08-05 12:00:00', NULL, 4),
    (321, '2021-08-06 08:00:00', NULL, 4),
    (322, '2021-08-06 12:00:00', NULL, 4),
    (323, '2021-08-07 08:00:00', NULL, 4),
    (324, '2021-08-07 12:00:00', NULL, 4),
    (325, '2021-08-08 08:00:00', NULL, 4),
    (326, '2021-08-08 12:00:00', NULL, 4),
    (327, '2021-08-09 08:00:00', NULL, 4),
    (328, '2021-08-09 12:00:00', NULL, 4),
    (329, '2021-08-10 08:00:00', NULL, 4),
    (330, '2021-08-10 12:00:00', NULL, 4),
    (331, '2021-08-11 08:00:00', NULL, 4),
    (332, '2021-08-11 12:00:00', NULL, 4),
    (333, '2021-08-12 08:00:00', NULL, 4),
    (334, '2021-08-12 12:00:00', NULL, 4),
    (335, '2021-08-13 08:00:00', NULL, 4),
    (336, '2021-08-13 12:00:00', NULL, 4),
    (337, '2021-08-14 08:00:00', NULL, 4),
    (338, '2021-08-14 12:00:00', NULL, 4),
    (339, '2021-08-15 08:00:00', NULL, 4),
    (340, '2021-08-15 12:00:00', NULL, 4),
    (341, '2021-08-16 08:00:00', NULL, 4),
    (342, '2021-08-16 12:00:00', NULL, 4),
    (343, '2021-08-17 08:00:00', NULL, 4),
    (344, '2021-08-17 12:00:00', NULL, 4),
    (345, '2021-08-18 08:00:00', NULL, 4),
    (346, '2021-08-18 12:00:00', NULL, 4),
    (347, '2021-08-19 08:00:00', NULL, 4),
    (348, '2021-08-19 12:00:00', NULL, 4),
    (349, '2021-08-20 08:00:00', NULL, 4),
    (350, '2021-08-20 12:00:00', NULL, 4),
    (351, '2021-08-21 08:00:00', NULL, 4),
    (352, '2021-08-21 12:00:00', NULL, 4),
    (353, '2021-08-22 08:00:00', NULL, 4),
    (354, '2021-08-22 12:00:00', NULL, 4),
    (355, '2021-08-23 08:00:00', NULL, 4),
    (356, '2021-08-23 12:00:00', NULL, 4),
    (357, '2021-08-24 08:00:00', NULL, 4),
    (358, '2021-08-24 12:00:00', NULL, 4),
    (359, '2021-08-25 08:00:00', NULL, 4),
    (360, '2021-08-25 12:00:00', NULL, 4),
    (361, '2021-08-26 08:00:00', NULL, 4),
    (362, '2021-08-26 12:00:00', NULL, 4),
    (363, '2021-08-27 08:00:00', NULL, 4),
    (364, '2021-08-27 12:00:00', NULL, 4),
    (365, '2021-08-28 08:00:00', NULL, 4),
    (366, '2021-08-28 12:00:00', NULL, 4),
    (367, '2021-08-29 08:00:00', NULL, 4),
    (368, '2021-08-29 12:00:00', NULL, 4),
    (369, '2021-08-30 08:00:00', NULL, 4),
    (370, '2021-08-30 12:00:00', NULL, 4),
    (371, '2021-08-31 08:00:00', NULL, 4),
    (372, '2021-08-31 12:00:00', NULL, 4);

SELECT setval('"Attendance_id_seq"', 372);
