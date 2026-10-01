-- Store guest contact details on holds so the admin dashboard can show who
-- requested dates (enquiry mode) and convert holds without re-entering data.
ALTER TABLE "holds" ADD COLUMN "guestName" TEXT;
ALTER TABLE "holds" ADD COLUMN "guestEmail" TEXT;
