-- Users

INSERT INTO public.user (name, nick_name, oauth_provider_id, email, is_two_factor_authentication_enabled, two_factor_authentication_secret, avatar)
VALUES
('Goku Son', 'Kakarot', 65192, 'goku.son@dbzuniverse.com', false, '', ''),
('Naruto Uzumaki', 'Hokage', 65193, 'naruto.uzumaki@konohagakure.com', false, '', ''),
('Sailor Moon', 'MoonPrincess', 65194, 'sailor.moon@silvermilkyway.com', false, '', ''),
('Spike Spiegel', 'SpaceCowboy', 65195, 'spike.spiegel@bebopship.com', false, '', ''),
('Luffy Monkey D.', 'StrawHat', 65196, 'luffy.monkey@grandlineadventures.com', false, '', '');

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


-- Match History

INSERT INTO game_history (status, player_one_id, player_two_id, player_one_score, player_two_score, winner_id, created_at, updated_at) VALUES (2, 1, 2, 4, 6, 2, '2023-07-31 17:07:38', '2023-07-14 10:40:22');
INSERT INTO game_history (status, player_one_id, player_two_id, player_one_score, player_two_score, winner_id, created_at, updated_at) VALUES (2, 1, 3, 5, 10, 1, '2023-05-25 02:10:25', '2023-03-28 15:37:36');
INSERT INTO game_history (status, player_one_id, player_two_id, player_one_score, player_two_score, winner_id, created_at, updated_at) VALUES (2, 1, 4, 0, 7, 4, '2023-12-04 11:05:04', '2023-12-09 10:24:16');
INSERT INTO game_history (status, player_one_id, player_two_id, player_one_score, player_two_score, winner_id, created_at, updated_at) VALUES (2, 1, 6, 9, 2, 6, '2023-03-17 01:37:55', '2023-01-14 09:48:19');
INSERT INTO game_history (status, player_one_id, player_two_id, player_one_score, player_two_score, winner_id, created_at, updated_at) VALUES (2, 1, 3, 0, 0, 1, '2023-03-28 06:32:08', '2023-04-01 11:23:07');
INSERT INTO game_history (status, player_one_id, player_two_id, player_one_score, player_two_score, winner_id, created_at, updated_at) VALUES (2, 1, 8, 5, 1, 1, '2023-08-01 07:07:24', '2023-04-06 04:40:38');
INSERT INTO game_history (status, player_one_id, player_two_id, player_one_score, player_two_score, winner_id, created_at, updated_at) VALUES (2, 1, 10, 10, 3, 1, '2023-06-06 16:25:51', '2023-05-07 17:20:55');
INSERT INTO game_history (status, player_one_id, player_two_id, player_one_score, player_two_score, winner_id, created_at, updated_at) VALUES (2, 1, 3, 0, 4, 3, '2023-07-01 22:11:41', '2023-10-11 03:56:18');
INSERT INTO game_history (status, player_one_id, player_two_id, player_one_score, player_two_score, winner_id, created_at, updated_at) VALUES (2, 1, 7, 0, 4, 7, '2023-05-14 21:24:40', '2023-06-26 08:05:08');
INSERT INTO game_history (status, player_one_id, player_two_id, player_one_score, player_two_score, winner_id, created_at, updated_at) VALUES (2, 1, 4, 0, 1, 4, '2023-01-15 08:59:36', '2023-12-25 15:02:44');
