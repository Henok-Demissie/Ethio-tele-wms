/*
  Warnings:

  - You are about to drop the column `dimensions` on the `products` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sku" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT,
    "unitPrice" REAL NOT NULL,
    "weight" REAL,
    "dimension" TEXT,
    "barcode" TEXT,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "maxStock" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_products" ("barcode", "brand", "category", "createdAt", "description", "id", "isActive", "maxStock", "minStock", "name", "sku", "unitPrice", "updatedAt", "weight") SELECT "barcode", "brand", "category", "createdAt", "description", "id", "isActive", "maxStock", "minStock", "name", "sku", "unitPrice", "updatedAt", "weight" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");
CREATE UNIQUE INDEX "products_barcode_key" ON "products"("barcode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
