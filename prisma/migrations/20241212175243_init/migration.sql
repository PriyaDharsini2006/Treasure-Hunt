-- CreateTable
CREATE TABLE "QRCode" (
    "email" TEXT NOT NULL,
    "visited" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("email")
);
