import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleUserFields1684885283000 implements MigrationInterface {
    name = 'AddGoogleUserFields1684885283000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatarUrl" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isGoogleUser" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isGoogleUser"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
    }
} 