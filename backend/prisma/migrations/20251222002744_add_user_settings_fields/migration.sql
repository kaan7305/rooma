-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "activity_status" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "booking_updates" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "message_notifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "profile_visibility" VARCHAR(20) NOT NULL DEFAULT 'public',
ADD COLUMN     "push_notifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_email" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "show_phone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false;
