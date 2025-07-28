PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `artwork` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text,
  	`image_id` integer,
  	`series` text,
  	`year` numeric,
  	`description` text,
  	`medium` text,
  	`dimensions` text,
  	`location` text,
  	`camera` text,
  	`lens` text,
  	`settings_aperture` text,
  	`settings_shutter` text,
  	`settings_iso` numeric,
  	`featured` integer DEFAULT false,
  	`published_at` text,
  	`slug` text,
  	`slug_lock` integer DEFAULT true,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`_status` text DEFAULT 'draft',
  	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
INSERT INTO artwork VALUES(2,'Alien Superstar',1,NULL,2024,'Make Up: Julia Noel, @julia.lise on Instagram.','Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-11T03:20:02.150Z','alien-superstar',1,'2025-07-27T18:58:47.574Z','2025-07-11T03:18:18.373Z','published');
INSERT INTO artwork VALUES(3,'Transcendence',4,'A Man Like Any Other',2024,'','Digital Photography and Collage','','','','','','',NULL,1,'2025-07-11T12:00:00.000Z','transcendence',1,'2025-07-27T19:02:40.954Z','2025-07-11T23:13:23.563Z','published');
INSERT INTO artwork VALUES(4,'Sell the Public Flowers',6,'A Man Like Any Other',2024,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:31:21.938Z','sell-the-public-flowers',1,'2025-07-27T19:03:07.102Z','2025-07-27T18:30:43.157Z','published');
INSERT INTO artwork VALUES(5,'Love Pink',7,NULL,2025,'','Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:40:58.704Z','love-pink',1,'2025-07-27T19:00:29.007Z','2025-07-27T18:31:35.315Z','published');
INSERT INTO artwork VALUES(6,'Pics Bro?',8,'Censorship',2025,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:48:08.126Z','pics-bro',1,'2025-07-27T19:01:20.014Z','2025-07-27T18:41:06.337Z','published');
INSERT INTO artwork VALUES(7,'Coyote Jock',9,'',2025,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:49:03.212Z','coyote-jock',1,'2025-07-27T19:03:36.606Z','2025-07-27T18:48:16.974Z','published');
INSERT INTO artwork VALUES(8,'Soft Exploration in Identity',10,'EXTRA',2023,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:52:35.641Z','soft-exploration-in-identity',1,'2025-07-27T19:01:39.280Z','2025-07-27T18:49:13.309Z','published');
INSERT INTO artwork VALUES(9,'Enlightenment',11,'A Man Like Any Other',2024,NULL,'Digital Photography, Collage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T19:05:44.274Z','enlightenment',1,'2025-07-27T19:05:44.276Z','2025-07-27T19:03:47.439Z','published');
INSERT INTO artwork VALUES(10,'Metamorphosis',12,'A Man Like Any Other',2024,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T19:06:39.310Z','metamorphosis',1,'2025-07-27T19:06:39.314Z','2025-07-27T19:05:49.839Z','published');
INSERT INTO artwork VALUES(11,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2025-07-27T19:06:53.958Z','2025-07-27T19:06:53.961Z','draft');
CREATE TABLE IF NOT EXISTS `_artwork_v` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`parent_id` integer,
  	`version_title` text,
  	`version_image_id` integer,
  	`version_series` text,
  	`version_year` numeric,
  	`version_description` text,
  	`version_medium` text,
  	`version_dimensions` text,
  	`version_location` text,
  	`version_camera` text,
  	`version_lens` text,
  	`version_settings_aperture` text,
  	`version_settings_shutter` text,
  	`version_settings_iso` numeric,
  	`version_featured` integer DEFAULT false,
  	`version_published_at` text,
  	`version_slug` text,
  	`version_slug_lock` integer DEFAULT true,
  	`version_updated_at` text,
  	`version_created_at` text,
  	`version__status` text DEFAULT 'draft',
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`latest` integer,
  	`autosave` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `artwork`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`version_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
INSERT INTO _artwork_v VALUES(2,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2025-07-11T03:18:18.367Z','2025-07-11T03:18:18.373Z','draft','2025-07-11T03:18:18.405Z','2025-07-11T03:18:18.405Z',0,0);
INSERT INTO _artwork_v VALUES(3,2,'Alien Superstar',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-11T03:20:02.150Z','alien-superstar',1,'2025-07-11T03:44:20.552Z','2025-07-11T03:18:18.373Z','draft','2025-07-11T03:20:00.069Z','2025-07-11T03:44:20.558Z',0,1);
INSERT INTO _artwork_v VALUES(4,2,'Alien Superstar',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-11T03:20:02.150Z','alien-superstar',1,'2025-07-11T03:44:22.860Z','2025-07-11T03:18:18.373Z','published','2025-07-11T03:44:22.892Z','2025-07-11T03:44:22.892Z',0,0);
INSERT INTO _artwork_v VALUES(5,3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2025-07-11T23:13:23.559Z','2025-07-11T23:13:23.563Z','draft','2025-07-11T23:13:23.618Z','2025-07-11T23:13:23.619Z',0,0);
INSERT INTO _artwork_v VALUES(6,3,'temp name',4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-11T23:13:46.629Z','temp-name',1,'2025-07-11T23:13:46.630Z','2025-07-11T23:13:23.563Z','draft','2025-07-11T23:13:39.362Z','2025-07-11T23:13:46.635Z',0,1);
INSERT INTO _artwork_v VALUES(7,3,'temp name',4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-11T23:13:48.223Z','temp-name',1,'2025-07-11T23:13:48.226Z','2025-07-11T23:13:23.563Z','published','2025-07-11T23:13:48.257Z','2025-07-11T23:13:48.257Z',0,0);
INSERT INTO _artwork_v VALUES(8,3,'temp name',4,'temp series',NULL,'temp description','temp medium','temp dimensions','temp location','temp camera','temp lens','temp aperture','temp shutter',NULL,1,'2025-07-11T12:00:00.000Z','temp-name',1,'2025-07-11T23:22:15.088Z','2025-07-11T23:13:23.563Z','draft','2025-07-11T23:21:37.854Z','2025-07-11T23:22:15.093Z',0,1);
INSERT INTO _artwork_v VALUES(9,3,'temp name',4,'temp series',NULL,'temp description','temp medium','temp dimensions','temp location','temp camera','temp lens','temp aperture','temp shutter',NULL,1,'2025-07-11T12:00:00.000Z','temp-name',1,'2025-07-11T23:22:20.769Z','2025-07-11T23:13:23.563Z','published','2025-07-11T23:22:20.802Z','2025-07-11T23:22:20.802Z',0,0);
INSERT INTO _artwork_v VALUES(10,4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2025-07-27T18:30:43.152Z','2025-07-27T18:30:43.157Z','draft','2025-07-27T18:30:43.189Z','2025-07-27T18:30:43.189Z',0,0);
INSERT INTO _artwork_v VALUES(11,4,'Sell the Public Flowers',6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:31:21.938Z','sell-the-public-flowers',1,'2025-07-27T18:33:16.326Z','2025-07-27T18:30:43.157Z','draft','2025-07-27T18:31:21.939Z','2025-07-27T18:33:16.331Z',0,1);
INSERT INTO _artwork_v VALUES(12,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2025-07-27T18:31:35.311Z','2025-07-27T18:31:35.315Z','draft','2025-07-27T18:31:35.341Z','2025-07-27T18:31:35.341Z',0,0);
INSERT INTO _artwork_v VALUES(13,3,'Transcendence',4,'temp series',NULL,'temp description','temp medium','temp dimensions','temp location','temp camera','temp lens','temp aperture','temp shutter',NULL,1,'2025-07-11T12:00:00.000Z','transcendence',1,'2025-07-27T18:32:25.463Z','2025-07-11T23:13:23.563Z','draft','2025-07-27T18:31:48.252Z','2025-07-27T18:32:25.468Z',0,1);
INSERT INTO _artwork_v VALUES(14,3,'Transcendence',4,'temp series',NULL,'temp description','temp medium','temp dimensions','temp location','temp camera','temp lens','temp aperture','temp shutter',NULL,1,'2025-07-11T12:00:00.000Z','transcendence',1,'2025-07-27T18:32:59.831Z','2025-07-11T23:13:23.563Z','published','2025-07-27T18:32:59.859Z','2025-07-27T18:32:59.859Z',0,0);
INSERT INTO _artwork_v VALUES(15,4,'Sell the Public Flowers',6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:31:21.938Z','sell-the-public-flowers',1,'2025-07-27T18:33:16.958Z','2025-07-27T18:30:43.157Z','published','2025-07-27T18:33:16.989Z','2025-07-27T18:33:16.990Z',0,0);
INSERT INTO _artwork_v VALUES(16,5,'Love Pink',7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:40:56.874Z','love-pink',1,'2025-07-27T18:40:56.875Z','2025-07-27T18:31:35.315Z','draft','2025-07-27T18:40:52.663Z','2025-07-27T18:40:56.881Z',0,1);
INSERT INTO _artwork_v VALUES(17,5,'Love Pink',7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:40:58.704Z','love-pink',1,'2025-07-27T18:40:58.706Z','2025-07-27T18:31:35.315Z','published','2025-07-27T18:40:58.744Z','2025-07-27T18:40:58.744Z',0,0);
INSERT INTO _artwork_v VALUES(18,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2025-07-27T18:41:06.330Z','2025-07-27T18:41:06.337Z','draft','2025-07-27T18:41:06.367Z','2025-07-27T18:41:06.367Z',0,0);
INSERT INTO _artwork_v VALUES(19,6,'Pics Bro?',8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:48:05.606Z','pics-bro',1,'2025-07-27T18:48:05.607Z','2025-07-27T18:41:06.337Z','draft','2025-07-27T18:48:00.813Z','2025-07-27T18:48:05.612Z',0,1);
INSERT INTO _artwork_v VALUES(20,6,'Pics Bro?',8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:48:08.126Z','pics-bro',1,'2025-07-27T18:48:08.139Z','2025-07-27T18:41:06.337Z','published','2025-07-27T18:48:08.171Z','2025-07-27T18:48:08.171Z',0,0);
INSERT INTO _artwork_v VALUES(21,7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2025-07-27T18:48:16.970Z','2025-07-27T18:48:16.974Z','draft','2025-07-27T18:48:16.999Z','2025-07-27T18:48:16.999Z',0,0);
INSERT INTO _artwork_v VALUES(22,7,'Coyote Jock',9,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:48:57.287Z','coyote-jock',1,'2025-07-27T18:48:57.287Z','2025-07-27T18:48:16.974Z','draft','2025-07-27T18:48:42.339Z','2025-07-27T18:48:57.292Z',0,1);
INSERT INTO _artwork_v VALUES(23,7,'Coyote Jock',9,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:49:03.212Z','coyote-jock',1,'2025-07-27T18:49:03.215Z','2025-07-27T18:48:16.974Z','published','2025-07-27T18:49:03.243Z','2025-07-27T18:49:03.244Z',0,0);
INSERT INTO _artwork_v VALUES(24,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2025-07-27T18:49:13.306Z','2025-07-27T18:49:13.309Z','draft','2025-07-27T18:49:13.335Z','2025-07-27T18:49:13.336Z',0,0);
INSERT INTO _artwork_v VALUES(25,8,'Soft Exploration in Identity',10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:52:31.349Z','soft-exploration-in-identity',1,'2025-07-27T18:52:31.349Z','2025-07-27T18:49:13.309Z','draft','2025-07-27T18:51:56.228Z','2025-07-27T18:52:31.355Z',0,1);
INSERT INTO _artwork_v VALUES(26,8,'Soft Exploration in Identity',10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:52:35.641Z','soft-exploration-in-identity',1,'2025-07-27T18:52:35.645Z','2025-07-27T18:49:13.309Z','published','2025-07-27T18:52:35.673Z','2025-07-27T18:52:35.674Z',0,0);
INSERT INTO _artwork_v VALUES(27,2,'Alien Superstar',1,NULL,2024,'Make Up: Julia Noel, @julia.lise on Instagram.','Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-11T03:20:02.150Z','alien-superstar',1,'2025-07-27T18:58:20.185Z','2025-07-11T03:18:18.373Z','draft','2025-07-27T18:53:13.012Z','2025-07-27T18:58:20.192Z',0,1);
INSERT INTO _artwork_v VALUES(28,2,'Alien Superstar',1,NULL,2024,'Make Up: Julia Noel, @julia.lise on Instagram.','Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-11T03:20:02.150Z','alien-superstar',1,'2025-07-27T18:58:47.574Z','2025-07-11T03:18:18.373Z','published','2025-07-27T18:58:47.601Z','2025-07-27T18:58:47.601Z',1,0);
INSERT INTO _artwork_v VALUES(29,5,'Love Pink',7,NULL,2025,'','Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:40:58.704Z','love-pink',1,'2025-07-27T19:00:21.125Z','2025-07-27T18:31:35.315Z','draft','2025-07-27T18:59:36.186Z','2025-07-27T19:00:21.130Z',0,1);
INSERT INTO _artwork_v VALUES(30,5,'Love Pink',7,NULL,2025,'','Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:40:58.704Z','love-pink',1,'2025-07-27T19:00:29.007Z','2025-07-27T18:31:35.315Z','published','2025-07-27T19:00:29.036Z','2025-07-27T19:00:29.036Z',1,0);
INSERT INTO _artwork_v VALUES(31,6,'Pics Bro?',8,'Censorship',2025,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:48:08.126Z','pics-bro',1,'2025-07-27T19:01:13.562Z','2025-07-27T18:41:06.337Z','draft','2025-07-27T19:00:46.908Z','2025-07-27T19:01:13.567Z',0,1);
INSERT INTO _artwork_v VALUES(32,6,'Pics Bro?',8,'Censorship',2025,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:48:08.126Z','pics-bro',1,'2025-07-27T19:01:20.014Z','2025-07-27T18:41:06.337Z','published','2025-07-27T19:01:20.042Z','2025-07-27T19:01:20.042Z',1,0);
INSERT INTO _artwork_v VALUES(33,8,'Soft Exploration in Identity',10,'EXTRA',2023,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:52:35.641Z','soft-exploration-in-identity',1,'2025-07-27T19:01:38.429Z','2025-07-27T18:49:13.309Z','draft','2025-07-27T19:01:31.272Z','2025-07-27T19:01:38.434Z',0,1);
INSERT INTO _artwork_v VALUES(34,8,'Soft Exploration in Identity',10,'EXTRA',2023,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:52:35.641Z','soft-exploration-in-identity',1,'2025-07-27T19:01:39.280Z','2025-07-27T18:49:13.309Z','published','2025-07-27T19:01:39.310Z','2025-07-27T19:01:39.310Z',1,0);
INSERT INTO _artwork_v VALUES(35,3,'Transcendence',4,'A Man Like Any Other',2024,'','Digital Photography and Collage','','','','','','',NULL,1,'2025-07-11T12:00:00.000Z','transcendence',1,'2025-07-27T19:02:35.780Z','2025-07-11T23:13:23.563Z','draft','2025-07-27T19:01:54.129Z','2025-07-27T19:02:35.786Z',0,1);
INSERT INTO _artwork_v VALUES(36,3,'Transcendence',4,'A Man Like Any Other',2024,'','Digital Photography and Collage','','','','','','',NULL,1,'2025-07-11T12:00:00.000Z','transcendence',1,'2025-07-27T19:02:40.954Z','2025-07-11T23:13:23.563Z','published','2025-07-27T19:02:40.980Z','2025-07-27T19:02:40.980Z',1,0);
INSERT INTO _artwork_v VALUES(37,4,'Sell the Public Flowers',6,'A Man Like Any Other',2024,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:31:21.938Z','sell-the-public-flowers',1,'2025-07-27T19:03:04.347Z','2025-07-27T18:30:43.157Z','draft','2025-07-27T19:02:51.081Z','2025-07-27T19:03:04.352Z',0,1);
INSERT INTO _artwork_v VALUES(38,4,'Sell the Public Flowers',6,'A Man Like Any Other',2024,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:31:21.938Z','sell-the-public-flowers',1,'2025-07-27T19:03:07.102Z','2025-07-27T18:30:43.157Z','published','2025-07-27T19:03:07.129Z','2025-07-27T19:03:07.129Z',1,0);
INSERT INTO _artwork_v VALUES(39,7,'Coyote Jock',9,'',2025,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:49:03.212Z','coyote-jock',1,'2025-07-27T19:03:35.710Z','2025-07-27T18:48:16.974Z','draft','2025-07-27T19:03:22.117Z','2025-07-27T19:03:35.715Z',0,1);
INSERT INTO _artwork_v VALUES(40,7,'Coyote Jock',9,'',2025,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T18:49:03.212Z','coyote-jock',1,'2025-07-27T19:03:36.606Z','2025-07-27T18:48:16.974Z','published','2025-07-27T19:03:36.635Z','2025-07-27T19:03:36.636Z',1,0);
INSERT INTO _artwork_v VALUES(41,9,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2025-07-27T19:03:47.430Z','2025-07-27T19:03:47.439Z','draft','2025-07-27T19:03:47.467Z','2025-07-27T19:03:47.467Z',0,0);
INSERT INTO _artwork_v VALUES(42,9,'Enlightenment',11,'A Man Like Any Other',2024,NULL,'Digital Photography, Collage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T19:05:42.586Z','enlightenment',1,'2025-07-27T19:05:42.586Z','2025-07-27T19:03:47.439Z','draft','2025-07-27T19:04:08.452Z','2025-07-27T19:05:42.592Z',0,1);
INSERT INTO _artwork_v VALUES(43,9,'Enlightenment',11,'A Man Like Any Other',2024,NULL,'Digital Photography, Collage',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T19:05:44.274Z','enlightenment',1,'2025-07-27T19:05:44.276Z','2025-07-27T19:03:47.439Z','published','2025-07-27T19:05:44.303Z','2025-07-27T19:05:44.303Z',1,0);
INSERT INTO _artwork_v VALUES(44,10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2025-07-27T19:05:49.835Z','2025-07-27T19:05:49.839Z','draft','2025-07-27T19:05:49.868Z','2025-07-27T19:05:49.868Z',0,0);
INSERT INTO _artwork_v VALUES(45,10,'Metamorphosis',12,'A Man Like Any Other',2024,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T19:06:37.114Z','metamorphosis',1,'2025-07-27T19:06:37.114Z','2025-07-27T19:05:49.839Z','draft','2025-07-27T19:06:04.804Z','2025-07-27T19:06:37.122Z',0,1);
INSERT INTO _artwork_v VALUES(46,10,'Metamorphosis',12,'A Man Like Any Other',2024,NULL,'Digital Photography',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T19:06:39.310Z','metamorphosis',1,'2025-07-27T19:06:39.314Z','2025-07-27T19:05:49.839Z','published','2025-07-27T19:06:39.345Z','2025-07-27T19:06:39.345Z',1,0);
INSERT INTO _artwork_v VALUES(47,11,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,1,'2025-07-27T19:06:53.958Z','2025-07-27T19:06:53.961Z','draft','2025-07-27T19:06:53.986Z','2025-07-27T19:06:53.986Z',0,0);
INSERT INTO _artwork_v VALUES(48,11,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'2025-07-27T19:07:58.949Z',NULL,1,'2025-07-27T19:07:58.949Z','2025-07-27T19:06:53.961Z','draft','2025-07-27T19:07:55.596Z','2025-07-27T19:07:58.955Z',1,1);
CREATE TABLE IF NOT EXISTS `products` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`artwork_id` integer NOT NULL,
  	`price` numeric NOT NULL,
  	`description` text,
  	`size` text NOT NULL,
  	`material` text NOT NULL,
  	`edition_total` numeric DEFAULT 0,
  	`edition_current` numeric DEFAULT 0,
  	`stock` numeric NOT NULL,
  	`available` integer DEFAULT true,
  	`stripe_product_id` text,
  	`stripe_price_id` text,
  	`featured` integer DEFAULT false,
  	`slug` text,
  	`slug_lock` integer DEFAULT true,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (`artwork_id`) REFERENCES `artwork`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE IF NOT EXISTS `orders_items` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`product_id` integer NOT NULL,
  	`quantity` numeric NOT NULL,
  	`price` numeric NOT NULL,
  	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`_parent_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `orders` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order_number` text NOT NULL,
  	`stripe_payment_intent_id` text,
  	`customer_name` text NOT NULL,
  	`customer_email` text NOT NULL,
  	`customer_phone` text,
  	`shipping_address1` text NOT NULL,
  	`shipping_address2` text,
  	`shipping_city` text NOT NULL,
  	`shipping_state` text NOT NULL,
  	`shipping_zip_code` text NOT NULL,
  	`shipping_country` text NOT NULL,
  	`total` numeric NOT NULL,
  	`status` text DEFAULT 'pending' NOT NULL,
  	`tracking_number` text,
  	`notes` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
CREATE TABLE IF NOT EXISTS `pages_hero_links` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`link_type` text DEFAULT 'reference',
  	`link_new_tab` integer,
  	`link_url` text,
  	`link_label` text,
  	`link_appearance` text DEFAULT 'default',
  	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `pages_blocks_cta_links` (
  	`_order` integer NOT NULL,
  	`_parent_id` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`link_type` text DEFAULT 'reference',
  	`link_new_tab` integer,
  	`link_url` text,
  	`link_label` text,
  	`link_appearance` text DEFAULT 'default',
  	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_cta`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `pages_blocks_cta` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`rich_text` text,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `pages_blocks_content_columns` (
  	`_order` integer NOT NULL,
  	`_parent_id` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`size` text DEFAULT 'oneThird',
  	`rich_text` text,
  	`enable_link` integer,
  	`link_type` text DEFAULT 'reference',
  	`link_new_tab` integer,
  	`link_url` text,
  	`link_label` text,
  	`link_appearance` text DEFAULT 'default',
  	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_content`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `pages_blocks_content` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `pages_blocks_media_block` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`media_id` integer,
  	`block_name` text,
  	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `pages_blocks_archive` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`intro_content` text,
  	`populate_by` text DEFAULT 'collection',
  	`relation_to` text DEFAULT 'posts',
  	`limit` numeric DEFAULT 10,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `pages_blocks_form_block` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`form_id` integer,
  	`enable_intro` integer,
  	`intro_content` text,
  	`block_name` text,
  	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `pages` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text,
  	`hero_type` text DEFAULT 'lowImpact',
  	`hero_rich_text` text,
  	`hero_media_id` integer,
  	`meta_title` text,
  	`meta_image_id` integer,
  	`meta_description` text,
  	`published_at` text,
  	`slug` text,
  	`slug_lock` integer DEFAULT true,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`_status` text DEFAULT 'draft',
  	FOREIGN KEY (`hero_media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`meta_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE IF NOT EXISTS `pages_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`pages_id` integer,
  	`posts_id` integer,
  	`categories_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `_pages_v_version_hero_links` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` integer PRIMARY KEY NOT NULL,
  	`link_type` text DEFAULT 'reference',
  	`link_new_tab` integer,
  	`link_url` text,
  	`link_label` text,
  	`link_appearance` text DEFAULT 'default',
  	`_uuid` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `_pages_v_blocks_cta_links` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` integer PRIMARY KEY NOT NULL,
  	`link_type` text DEFAULT 'reference',
  	`link_new_tab` integer,
  	`link_url` text,
  	`link_label` text,
  	`link_appearance` text DEFAULT 'default',
  	`_uuid` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v_blocks_cta`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `_pages_v_blocks_cta` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` integer PRIMARY KEY NOT NULL,
  	`rich_text` text,
  	`_uuid` text,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `_pages_v_blocks_content_columns` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` integer PRIMARY KEY NOT NULL,
  	`size` text DEFAULT 'oneThird',
  	`rich_text` text,
  	`enable_link` integer,
  	`link_type` text DEFAULT 'reference',
  	`link_new_tab` integer,
  	`link_url` text,
  	`link_label` text,
  	`link_appearance` text DEFAULT 'default',
  	`_uuid` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v_blocks_content`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `_pages_v_blocks_content` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` integer PRIMARY KEY NOT NULL,
  	`_uuid` text,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `_pages_v_blocks_media_block` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` integer PRIMARY KEY NOT NULL,
  	`media_id` integer,
  	`_uuid` text,
  	`block_name` text,
  	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `_pages_v_blocks_archive` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` integer PRIMARY KEY NOT NULL,
  	`intro_content` text,
  	`populate_by` text DEFAULT 'collection',
  	`relation_to` text DEFAULT 'posts',
  	`limit` numeric DEFAULT 10,
  	`_uuid` text,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `_pages_v_blocks_form_block` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` integer PRIMARY KEY NOT NULL,
  	`form_id` integer,
  	`enable_intro` integer,
  	`intro_content` text,
  	`_uuid` text,
  	`block_name` text,
  	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `_pages_v` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`parent_id` integer,
  	`version_title` text,
  	`version_hero_type` text DEFAULT 'lowImpact',
  	`version_hero_rich_text` text,
  	`version_hero_media_id` integer,
  	`version_meta_title` text,
  	`version_meta_image_id` integer,
  	`version_meta_description` text,
  	`version_published_at` text,
  	`version_slug` text,
  	`version_slug_lock` integer DEFAULT true,
  	`version_updated_at` text,
  	`version_created_at` text,
  	`version__status` text DEFAULT 'draft',
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`latest` integer,
  	`autosave` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`version_hero_media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`version_meta_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE IF NOT EXISTS `_pages_v_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`pages_id` integer,
  	`posts_id` integer,
  	`categories_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `posts_populated_authors` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `posts` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text,
  	`hero_image_id` integer,
  	`content` text,
  	`meta_title` text,
  	`meta_image_id` integer,
  	`meta_description` text,
  	`published_at` text,
  	`slug` text,
  	`slug_lock` integer DEFAULT true,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`_status` text DEFAULT 'draft',
  	FOREIGN KEY (`hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`meta_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE IF NOT EXISTS `posts_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`posts_id` integer,
  	`categories_id` integer,
  	`users_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `_posts_v_version_populated_authors` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` integer PRIMARY KEY NOT NULL,
  	`_uuid` text,
  	`name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `_posts_v`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `_posts_v` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`parent_id` integer,
  	`version_title` text,
  	`version_hero_image_id` integer,
  	`version_content` text,
  	`version_meta_title` text,
  	`version_meta_image_id` integer,
  	`version_meta_description` text,
  	`version_published_at` text,
  	`version_slug` text,
  	`version_slug_lock` integer DEFAULT true,
  	`version_updated_at` text,
  	`version_created_at` text,
  	`version__status` text DEFAULT 'draft',
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`latest` integer,
  	`autosave` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`version_hero_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`version_meta_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE IF NOT EXISTS `_posts_v_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`posts_id` integer,
  	`categories_id` integer,
  	`users_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `_posts_v`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `media` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`alt` text,
  	`caption` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`url` text,
  	`thumbnail_u_r_l` text,
  	`filename` text,
  	`mime_type` text,
  	`filesize` numeric,
  	`width` numeric,
  	`height` numeric,
  	`focal_x` numeric,
  	`focal_y` numeric,
  	`sizes_thumbnail_url` text,
  	`sizes_thumbnail_width` numeric,
  	`sizes_thumbnail_height` numeric,
  	`sizes_thumbnail_mime_type` text,
  	`sizes_thumbnail_filesize` numeric,
  	`sizes_thumbnail_filename` text,
  	`sizes_square_url` text,
  	`sizes_square_width` numeric,
  	`sizes_square_height` numeric,
  	`sizes_square_mime_type` text,
  	`sizes_square_filesize` numeric,
  	`sizes_square_filename` text,
  	`sizes_small_url` text,
  	`sizes_small_width` numeric,
  	`sizes_small_height` numeric,
  	`sizes_small_mime_type` text,
  	`sizes_small_filesize` numeric,
  	`sizes_small_filename` text,
  	`sizes_medium_url` text,
  	`sizes_medium_width` numeric,
  	`sizes_medium_height` numeric,
  	`sizes_medium_mime_type` text,
  	`sizes_medium_filesize` numeric,
  	`sizes_medium_filename` text,
  	`sizes_large_url` text,
  	`sizes_large_width` numeric,
  	`sizes_large_height` numeric,
  	`sizes_large_mime_type` text,
  	`sizes_large_filesize` numeric,
  	`sizes_large_filename` text,
  	`sizes_xlarge_url` text,
  	`sizes_xlarge_width` numeric,
  	`sizes_xlarge_height` numeric,
  	`sizes_xlarge_mime_type` text,
  	`sizes_xlarge_filesize` numeric,
  	`sizes_xlarge_filename` text,
  	`sizes_og_url` text,
  	`sizes_og_width` numeric,
  	`sizes_og_height` numeric,
  	`sizes_og_mime_type` text,
  	`sizes_og_filesize` numeric,
  	`sizes_og_filename` text
  );
INSERT INTO media VALUES(1,NULL,NULL,'2025-07-11T03:43:25.413Z','2025-07-11T03:43:25.417Z',NULL,NULL,'meandwillproject3-edit2.jpg','image/jpeg',4038818,3689,5486,50,50,NULL,300,446,'image/jpeg',13479,'meandwillproject3-edit2-300x446.jpg',NULL,500,500,'image/jpeg',21151,'meandwillproject3-edit2-500x500.jpg',NULL,600,892,'image/jpeg',47882,'meandwillproject3-edit2-600x892.jpg',NULL,900,1338,'image/jpeg',109294,'meandwillproject3-edit2-900x1338.jpg',NULL,1400,2082,'image/jpeg',324169,'meandwillproject3-edit2-1400x2082.jpg',NULL,1920,2855,'image/jpeg',784050,'meandwillproject3-edit2-1920x2855.jpg',NULL,1200,630,'image/jpeg',52818,'meandwillproject3-edit2-1200x630.jpg');
INSERT INTO media VALUES(2,NULL,NULL,'2025-07-11T03:43:55.852Z','2025-07-11T03:43:55.856Z',NULL,NULL,'IMG_4235.jpg','image/jpeg',39763,897,1400,50,50,NULL,300,468,'image/jpeg',6317,'IMG_4235-300x468.jpg',NULL,500,500,'image/jpeg',14103,'IMG_4235-500x500.jpg',NULL,600,936,'image/jpeg',20627,'IMG_4235-600x936.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',42148,'IMG_4235-1200x630.jpg');
INSERT INTO media VALUES(3,NULL,NULL,'2025-07-11T03:43:58.936Z','2025-07-11T03:43:58.940Z',NULL,NULL,'IMG_4266.jpg','image/jpeg',24100,933,1400,50,50,NULL,300,450,'image/jpeg',3755,'IMG_4266-300x450.jpg',NULL,500,500,'image/jpeg',7591,'IMG_4266-500x500.jpg',NULL,600,900,'image/jpeg',11426,'IMG_4266-600x900.jpg',NULL,900,1350,'image/jpeg',22509,'IMG_4266-900x1350.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',21335,'IMG_4266-1200x630.jpg');
INSERT INTO media VALUES(4,NULL,NULL,'2025-07-11T03:44:00.669Z','2025-07-11T03:44:00.673Z',NULL,NULL,'Untitled-213.jpg','image/jpeg',123038,871,1400,50,50,NULL,300,482,'image/jpeg',13809,'Untitled-213-300x482.jpg',NULL,500,500,'image/jpeg',21519,'Untitled-213-500x500.jpg',NULL,600,964,'image/jpeg',50991,'Untitled-213-600x964.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',72877,'Untitled-213-1200x630.jpg');
INSERT INTO media VALUES(5,NULL,NULL,'2025-07-11T03:44:02.871Z','2025-07-11T03:44:02.879Z',NULL,NULL,'IMG_0023-2 copy.jpg','image/jpeg',122550,933,1400,50,50,NULL,300,450,'image/jpeg',17240,'IMG_0023-2 copy-300x450.jpg',NULL,500,500,'image/jpeg',35212,'IMG_0023-2 copy-500x500.jpg',NULL,600,900,'image/jpeg',58227,'IMG_0023-2 copy-600x900.jpg',NULL,900,1350,'image/jpeg',113372,'IMG_0023-2 copy-900x1350.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',82612,'IMG_0023-2 copy-1200x630.jpg');
INSERT INTO media VALUES(6,NULL,NULL,'2025-07-27T18:31:21.551Z','2025-07-27T18:31:21.556Z',NULL,NULL,'Sell the Public Flowers.jpg','image/jpeg',39763,897,1400,50,50,NULL,300,468,'image/jpeg',6317,'Sell the Public Flowers-300x468.jpg',NULL,500,500,'image/jpeg',14103,'Sell the Public Flowers-500x500.jpg',NULL,600,936,'image/jpeg',20627,'Sell the Public Flowers-600x936.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',42148,'Sell the Public Flowers-1200x630.jpg');
INSERT INTO media VALUES(7,NULL,NULL,'2025-07-27T18:40:52.228Z','2025-07-27T18:40:52.234Z',NULL,NULL,'WMN Pink0076 1.jpg','image/jpeg',336537,1708,2560,50,50,NULL,300,450,'image/jpeg',14383,'WMN Pink0076 1-300x450.jpg',NULL,500,500,'image/jpeg',28847,'WMN Pink0076 1-500x500.jpg',NULL,600,899,'image/jpeg',50421,'WMN Pink0076 1-600x899.jpg',NULL,900,1349,'image/jpeg',108104,'WMN Pink0076 1-900x1349.jpg',NULL,1400,2098,'image/jpeg',239712,'WMN Pink0076 1-1400x2098.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',100213,'WMN Pink0076 1-1200x630.jpg');
INSERT INTO media VALUES(8,NULL,NULL,'2025-07-27T18:48:00.442Z','2025-07-27T18:48:00.449Z',NULL,NULL,'Untitled (25).jpg','image/jpeg',72593,1200,1500,50,50,NULL,300,375,'image/jpeg',8149,'Untitled (25)-300x375.jpg',NULL,500,500,'image/jpeg',15197,'Untitled (25)-500x500.jpg',NULL,600,750,'image/jpeg',23334,'Untitled (25)-600x750.jpg',NULL,900,1125,'image/jpeg',45522,'Untitled (25)-900x1125.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',37564,'Untitled (25)-1200x630.jpg');
INSERT INTO media VALUES(9,NULL,NULL,'2025-07-27T18:48:42.053Z','2025-07-27T18:48:42.059Z',NULL,NULL,'Will April 130214.jpg','image/jpeg',51950,596,893,50,50,NULL,300,449,'image/jpeg',17556,'Will April 130214-300x449.jpg',NULL,500,500,'image/jpeg',31147,'Will April 130214-500x500.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',68251,'Will April 130214-1200x630.jpg');
INSERT INTO media VALUES(10,NULL,NULL,'2025-07-27T18:51:55.887Z','2025-07-27T18:51:55.894Z',NULL,NULL,'IMG_2310.jpg','image/jpeg',108782,872,1200,50,50,NULL,300,413,'image/jpeg',19975,'IMG_2310-300x413.jpg',NULL,500,500,'image/jpeg',33771,'IMG_2310-500x500.jpg',NULL,600,826,'image/jpeg',59045,'IMG_2310-600x826.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',75783,'IMG_2310-1200x630.jpg');
INSERT INTO media VALUES(11,NULL,NULL,'2025-07-27T19:04:08.196Z','2025-07-27T19:04:08.200Z',NULL,NULL,'IMG_0023-2 copy-1.jpg','image/jpeg',94105,800,1200,50,50,NULL,300,450,'image/jpeg',17487,'IMG_0023-2 copy-1-300x450.jpg',NULL,500,500,'image/jpeg',35389,'IMG_0023-2 copy-1-500x500.jpg',NULL,600,900,'image/jpeg',58214,'IMG_0023-2 copy-1-600x900.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',79840,'IMG_0023-2 copy-1-1200x630.jpg');
INSERT INTO media VALUES(12,NULL,NULL,'2025-07-27T19:06:04.458Z','2025-07-27T19:06:04.476Z',NULL,NULL,'Untitled-180.jpg','image/jpeg',46591,1200,1067,50,50,NULL,300,267,'image/jpeg',5788,'Untitled-180-300x267.jpg',NULL,500,500,'image/jpeg',13295,'Untitled-180-500x500.jpg',NULL,600,534,'image/jpeg',15434,'Untitled-180-600x534.jpg',NULL,900,800,'image/jpeg',28855,'Untitled-180-900x800.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',30464,'Untitled-180-1200x630.jpg');
INSERT INTO media VALUES(13,NULL,NULL,'2025-07-27T19:07:55.213Z','2025-07-27T19:07:55.226Z',NULL,NULL,'img20250522_17380179.jpg','image/jpeg',12723141,6057,9653,50,50,NULL,300,478,'image/jpeg',37836,'img20250522_17380179-300x478.jpg',NULL,500,500,'image/jpeg',66694,'img20250522_17380179-500x500.jpg',NULL,600,956,'image/jpeg',151299,'img20250522_17380179-600x956.jpg',NULL,900,1434,'image/jpeg',344428,'img20250522_17380179-900x1434.jpg',NULL,1400,2231,'image/jpeg',832718,'img20250522_17380179-1400x2231.jpg',NULL,1920,3060,'image/jpeg',1581740,'img20250522_17380179-1920x3060.jpg',NULL,1200,630,'image/jpeg',200086,'img20250522_17380179-1200x630.jpg');
INSERT INTO media VALUES(14,NULL,NULL,'2025-07-27T19:11:20.419Z','2025-07-27T19:11:20.426Z',NULL,NULL,'Molly Makeup Shoot0212.jpg','image/jpeg',695122,1708,2560,50,50,NULL,300,450,'image/jpeg',21093,'Molly Makeup Shoot0212-300x450.jpg',NULL,500,500,'image/jpeg',49852,'Molly Makeup Shoot0212-500x500.jpg',NULL,600,899,'image/jpeg',93165,'Molly Makeup Shoot0212-600x899.jpg',NULL,900,1349,'image/jpeg',216020,'Molly Makeup Shoot0212-900x1349.jpg',NULL,1400,2098,'image/jpeg',493679,'Molly Makeup Shoot0212-1400x2098.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1200,630,'image/jpeg',175397,'Molly Makeup Shoot0212-1200x630.jpg');
CREATE TABLE IF NOT EXISTS `categories_breadcrumbs` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`doc_id` integer,
  	`url` text,
  	`label` text,
  	FOREIGN KEY (`doc_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (`_parent_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `categories` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`slug` text,
  	`slug_lock` integer DEFAULT true,
  	`parent_id` integer,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE IF NOT EXISTS `users_sessions` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`created_at` text,
  	`expires_at` text NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
  );
INSERT INTO users_sessions VALUES(1,2,'0a14900c-e1c6-41ef-85d3-f7e6a6bdcc44','2025-07-27T18:28:03.827Z','2025-07-27T20:28:03.827Z');
INSERT INTO users_sessions VALUES(1,1,'93b0e3fa-40f6-4512-ae38-a0b6f8b8e77f','2025-07-27T18:53:16.996Z','2025-07-27T20:53:16.996Z');
CREATE TABLE IF NOT EXISTS `users` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`name` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`email` text NOT NULL,
  	`reset_password_token` text,
  	`reset_password_expiration` text,
  	`salt` text,
  	`hash` text,
  	`login_attempts` numeric DEFAULT 0,
  	`lock_until` text
  );
INSERT INTO users VALUES(1,'Chadmin','2025-07-27T18:53:16.996Z','2025-07-11T03:11:20.948Z','chadgallati@gmail.com',NULL,NULL,'7f4a0dc12c5b80024184b370d9055bddd97741ff4e3b9549ad66a18477fe831e','3caa4018cd7983722dd8a26ec38f18a17f27b5a471c677874edebd3b19ed405393b800c225aa7f472038a48ebd56d6104219128b4d6c09ffd15fa6069177b286426cc21e45e2c4493595aa1dd215e721bba559f887a910fc31aa5d023d7fba60538e89430d14a0829669c4ddf58604f3435dd9f2566c6de39b7f75d525f978f27bcf7b141e833128a6e0f90ec762dea67eaa9469cd1049e40cf63ba282b6f5244207edeac9994fe4fa62cee04d73d4f8034ef297f6edb12817bd6f439251198e0438d203d92ad8b58725e1e7053d8072a4dace00034e73474a56786d2bf17fe0ad7041d136e993fc18d87d0cead23c55ebb3a6c375d872d3369607bfe3254eba7d721a328619e81e61e4c271739c2064c551e180a754bb5c2ce9a7dea606c2a456feaf776c3ac37c1c74ff580044dc614ad7dffe207087ed34b46d0579e7db8f9407313116fd8b5b53e8bd5c7c346e48925545e2626df6a68afb4614a26aa64ef121554ca88763c2541c45a126b01a651ccaff3bf67a6392c11584275a67f566dae243d17e2cff7d5284dbcf97b9b43c73f5ae0217ce2e236a24a652a064745d65e338988da35a9625d43039d3a5c28cf99664353f108113a9356d9f1336a2e14012929576ba6f2aa89284bbb917aa800406465e2bfcbfb38647d443597a83a6ca3a38aa3b2ba3e962d61c0147c53839b84797f6e50ab7eb7cc0e51f97852ce5',0,NULL);
INSERT INTO users VALUES(2,'Will','2025-07-27T18:28:03.830Z','2025-07-11T03:17:50.370Z','willmnichols.wn@gmail.com',NULL,NULL,'a590aa7598855325c9d26bc7d026be9ae1a97c2ed37696d00106c39fe8fc46c6','237895ad14998b8446c1328d1f00ba1076e3a6ef8020d6dc8a61135b875909e7a9613e07351ce19279c57727b78fe58fd28352cddf098c451089e3fe45298a6840c12f25e435cef84f0a653c29a6f01ab810d23004a12c44442b0eaf0d7d9be243bfcbefd8def8953abf2397114b83cb09b18ffa284ba3b376bedf19c1b4f89dcf4cd63da229e07b3faa8724acbbecca18bc14345855631f0f666e471e3c920d0b428c824dac9ef59782eebcf670c5a9900b0c2f610bd637a4e4acfccd6866e072419bc8b02e452e0ad78919e1e69e60e597f4b352ed0611774d996aef694853ac349b8f110ba19f211f3199c46b9e6acc69023fab6cc2eb326724ab25a10b88e29191570e2e15e956708b82223c5dac7f0744b22769c9b7d9bd1994ebddbefd7fcf80780ce4244a01f789592c05abcb8706c027c20281147e0205fb9f4f1cb2761bdfb222ea347ebe4f5d26455e4fffd29b59aa25301ccf34f5aeaa9f4c0aeaf7eff88a2de7f27b5b4f276710a2999560d4c9daee42edba1b0874df33fa43a0b151cfa343c562580819b35308cf744f3cb361f8809b0b9f99fee90bd3791e56073f8acc7b15fc1307f11fbaa9e3e169347f9359c33f0c9854abcdb738cf7dbf39fa2340d8110623762efa68d775a1eb955a74fc7b7fecfc2931b15bca8ce274ac2e2895ab26cc786578c097e5a29aa3c70490522e3f55eb285e79254b85cbaa',0,NULL);
CREATE TABLE IF NOT EXISTS `redirects` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`from` text NOT NULL,
  	`to_type` text DEFAULT 'reference',
  	`to_url` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
CREATE TABLE IF NOT EXISTS `redirects_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`pages_id` integer,
  	`posts_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `redirects`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms_blocks_checkbox` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`label` text,
  	`width` numeric,
  	`required` integer,
  	`default_value` integer,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms_blocks_country` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`label` text,
  	`width` numeric,
  	`required` integer,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms_blocks_email` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`label` text,
  	`width` numeric,
  	`required` integer,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms_blocks_message` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`message` text,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms_blocks_number` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`label` text,
  	`width` numeric,
  	`default_value` numeric,
  	`required` integer,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms_blocks_select_options` (
  	`_order` integer NOT NULL,
  	`_parent_id` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`label` text NOT NULL,
  	`value` text NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `forms_blocks_select`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms_blocks_select` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`label` text,
  	`width` numeric,
  	`default_value` text,
  	`placeholder` text,
  	`required` integer,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms_blocks_state` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`label` text,
  	`width` numeric,
  	`required` integer,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms_blocks_text` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`label` text,
  	`width` numeric,
  	`default_value` text,
  	`required` integer,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms_blocks_textarea` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`_path` text NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`name` text NOT NULL,
  	`label` text,
  	`width` numeric,
  	`default_value` text,
  	`required` integer,
  	`block_name` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms_emails` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`email_to` text,
  	`cc` text,
  	`bcc` text,
  	`reply_to` text,
  	`email_from` text,
  	`subject` text DEFAULT 'You''ve received a new message.' NOT NULL,
  	`message` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `forms` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text NOT NULL,
  	`submit_button_label` text,
  	`confirmation_type` text DEFAULT 'message',
  	`confirmation_message` text,
  	`redirect_url` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
CREATE TABLE IF NOT EXISTS `form_submissions_submission_data` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`field` text NOT NULL,
  	`value` text NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `form_submissions`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `form_submissions` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`form_id` integer NOT NULL,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE IF NOT EXISTS `search_categories` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`relation_to` text,
  	`category_i_d` text,
  	`title` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `search`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `search` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`title` text,
  	`priority` numeric,
  	`slug` text,
  	`meta_title` text,
  	`meta_description` text,
  	`meta_image_id` integer,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (`meta_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
  );
CREATE TABLE IF NOT EXISTS `search_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`posts_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `search`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `payload_jobs_log` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`executed_at` text NOT NULL,
  	`completed_at` text NOT NULL,
  	`task_slug` text NOT NULL,
  	`task_i_d` text NOT NULL,
  	`input` text,
  	`output` text,
  	`state` text NOT NULL,
  	`error` text,
  	FOREIGN KEY (`_parent_id`) REFERENCES `payload_jobs`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `payload_jobs` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`input` text,
  	`completed_at` text,
  	`total_tried` numeric DEFAULT 0,
  	`has_error` integer DEFAULT false,
  	`error` text,
  	`task_slug` text,
  	`queue` text DEFAULT 'default',
  	`wait_until` text,
  	`processing` integer DEFAULT false,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
CREATE TABLE IF NOT EXISTS `payload_locked_documents` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`global_slug` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
CREATE TABLE IF NOT EXISTS `payload_preferences` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`key` text,
  	`value` text,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
INSERT INTO payload_preferences VALUES(1,'collection-users','{"preset":null}','2025-07-11T03:17:07.689Z','2025-07-11T03:17:07.692Z');
INSERT INTO payload_preferences VALUES(2,'collection-artwork','{"preset":null,"limit":10}','2025-07-11T03:32:58.350Z','2025-07-11T03:18:00.446Z');
INSERT INTO payload_preferences VALUES(3,'collection-artwork','{"preset":null,"limit":10}','2025-07-11T03:22:35.805Z','2025-07-11T03:21:37.282Z');
INSERT INTO payload_preferences VALUES(4,'collection-media','{"preset":null,"limit":10}','2025-07-11T03:43:21.887Z','2025-07-11T03:22:16.536Z');
INSERT INTO payload_preferences VALUES(5,'nav','{"groups":{"Collections":{"open":true}}}','2025-07-11T03:44:53.835Z','2025-07-11T03:23:14.588Z');
INSERT INTO payload_preferences VALUES(6,'collection-media','{"preset":null,"limit":10}','2025-07-11T03:35:49.441Z','2025-07-11T03:35:24.875Z');
INSERT INTO payload_preferences VALUES(7,'collection-products','{"preset":null}','2025-07-11T03:38:01.492Z','2025-07-11T03:38:01.496Z');
INSERT INTO payload_preferences VALUES(8,'collection-orders','{"preset":null}','2025-07-11T03:38:04.332Z','2025-07-11T03:38:04.335Z');
INSERT INTO payload_preferences VALUES(9,'collection-bookings','{"preset":null}','2025-07-11T03:38:05.736Z','2025-07-11T03:38:05.738Z');
INSERT INTO payload_preferences VALUES(10,'collection-pages','{"preset":null}','2025-07-11T03:38:07.375Z','2025-07-11T03:38:07.378Z');
INSERT INTO payload_preferences VALUES(11,'collection-categories','{"preset":null}','2025-07-11T03:39:00.145Z','2025-07-11T03:39:00.147Z');
INSERT INTO payload_preferences VALUES(12,'collection-redirects','{"preset":null}','2025-07-11T03:39:05.924Z','2025-07-11T03:39:05.926Z');
INSERT INTO payload_preferences VALUES(13,'collection-forms','{"preset":null}','2025-07-11T03:39:08.905Z','2025-07-11T03:39:08.907Z');
INSERT INTO payload_preferences VALUES(14,'collection-form-submissions','{"preset":null}','2025-07-11T03:39:09.995Z','2025-07-11T03:39:09.997Z');
INSERT INTO payload_preferences VALUES(15,'collection-search','{"preset":null}','2025-07-11T03:39:14.946Z','2025-07-11T03:39:14.950Z');
INSERT INTO payload_preferences VALUES(16,'collection-about','{"preset":null}','2025-07-27T19:21:30.497Z','2025-07-27T19:21:30.501Z');
CREATE TABLE IF NOT EXISTS `payload_preferences_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`users_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
  );
INSERT INTO payload_preferences_rels VALUES(1,NULL,1,'user',1);
INSERT INTO payload_preferences_rels VALUES(5,NULL,3,'user',2);
INSERT INTO payload_preferences_rels VALUES(7,NULL,2,'user',1);
INSERT INTO payload_preferences_rels VALUES(8,NULL,6,'user',1);
INSERT INTO payload_preferences_rels VALUES(9,NULL,7,'user',1);
INSERT INTO payload_preferences_rels VALUES(10,NULL,8,'user',1);
INSERT INTO payload_preferences_rels VALUES(11,NULL,9,'user',1);
INSERT INTO payload_preferences_rels VALUES(12,NULL,10,'user',1);
INSERT INTO payload_preferences_rels VALUES(13,NULL,11,'user',1);
INSERT INTO payload_preferences_rels VALUES(14,NULL,12,'user',1);
INSERT INTO payload_preferences_rels VALUES(15,NULL,13,'user',1);
INSERT INTO payload_preferences_rels VALUES(16,NULL,14,'user',1);
INSERT INTO payload_preferences_rels VALUES(17,NULL,15,'user',1);
INSERT INTO payload_preferences_rels VALUES(18,NULL,4,'user',2);
INSERT INTO payload_preferences_rels VALUES(19,NULL,4,'user',2);
INSERT INTO payload_preferences_rels VALUES(20,NULL,5,'user',2);
INSERT INTO payload_preferences_rels VALUES(21,NULL,16,'user',1);
CREATE TABLE IF NOT EXISTS `payload_migrations` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`name` text,
  	`batch` numeric,
  	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
INSERT INTO payload_migrations VALUES(1,'20250711_022531_initial',1,'2025-07-11T02:26:33.406Z','2025-07-11T02:26:33.470Z');
INSERT INTO payload_migrations VALUES(2,'20250727_210737',2,'2025-07-27T21:12:23.099Z','2025-07-27T21:12:23.122Z');
CREATE TABLE IF NOT EXISTS `header_nav_items` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`link_type` text DEFAULT 'reference',
  	`link_new_tab` integer,
  	`link_url` text,
  	`link_label` text NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `header`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `header` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`updated_at` text,
  	`created_at` text
  );
CREATE TABLE IF NOT EXISTS `header_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`pages_id` integer,
  	`posts_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `header`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `footer_nav_items` (
  	`_order` integer NOT NULL,
  	`_parent_id` integer NOT NULL,
  	`id` text PRIMARY KEY NOT NULL,
  	`link_type` text DEFAULT 'reference',
  	`link_new_tab` integer,
  	`link_url` text,
  	`link_label` text NOT NULL,
  	FOREIGN KEY (`_parent_id`) REFERENCES `footer`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS `footer` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`updated_at` text,
  	`created_at` text
  );
CREATE TABLE IF NOT EXISTS `footer_rels` (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`pages_id` integer,
  	`posts_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `footer`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	`id` integer PRIMARY KEY NOT NULL,
  	`order` integer,
  	`parent_id` integer NOT NULL,
  	`path` text NOT NULL,
  	`about_id` integer,
  	`artwork_id` integer,
  	`products_id` integer,
  	`orders_id` integer,
  	`pages_id` integer,
  	`posts_id` integer,
  	`media_id` integer,
  	`categories_id` integer,
  	`users_id` integer,
  	`redirects_id` integer,
  	`forms_id` integer,
  	`form_submissions_id` integer,
  	`search_id` integer,
  	`payload_jobs_id` integer,
  	FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`about_id`) REFERENCES `about`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`artwork_id`) REFERENCES `artwork`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`products_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`orders_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`categories_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`redirects_id`) REFERENCES `redirects`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`forms_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`form_submissions_id`) REFERENCES `form_submissions`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`search_id`) REFERENCES `search`(`id`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (`payload_jobs_id`) REFERENCES `payload_jobs`(`id`) ON UPDATE no action ON DELETE cascade
  );
CREATE INDEX `artwork_image_idx` ON `artwork` (`image_id`);
CREATE INDEX `artwork_slug_idx` ON `artwork` (`slug`);
CREATE INDEX `artwork_updated_at_idx` ON `artwork` (`updated_at`);
CREATE INDEX `artwork_created_at_idx` ON `artwork` (`created_at`);
CREATE INDEX `artwork__status_idx` ON `artwork` (`_status`);
CREATE INDEX `_artwork_v_parent_idx` ON `_artwork_v` (`parent_id`);
CREATE INDEX `_artwork_v_version_version_image_idx` ON `_artwork_v` (`version_image_id`);
CREATE INDEX `_artwork_v_version_version_slug_idx` ON `_artwork_v` (`version_slug`);
CREATE INDEX `_artwork_v_version_version_updated_at_idx` ON `_artwork_v` (`version_updated_at`);
CREATE INDEX `_artwork_v_version_version_created_at_idx` ON `_artwork_v` (`version_created_at`);
CREATE INDEX `_artwork_v_version_version__status_idx` ON `_artwork_v` (`version__status`);
CREATE INDEX `_artwork_v_created_at_idx` ON `_artwork_v` (`created_at`);
CREATE INDEX `_artwork_v_updated_at_idx` ON `_artwork_v` (`updated_at`);
CREATE INDEX `_artwork_v_latest_idx` ON `_artwork_v` (`latest`);
CREATE INDEX `_artwork_v_autosave_idx` ON `_artwork_v` (`autosave`);
CREATE INDEX `products_artwork_idx` ON `products` (`artwork_id`);
CREATE INDEX `products_slug_idx` ON `products` (`slug`);
CREATE INDEX `products_updated_at_idx` ON `products` (`updated_at`);
CREATE INDEX `products_created_at_idx` ON `products` (`created_at`);
CREATE INDEX `orders_items_order_idx` ON `orders_items` (`_order`);
CREATE INDEX `orders_items_parent_id_idx` ON `orders_items` (`_parent_id`);
CREATE INDEX `orders_items_product_idx` ON `orders_items` (`product_id`);
CREATE UNIQUE INDEX `orders_order_number_idx` ON `orders` (`order_number`);
CREATE INDEX `orders_updated_at_idx` ON `orders` (`updated_at`);
CREATE INDEX `orders_created_at_idx` ON `orders` (`created_at`);
CREATE INDEX `pages_hero_links_order_idx` ON `pages_hero_links` (`_order`);
CREATE INDEX `pages_hero_links_parent_id_idx` ON `pages_hero_links` (`_parent_id`);
CREATE INDEX `pages_blocks_cta_links_order_idx` ON `pages_blocks_cta_links` (`_order`);
CREATE INDEX `pages_blocks_cta_links_parent_id_idx` ON `pages_blocks_cta_links` (`_parent_id`);
CREATE INDEX `pages_blocks_cta_order_idx` ON `pages_blocks_cta` (`_order`);
CREATE INDEX `pages_blocks_cta_parent_id_idx` ON `pages_blocks_cta` (`_parent_id`);
CREATE INDEX `pages_blocks_cta_path_idx` ON `pages_blocks_cta` (`_path`);
CREATE INDEX `pages_blocks_content_columns_order_idx` ON `pages_blocks_content_columns` (`_order`);
CREATE INDEX `pages_blocks_content_columns_parent_id_idx` ON `pages_blocks_content_columns` (`_parent_id`);
CREATE INDEX `pages_blocks_content_order_idx` ON `pages_blocks_content` (`_order`);
CREATE INDEX `pages_blocks_content_parent_id_idx` ON `pages_blocks_content` (`_parent_id`);
CREATE INDEX `pages_blocks_content_path_idx` ON `pages_blocks_content` (`_path`);
CREATE INDEX `pages_blocks_media_block_order_idx` ON `pages_blocks_media_block` (`_order`);
CREATE INDEX `pages_blocks_media_block_parent_id_idx` ON `pages_blocks_media_block` (`_parent_id`);
CREATE INDEX `pages_blocks_media_block_path_idx` ON `pages_blocks_media_block` (`_path`);
CREATE INDEX `pages_blocks_media_block_media_idx` ON `pages_blocks_media_block` (`media_id`);
CREATE INDEX `pages_blocks_archive_order_idx` ON `pages_blocks_archive` (`_order`);
CREATE INDEX `pages_blocks_archive_parent_id_idx` ON `pages_blocks_archive` (`_parent_id`);
CREATE INDEX `pages_blocks_archive_path_idx` ON `pages_blocks_archive` (`_path`);
CREATE INDEX `pages_blocks_form_block_order_idx` ON `pages_blocks_form_block` (`_order`);
CREATE INDEX `pages_blocks_form_block_parent_id_idx` ON `pages_blocks_form_block` (`_parent_id`);
CREATE INDEX `pages_blocks_form_block_path_idx` ON `pages_blocks_form_block` (`_path`);
CREATE INDEX `pages_blocks_form_block_form_idx` ON `pages_blocks_form_block` (`form_id`);
CREATE INDEX `pages_hero_hero_media_idx` ON `pages` (`hero_media_id`);
CREATE INDEX `pages_meta_meta_image_idx` ON `pages` (`meta_image_id`);
CREATE INDEX `pages_slug_idx` ON `pages` (`slug`);
CREATE INDEX `pages_updated_at_idx` ON `pages` (`updated_at`);
CREATE INDEX `pages_created_at_idx` ON `pages` (`created_at`);
CREATE INDEX `pages__status_idx` ON `pages` (`_status`);
CREATE INDEX `pages_rels_order_idx` ON `pages_rels` (`order`);
CREATE INDEX `pages_rels_parent_idx` ON `pages_rels` (`parent_id`);
CREATE INDEX `pages_rels_path_idx` ON `pages_rels` (`path`);
CREATE INDEX `pages_rels_pages_id_idx` ON `pages_rels` (`pages_id`);
CREATE INDEX `pages_rels_posts_id_idx` ON `pages_rels` (`posts_id`);
CREATE INDEX `pages_rels_categories_id_idx` ON `pages_rels` (`categories_id`);
CREATE INDEX `_pages_v_version_hero_links_order_idx` ON `_pages_v_version_hero_links` (`_order`);
CREATE INDEX `_pages_v_version_hero_links_parent_id_idx` ON `_pages_v_version_hero_links` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_cta_links_order_idx` ON `_pages_v_blocks_cta_links` (`_order`);
CREATE INDEX `_pages_v_blocks_cta_links_parent_id_idx` ON `_pages_v_blocks_cta_links` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_cta_order_idx` ON `_pages_v_blocks_cta` (`_order`);
CREATE INDEX `_pages_v_blocks_cta_parent_id_idx` ON `_pages_v_blocks_cta` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_cta_path_idx` ON `_pages_v_blocks_cta` (`_path`);
CREATE INDEX `_pages_v_blocks_content_columns_order_idx` ON `_pages_v_blocks_content_columns` (`_order`);
CREATE INDEX `_pages_v_blocks_content_columns_parent_id_idx` ON `_pages_v_blocks_content_columns` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_content_order_idx` ON `_pages_v_blocks_content` (`_order`);
CREATE INDEX `_pages_v_blocks_content_parent_id_idx` ON `_pages_v_blocks_content` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_content_path_idx` ON `_pages_v_blocks_content` (`_path`);
CREATE INDEX `_pages_v_blocks_media_block_order_idx` ON `_pages_v_blocks_media_block` (`_order`);
CREATE INDEX `_pages_v_blocks_media_block_parent_id_idx` ON `_pages_v_blocks_media_block` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_media_block_path_idx` ON `_pages_v_blocks_media_block` (`_path`);
CREATE INDEX `_pages_v_blocks_media_block_media_idx` ON `_pages_v_blocks_media_block` (`media_id`);
CREATE INDEX `_pages_v_blocks_archive_order_idx` ON `_pages_v_blocks_archive` (`_order`);
CREATE INDEX `_pages_v_blocks_archive_parent_id_idx` ON `_pages_v_blocks_archive` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_archive_path_idx` ON `_pages_v_blocks_archive` (`_path`);
CREATE INDEX `_pages_v_blocks_form_block_order_idx` ON `_pages_v_blocks_form_block` (`_order`);
CREATE INDEX `_pages_v_blocks_form_block_parent_id_idx` ON `_pages_v_blocks_form_block` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_form_block_path_idx` ON `_pages_v_blocks_form_block` (`_path`);
CREATE INDEX `_pages_v_blocks_form_block_form_idx` ON `_pages_v_blocks_form_block` (`form_id`);
CREATE INDEX `_pages_v_parent_idx` ON `_pages_v` (`parent_id`);
CREATE INDEX `_pages_v_version_hero_version_hero_media_idx` ON `_pages_v` (`version_hero_media_id`);
CREATE INDEX `_pages_v_version_meta_version_meta_image_idx` ON `_pages_v` (`version_meta_image_id`);
CREATE INDEX `_pages_v_version_version_slug_idx` ON `_pages_v` (`version_slug`);
CREATE INDEX `_pages_v_version_version_updated_at_idx` ON `_pages_v` (`version_updated_at`);
CREATE INDEX `_pages_v_version_version_created_at_idx` ON `_pages_v` (`version_created_at`);
CREATE INDEX `_pages_v_version_version__status_idx` ON `_pages_v` (`version__status`);
CREATE INDEX `_pages_v_created_at_idx` ON `_pages_v` (`created_at`);
CREATE INDEX `_pages_v_updated_at_idx` ON `_pages_v` (`updated_at`);
CREATE INDEX `_pages_v_latest_idx` ON `_pages_v` (`latest`);
CREATE INDEX `_pages_v_autosave_idx` ON `_pages_v` (`autosave`);
CREATE INDEX `_pages_v_rels_order_idx` ON `_pages_v_rels` (`order`);
CREATE INDEX `_pages_v_rels_parent_idx` ON `_pages_v_rels` (`parent_id`);
CREATE INDEX `_pages_v_rels_path_idx` ON `_pages_v_rels` (`path`);
CREATE INDEX `_pages_v_rels_pages_id_idx` ON `_pages_v_rels` (`pages_id`);
CREATE INDEX `_pages_v_rels_posts_id_idx` ON `_pages_v_rels` (`posts_id`);
CREATE INDEX `_pages_v_rels_categories_id_idx` ON `_pages_v_rels` (`categories_id`);
CREATE INDEX `posts_populated_authors_order_idx` ON `posts_populated_authors` (`_order`);
CREATE INDEX `posts_populated_authors_parent_id_idx` ON `posts_populated_authors` (`_parent_id`);
CREATE INDEX `posts_hero_image_idx` ON `posts` (`hero_image_id`);
CREATE INDEX `posts_meta_meta_image_idx` ON `posts` (`meta_image_id`);
CREATE INDEX `posts_slug_idx` ON `posts` (`slug`);
CREATE INDEX `posts_updated_at_idx` ON `posts` (`updated_at`);
CREATE INDEX `posts_created_at_idx` ON `posts` (`created_at`);
CREATE INDEX `posts__status_idx` ON `posts` (`_status`);
CREATE INDEX `posts_rels_order_idx` ON `posts_rels` (`order`);
CREATE INDEX `posts_rels_parent_idx` ON `posts_rels` (`parent_id`);
CREATE INDEX `posts_rels_path_idx` ON `posts_rels` (`path`);
CREATE INDEX `posts_rels_posts_id_idx` ON `posts_rels` (`posts_id`);
CREATE INDEX `posts_rels_categories_id_idx` ON `posts_rels` (`categories_id`);
CREATE INDEX `posts_rels_users_id_idx` ON `posts_rels` (`users_id`);
CREATE INDEX `_posts_v_version_populated_authors_order_idx` ON `_posts_v_version_populated_authors` (`_order`);
CREATE INDEX `_posts_v_version_populated_authors_parent_id_idx` ON `_posts_v_version_populated_authors` (`_parent_id`);
CREATE INDEX `_posts_v_parent_idx` ON `_posts_v` (`parent_id`);
CREATE INDEX `_posts_v_version_version_hero_image_idx` ON `_posts_v` (`version_hero_image_id`);
CREATE INDEX `_posts_v_version_meta_version_meta_image_idx` ON `_posts_v` (`version_meta_image_id`);
CREATE INDEX `_posts_v_version_version_slug_idx` ON `_posts_v` (`version_slug`);
CREATE INDEX `_posts_v_version_version_updated_at_idx` ON `_posts_v` (`version_updated_at`);
CREATE INDEX `_posts_v_version_version_created_at_idx` ON `_posts_v` (`version_created_at`);
CREATE INDEX `_posts_v_version_version__status_idx` ON `_posts_v` (`version__status`);
CREATE INDEX `_posts_v_created_at_idx` ON `_posts_v` (`created_at`);
CREATE INDEX `_posts_v_updated_at_idx` ON `_posts_v` (`updated_at`);
CREATE INDEX `_posts_v_latest_idx` ON `_posts_v` (`latest`);
CREATE INDEX `_posts_v_autosave_idx` ON `_posts_v` (`autosave`);
CREATE INDEX `_posts_v_rels_order_idx` ON `_posts_v_rels` (`order`);
CREATE INDEX `_posts_v_rels_parent_idx` ON `_posts_v_rels` (`parent_id`);
CREATE INDEX `_posts_v_rels_path_idx` ON `_posts_v_rels` (`path`);
CREATE INDEX `_posts_v_rels_posts_id_idx` ON `_posts_v_rels` (`posts_id`);
CREATE INDEX `_posts_v_rels_categories_id_idx` ON `_posts_v_rels` (`categories_id`);
CREATE INDEX `_posts_v_rels_users_id_idx` ON `_posts_v_rels` (`users_id`);
CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);
CREATE UNIQUE INDEX `media_filename_idx` ON `media` (`filename`);
CREATE INDEX `media_sizes_thumbnail_sizes_thumbnail_filename_idx` ON `media` (`sizes_thumbnail_filename`);
CREATE INDEX `media_sizes_square_sizes_square_filename_idx` ON `media` (`sizes_square_filename`);
CREATE INDEX `media_sizes_small_sizes_small_filename_idx` ON `media` (`sizes_small_filename`);
CREATE INDEX `media_sizes_medium_sizes_medium_filename_idx` ON `media` (`sizes_medium_filename`);
CREATE INDEX `media_sizes_large_sizes_large_filename_idx` ON `media` (`sizes_large_filename`);
CREATE INDEX `media_sizes_xlarge_sizes_xlarge_filename_idx` ON `media` (`sizes_xlarge_filename`);
CREATE INDEX `media_sizes_og_sizes_og_filename_idx` ON `media` (`sizes_og_filename`);
CREATE INDEX `categories_breadcrumbs_order_idx` ON `categories_breadcrumbs` (`_order`);
CREATE INDEX `categories_breadcrumbs_parent_id_idx` ON `categories_breadcrumbs` (`_parent_id`);
CREATE INDEX `categories_breadcrumbs_doc_idx` ON `categories_breadcrumbs` (`doc_id`);
CREATE INDEX `categories_slug_idx` ON `categories` (`slug`);
CREATE INDEX `categories_parent_idx` ON `categories` (`parent_id`);
CREATE INDEX `categories_updated_at_idx` ON `categories` (`updated_at`);
CREATE INDEX `categories_created_at_idx` ON `categories` (`created_at`);
CREATE INDEX `users_sessions_order_idx` ON `users_sessions` (`_order`);
CREATE INDEX `users_sessions_parent_id_idx` ON `users_sessions` (`_parent_id`);
CREATE INDEX `users_updated_at_idx` ON `users` (`updated_at`);
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);
CREATE UNIQUE INDEX `redirects_from_idx` ON `redirects` (`from`);
CREATE INDEX `redirects_updated_at_idx` ON `redirects` (`updated_at`);
CREATE INDEX `redirects_created_at_idx` ON `redirects` (`created_at`);
CREATE INDEX `redirects_rels_order_idx` ON `redirects_rels` (`order`);
CREATE INDEX `redirects_rels_parent_idx` ON `redirects_rels` (`parent_id`);
CREATE INDEX `redirects_rels_path_idx` ON `redirects_rels` (`path`);
CREATE INDEX `redirects_rels_pages_id_idx` ON `redirects_rels` (`pages_id`);
CREATE INDEX `redirects_rels_posts_id_idx` ON `redirects_rels` (`posts_id`);
CREATE INDEX `forms_blocks_checkbox_order_idx` ON `forms_blocks_checkbox` (`_order`);
CREATE INDEX `forms_blocks_checkbox_parent_id_idx` ON `forms_blocks_checkbox` (`_parent_id`);
CREATE INDEX `forms_blocks_checkbox_path_idx` ON `forms_blocks_checkbox` (`_path`);
CREATE INDEX `forms_blocks_country_order_idx` ON `forms_blocks_country` (`_order`);
CREATE INDEX `forms_blocks_country_parent_id_idx` ON `forms_blocks_country` (`_parent_id`);
CREATE INDEX `forms_blocks_country_path_idx` ON `forms_blocks_country` (`_path`);
CREATE INDEX `forms_blocks_email_order_idx` ON `forms_blocks_email` (`_order`);
CREATE INDEX `forms_blocks_email_parent_id_idx` ON `forms_blocks_email` (`_parent_id`);
CREATE INDEX `forms_blocks_email_path_idx` ON `forms_blocks_email` (`_path`);
CREATE INDEX `forms_blocks_message_order_idx` ON `forms_blocks_message` (`_order`);
CREATE INDEX `forms_blocks_message_parent_id_idx` ON `forms_blocks_message` (`_parent_id`);
CREATE INDEX `forms_blocks_message_path_idx` ON `forms_blocks_message` (`_path`);
CREATE INDEX `forms_blocks_number_order_idx` ON `forms_blocks_number` (`_order`);
CREATE INDEX `forms_blocks_number_parent_id_idx` ON `forms_blocks_number` (`_parent_id`);
CREATE INDEX `forms_blocks_number_path_idx` ON `forms_blocks_number` (`_path`);
CREATE INDEX `forms_blocks_select_options_order_idx` ON `forms_blocks_select_options` (`_order`);
CREATE INDEX `forms_blocks_select_options_parent_id_idx` ON `forms_blocks_select_options` (`_parent_id`);
CREATE INDEX `forms_blocks_select_order_idx` ON `forms_blocks_select` (`_order`);
CREATE INDEX `forms_blocks_select_parent_id_idx` ON `forms_blocks_select` (`_parent_id`);
CREATE INDEX `forms_blocks_select_path_idx` ON `forms_blocks_select` (`_path`);
CREATE INDEX `forms_blocks_state_order_idx` ON `forms_blocks_state` (`_order`);
CREATE INDEX `forms_blocks_state_parent_id_idx` ON `forms_blocks_state` (`_parent_id`);
CREATE INDEX `forms_blocks_state_path_idx` ON `forms_blocks_state` (`_path`);
CREATE INDEX `forms_blocks_text_order_idx` ON `forms_blocks_text` (`_order`);
CREATE INDEX `forms_blocks_text_parent_id_idx` ON `forms_blocks_text` (`_parent_id`);
CREATE INDEX `forms_blocks_text_path_idx` ON `forms_blocks_text` (`_path`);
CREATE INDEX `forms_blocks_textarea_order_idx` ON `forms_blocks_textarea` (`_order`);
CREATE INDEX `forms_blocks_textarea_parent_id_idx` ON `forms_blocks_textarea` (`_parent_id`);
CREATE INDEX `forms_blocks_textarea_path_idx` ON `forms_blocks_textarea` (`_path`);
CREATE INDEX `forms_emails_order_idx` ON `forms_emails` (`_order`);
CREATE INDEX `forms_emails_parent_id_idx` ON `forms_emails` (`_parent_id`);
CREATE INDEX `forms_updated_at_idx` ON `forms` (`updated_at`);
CREATE INDEX `forms_created_at_idx` ON `forms` (`created_at`);
CREATE INDEX `form_submissions_submission_data_order_idx` ON `form_submissions_submission_data` (`_order`);
CREATE INDEX `form_submissions_submission_data_parent_id_idx` ON `form_submissions_submission_data` (`_parent_id`);
CREATE INDEX `form_submissions_form_idx` ON `form_submissions` (`form_id`);
CREATE INDEX `form_submissions_updated_at_idx` ON `form_submissions` (`updated_at`);
CREATE INDEX `form_submissions_created_at_idx` ON `form_submissions` (`created_at`);
CREATE INDEX `search_categories_order_idx` ON `search_categories` (`_order`);
CREATE INDEX `search_categories_parent_id_idx` ON `search_categories` (`_parent_id`);
CREATE INDEX `search_slug_idx` ON `search` (`slug`);
CREATE INDEX `search_meta_meta_image_idx` ON `search` (`meta_image_id`);
CREATE INDEX `search_updated_at_idx` ON `search` (`updated_at`);
CREATE INDEX `search_created_at_idx` ON `search` (`created_at`);
CREATE INDEX `search_rels_order_idx` ON `search_rels` (`order`);
CREATE INDEX `search_rels_parent_idx` ON `search_rels` (`parent_id`);
CREATE INDEX `search_rels_path_idx` ON `search_rels` (`path`);
CREATE INDEX `search_rels_posts_id_idx` ON `search_rels` (`posts_id`);
CREATE INDEX `payload_jobs_log_order_idx` ON `payload_jobs_log` (`_order`);
CREATE INDEX `payload_jobs_log_parent_id_idx` ON `payload_jobs_log` (`_parent_id`);
CREATE INDEX `payload_jobs_completed_at_idx` ON `payload_jobs` (`completed_at`);
CREATE INDEX `payload_jobs_total_tried_idx` ON `payload_jobs` (`total_tried`);
CREATE INDEX `payload_jobs_has_error_idx` ON `payload_jobs` (`has_error`);
CREATE INDEX `payload_jobs_task_slug_idx` ON `payload_jobs` (`task_slug`);
CREATE INDEX `payload_jobs_queue_idx` ON `payload_jobs` (`queue`);
CREATE INDEX `payload_jobs_wait_until_idx` ON `payload_jobs` (`wait_until`);
CREATE INDEX `payload_jobs_processing_idx` ON `payload_jobs` (`processing`);
CREATE INDEX `payload_jobs_updated_at_idx` ON `payload_jobs` (`updated_at`);
CREATE INDEX `payload_jobs_created_at_idx` ON `payload_jobs` (`created_at`);
CREATE INDEX `payload_locked_documents_global_slug_idx` ON `payload_locked_documents` (`global_slug`);
CREATE INDEX `payload_locked_documents_updated_at_idx` ON `payload_locked_documents` (`updated_at`);
CREATE INDEX `payload_locked_documents_created_at_idx` ON `payload_locked_documents` (`created_at`);
CREATE INDEX `payload_preferences_key_idx` ON `payload_preferences` (`key`);
CREATE INDEX `payload_preferences_updated_at_idx` ON `payload_preferences` (`updated_at`);
CREATE INDEX `payload_preferences_created_at_idx` ON `payload_preferences` (`created_at`);
CREATE INDEX `payload_preferences_rels_order_idx` ON `payload_preferences_rels` (`order`);
CREATE INDEX `payload_preferences_rels_parent_idx` ON `payload_preferences_rels` (`parent_id`);
CREATE INDEX `payload_preferences_rels_path_idx` ON `payload_preferences_rels` (`path`);
CREATE INDEX `payload_preferences_rels_users_id_idx` ON `payload_preferences_rels` (`users_id`);
CREATE INDEX `payload_migrations_updated_at_idx` ON `payload_migrations` (`updated_at`);
CREATE INDEX `payload_migrations_created_at_idx` ON `payload_migrations` (`created_at`);
CREATE INDEX `header_nav_items_order_idx` ON `header_nav_items` (`_order`);
CREATE INDEX `header_nav_items_parent_id_idx` ON `header_nav_items` (`_parent_id`);
CREATE INDEX `header_rels_order_idx` ON `header_rels` (`order`);
CREATE INDEX `header_rels_parent_idx` ON `header_rels` (`parent_id`);
CREATE INDEX `header_rels_path_idx` ON `header_rels` (`path`);
CREATE INDEX `header_rels_pages_id_idx` ON `header_rels` (`pages_id`);
CREATE INDEX `header_rels_posts_id_idx` ON `header_rels` (`posts_id`);
CREATE INDEX `footer_nav_items_order_idx` ON `footer_nav_items` (`_order`);
CREATE INDEX `footer_nav_items_parent_id_idx` ON `footer_nav_items` (`_parent_id`);
CREATE INDEX `footer_rels_order_idx` ON `footer_rels` (`order`);
CREATE INDEX `footer_rels_parent_idx` ON `footer_rels` (`parent_id`);
CREATE INDEX `footer_rels_path_idx` ON `footer_rels` (`path`);
CREATE INDEX `footer_rels_pages_id_idx` ON `footer_rels` (`pages_id`);
CREATE INDEX `footer_rels_posts_id_idx` ON `footer_rels` (`posts_id`);
CREATE INDEX `payload_locked_documents_rels_order_idx` ON `payload_locked_documents_rels` (`order`);
CREATE INDEX `payload_locked_documents_rels_parent_idx` ON `payload_locked_documents_rels` (`parent_id`);
CREATE INDEX `payload_locked_documents_rels_path_idx` ON `payload_locked_documents_rels` (`path`);
CREATE INDEX `payload_locked_documents_rels_about_id_idx` ON `payload_locked_documents_rels` (`about_id`);
CREATE INDEX `payload_locked_documents_rels_artwork_id_idx` ON `payload_locked_documents_rels` (`artwork_id`);
CREATE INDEX `payload_locked_documents_rels_products_id_idx` ON `payload_locked_documents_rels` (`products_id`);
CREATE INDEX `payload_locked_documents_rels_orders_id_idx` ON `payload_locked_documents_rels` (`orders_id`);
CREATE INDEX `payload_locked_documents_rels_pages_id_idx` ON `payload_locked_documents_rels` (`pages_id`);
CREATE INDEX `payload_locked_documents_rels_posts_id_idx` ON `payload_locked_documents_rels` (`posts_id`);
CREATE INDEX `payload_locked_documents_rels_media_id_idx` ON `payload_locked_documents_rels` (`media_id`);
CREATE INDEX `payload_locked_documents_rels_categories_id_idx` ON `payload_locked_documents_rels` (`categories_id`);
CREATE INDEX `payload_locked_documents_rels_users_id_idx` ON `payload_locked_documents_rels` (`users_id`);
CREATE INDEX `payload_locked_documents_rels_redirects_id_idx` ON `payload_locked_documents_rels` (`redirects_id`);
CREATE INDEX `payload_locked_documents_rels_forms_id_idx` ON `payload_locked_documents_rels` (`forms_id`);
CREATE INDEX `payload_locked_documents_rels_form_submissions_id_idx` ON `payload_locked_documents_rels` (`form_submissions_id`);
CREATE INDEX `payload_locked_documents_rels_search_id_idx` ON `payload_locked_documents_rels` (`search_id`);
CREATE INDEX `payload_locked_documents_rels_payload_jobs_id_idx` ON `payload_locked_documents_rels` (`payload_jobs_id`);
COMMIT;
