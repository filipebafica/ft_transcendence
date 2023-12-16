-- Users

INSERT INTO public.user (name) VALUES ('Ringo');
INSERT INTO public.user (name) VALUES ('John');
INSERT INTO public.user (name) VALUES ('Paul');
INSERT INTO public.user (name) VALUES ('George');
INSERT INTO public.user (name) VALUES ('Mick');
INSERT INTO public.user (name) VALUES ('Keith');
INSERT INTO public.user (name) VALUES ('Freddie');
INSERT INTO public.user (name) VALUES ('Brian');
INSERT INTO public.user (name) VALUES ('Roger');
INSERT INTO public.user (name) VALUES ('David');

-- Friends

INSERT INTO friend (friend_user_id, user_id) VALUES (1, 2);
INSERT INTO friend (friend_user_id, user_id) VALUES (2, 3);
INSERT INTO friend (friend_user_id, user_id) VALUES (1, 4);
INSERT INTO friend (friend_user_id, user_id) VALUES (4, 5);
INSERT INTO friend (friend_user_id, user_id) VALUES (5, 6);
INSERT INTO friend (friend_user_id, user_id) VALUES (1, 7);
INSERT INTO friend (friend_user_id, user_id) VALUES (7, 8);
INSERT INTO friend (friend_user_id, user_id) VALUES (8, 9);
INSERT INTO friend (friend_user_id, user_id) VALUES (9, 10);
INSERT INTO friend (friend_user_id, user_id) VALUES (10, 1);
INSERT INTO friend (friend_user_id, user_id) VALUES (2, 1);
INSERT INTO friend (friend_user_id, user_id) VALUES (3, 1);
INSERT INTO friend (friend_user_id, user_id) VALUES (4, 1);