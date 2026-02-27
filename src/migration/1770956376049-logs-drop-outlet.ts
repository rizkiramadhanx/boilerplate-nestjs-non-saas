import { MigrationInterface, QueryRunner } from 'typeorm';

export class LogsDropOutlet1770956376049 implements MigrationInterface {
  name = 'LogsDropOutlet1770956376049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "logs" DROP CONSTRAINT IF EXISTS "FK_718e2c8676a28ac2c3ed8667ee4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs" DROP COLUMN IF EXISTS "outlet_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "logs" ADD "outlet_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "logs" ADD CONSTRAINT "FK_718e2c8676a28ac2c3ed8667ee4" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
