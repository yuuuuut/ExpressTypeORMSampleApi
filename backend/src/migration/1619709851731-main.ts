import {MigrationInterface, QueryRunner} from "typeorm";

<<<<<<< HEAD:backend/src/migration/1619755970953-main.ts
export class main1619755970953 implements MigrationInterface {
    name = 'main1619755970953'
=======
export class main1619709851731 implements MigrationInterface {
    name = 'main1619709851731'
>>>>>>> 9ae87f48a079abc2a5e4ead3fb945e3c5cb152b2:backend/src/migration/1619709851731-main.ts

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `tags` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_d90243459a697eadb8ad56e909` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users` (`id` varchar(255) NOT NULL, `display_name` varchar(255) NOT NULL, `photo_url` varchar(255) NOT NULL, `isAdmin` tinyint NOT NULL DEFAULT 0, `profile_id` int NULL, UNIQUE INDEX `REL_23371445bd80cb3e413089551b` (`profile_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `rooms` (`id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `profiles` (`id` int NOT NULL AUTO_INCREMENT, `line_id` varchar(255) NULL, `twitter_id` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `messages` (`id` int NOT NULL AUTO_INCREMENT, `kind` varchar(255) NOT NULL, `isApproval` tinyint NOT NULL DEFAULT 0, `rejected` tinyint NOT NULL DEFAULT 0, `checked` tinyint NOT NULL DEFAULT 0, `user_id` varchar(255) NOT NULL, `room_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `notifications` (`id` int NOT NULL AUTO_INCREMENT, `action` varchar(255) NOT NULL, `checked` tinyint NOT NULL DEFAULT 0, `visiter_id` varchar(255) NOT NULL, `visited_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
<<<<<<< HEAD:backend/src/migration/1619755970953-main.ts
        await queryRunner.query("CREATE TABLE `relationships` (`id` int NOT NULL AUTO_INCREMENT, `followed_id` varchar(255) NOT NULL, `follower_id` varchar(255) NOT NULL, UNIQUE INDEX `IDX_39757c87e92af8e99014d0c9f7` (`followed_id`, `follower_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
=======
        await queryRunner.query("CREATE TABLE `relationships` (`user_id` varchar(255) NOT NULL, `follow_id` varchar(255) NOT NULL, INDEX `IDX_19361d881caedba931906f7cf7` (`user_id`), INDEX `IDX_d3d3a815ec8088e28e6d9e57f2` (`follow_id`), PRIMARY KEY (`user_id`, `follow_id`)) ENGINE=InnoDB");
>>>>>>> 9ae87f48a079abc2a5e4ead3fb945e3c5cb152b2:backend/src/migration/1619709851731-main.ts
        await queryRunner.query("CREATE TABLE `users_tags` (`user_id` varchar(255) NOT NULL, `tag_id` int NOT NULL, INDEX `IDX_37fe67a713a33c9385ede5782d` (`user_id`), INDEX `IDX_ee316e71a670dca8d696490aee` (`tag_id`), PRIMARY KEY (`user_id`, `tag_id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `entries` (`user_id` varchar(255) NOT NULL, `room_id` varchar(255) NOT NULL, INDEX `IDX_73b250bca5e5a24e1343da5616` (`user_id`), INDEX `IDX_5ca70dfb03e334c366fdd6cead` (`room_id`), PRIMARY KEY (`user_id`, `room_id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_23371445bd80cb3e413089551bf` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `messages` ADD CONSTRAINT `FK_830a3c1d92614d1495418c46736` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `messages` ADD CONSTRAINT `FK_1dda4fc8dbeeff2ee71f0088ba0` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `notifications` ADD CONSTRAINT `FK_51023e5fcb6560552eb8163011a` FOREIGN KEY (`visiter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `notifications` ADD CONSTRAINT `FK_181a20d87a9a6155ce9a5fb63e2` FOREIGN KEY (`visited_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `relationships` ADD CONSTRAINT `FK_88419243671c0faad35302ef520` FOREIGN KEY (`followed_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `relationships` ADD CONSTRAINT `FK_04e920a07eea34bdb48c9a0f3cc` FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_tags` ADD CONSTRAINT `FK_37fe67a713a33c9385ede5782df` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_tags` ADD CONSTRAINT `FK_ee316e71a670dca8d696490aeeb` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `entries` ADD CONSTRAINT `FK_73b250bca5e5a24e1343da56168` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `entries` ADD CONSTRAINT `FK_5ca70dfb03e334c366fdd6cead4` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `entries` DROP FOREIGN KEY `FK_5ca70dfb03e334c366fdd6cead4`");
        await queryRunner.query("ALTER TABLE `entries` DROP FOREIGN KEY `FK_73b250bca5e5a24e1343da56168`");
        await queryRunner.query("ALTER TABLE `users_tags` DROP FOREIGN KEY `FK_ee316e71a670dca8d696490aeeb`");
        await queryRunner.query("ALTER TABLE `users_tags` DROP FOREIGN KEY `FK_37fe67a713a33c9385ede5782df`");
        await queryRunner.query("ALTER TABLE `relationships` DROP FOREIGN KEY `FK_04e920a07eea34bdb48c9a0f3cc`");
        await queryRunner.query("ALTER TABLE `relationships` DROP FOREIGN KEY `FK_88419243671c0faad35302ef520`");
        await queryRunner.query("ALTER TABLE `notifications` DROP FOREIGN KEY `FK_181a20d87a9a6155ce9a5fb63e2`");
        await queryRunner.query("ALTER TABLE `notifications` DROP FOREIGN KEY `FK_51023e5fcb6560552eb8163011a`");
        await queryRunner.query("ALTER TABLE `messages` DROP FOREIGN KEY `FK_1dda4fc8dbeeff2ee71f0088ba0`");
        await queryRunner.query("ALTER TABLE `messages` DROP FOREIGN KEY `FK_830a3c1d92614d1495418c46736`");
        await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_23371445bd80cb3e413089551bf`");
        await queryRunner.query("DROP INDEX `IDX_5ca70dfb03e334c366fdd6cead` ON `entries`");
        await queryRunner.query("DROP INDEX `IDX_73b250bca5e5a24e1343da5616` ON `entries`");
        await queryRunner.query("DROP TABLE `entries`");
        await queryRunner.query("DROP INDEX `IDX_ee316e71a670dca8d696490aee` ON `users_tags`");
        await queryRunner.query("DROP INDEX `IDX_37fe67a713a33c9385ede5782d` ON `users_tags`");
        await queryRunner.query("DROP TABLE `users_tags`");
<<<<<<< HEAD:backend/src/migration/1619755970953-main.ts
        await queryRunner.query("DROP INDEX `IDX_39757c87e92af8e99014d0c9f7` ON `relationships`");
=======
        await queryRunner.query("DROP INDEX `IDX_d3d3a815ec8088e28e6d9e57f2` ON `relationships`");
        await queryRunner.query("DROP INDEX `IDX_19361d881caedba931906f7cf7` ON `relationships`");
>>>>>>> 9ae87f48a079abc2a5e4ead3fb945e3c5cb152b2:backend/src/migration/1619709851731-main.ts
        await queryRunner.query("DROP TABLE `relationships`");
        await queryRunner.query("DROP TABLE `notifications`");
        await queryRunner.query("DROP TABLE `messages`");
        await queryRunner.query("DROP TABLE `profiles`");
        await queryRunner.query("DROP TABLE `rooms`");
        await queryRunner.query("DROP INDEX `REL_23371445bd80cb3e413089551b` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
        await queryRunner.query("DROP INDEX `IDX_d90243459a697eadb8ad56e909` ON `tags`");
        await queryRunner.query("DROP TABLE `tags`");
    }

}
