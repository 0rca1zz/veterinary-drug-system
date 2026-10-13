-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "cause" TEXT,
    "symptoms" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "examinations" TEXT,
    "recommendedDrugCategories" TEXT,
    "notes" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Disease_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Animal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DrugCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Drug" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "genericName" TEXT NOT NULL,
    "brandName" TEXT,
    "categoryId" TEXT,
    "indications" TEXT,
    "contraindications" TEXT,
    "adverseEffects" TEXT,
    "pregnancyWarning" TEXT,
    "requiresPrescription" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Drug_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DrugCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiseaseDrug" (
    "diseaseId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "recommendLevel" TEXT NOT NULL,
    "reason" TEXT,

    PRIMARY KEY ("diseaseId", "drugId"),
    CONSTRAINT "DiseaseDrug_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DiseaseDrug_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contraindication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "drugId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "species" TEXT,
    "minAgeWeeks" INTEGER,
    "maxAgeWeeks" INTEGER,
    "minWeightKg" REAL,
    "maxWeightKg" REAL,
    "pregnancy" BOOLEAN,
    "severity" TEXT NOT NULL DEFAULT '禁用',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contraindication_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DrugInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "drugAId" TEXT NOT NULL,
    "drugBId" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "DrugInteraction_drugAId_fkey" FOREIGN KEY ("drugAId") REFERENCES "Drug" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DrugInteraction_drugBId_fkey" FOREIGN KEY ("drugBId") REFERENCES "Drug" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "source" TEXT,
    "url" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_AnimalToDrug" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AnimalToDrug_A_fkey" FOREIGN KEY ("A") REFERENCES "Animal" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AnimalToDrug_B_fkey" FOREIGN KEY ("B") REFERENCES "Drug" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Animal_name_key" ON "Animal"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Animal_code_key" ON "Animal"("code");

-- CreateIndex
CREATE INDEX "Disease_speciesId_idx" ON "Disease"("speciesId");

-- CreateIndex
CREATE INDEX "Disease_name_idx" ON "Disease"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DrugCategory_name_key" ON "DrugCategory"("name");

-- CreateIndex
CREATE INDEX "Drug_genericName_idx" ON "Drug"("genericName");

-- CreateIndex
CREATE INDEX "Drug_categoryId_idx" ON "Drug"("categoryId");

-- CreateIndex
CREATE INDEX "DiseaseDrug_drugId_idx" ON "DiseaseDrug"("drugId");

-- CreateIndex
CREATE INDEX "Contraindication_drugId_idx" ON "Contraindication"("drugId");

-- CreateIndex
CREATE INDEX "DrugInteraction_drugBId_idx" ON "DrugInteraction"("drugBId");

-- CreateIndex
CREATE UNIQUE INDEX "DrugInteraction_drugAId_drugBId_key" ON "DrugInteraction"("drugAId", "drugBId");

-- CreateIndex
CREATE UNIQUE INDEX "_AnimalToDrug_AB_unique" ON "_AnimalToDrug"("A", "B");

-- CreateIndex
CREATE INDEX "_AnimalToDrug_B_index" ON "_AnimalToDrug"("B");
