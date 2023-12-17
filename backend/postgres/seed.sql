-- Users

INSERT INTO public.user (name, nick_name) VALUES ('Ringo', 'Starrman');
INSERT INTO public.user (name, nick_name) VALUES ('John', 'GlassesGuru');
INSERT INTO public.user (name, nick_name) VALUES ('Paul', 'BassBoss');
INSERT INTO public.user (name, nick_name) VALUES ('George', 'QuietRocker');
INSERT INTO public.user (name, nick_name) VALUES ('Mick', 'JumpingJack');
INSERT INTO public.user (name, nick_name) VALUES ('Keith', 'GuitarHero');
INSERT INTO public.user (name, nick_name) VALUES ('Freddie', 'QueenBee');
INSERT INTO public.user (name, nick_name) VALUES ('Brian', 'AstroRocker');
INSERT INTO public.user (name, nick_name) VALUES ('Roger', 'DrumDynamo');
INSERT INTO public.user (name, nick_name) VALUES ('David', 'SpaceOddity');

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