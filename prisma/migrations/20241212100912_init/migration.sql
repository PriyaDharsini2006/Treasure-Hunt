-- CreateTable
CREATE TABLE "QRCode" (
    "email" TEXT NOT NULL,
    "visited" TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_email_key" ON "QRCode"("email");
