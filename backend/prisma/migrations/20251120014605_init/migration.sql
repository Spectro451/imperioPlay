-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('cliente', 'empleado', 'admin');

-- CreateEnum
CREATE TYPE "rolIntercambio" AS ENUM ('solicitado', 'entregado');

-- CreateEnum
CREATE TYPE "tipoProducto" AS ENUM ('juego', 'consola');

-- CreateEnum
CREATE TYPE "estadoJuego" AS ENUM ('nuevo', 'usado');

-- CreateEnum
CREATE TYPE "Consola" AS ENUM ('Xbox360', 'XboxOne', 'XboxSeries', 'Ps3', 'Ps4', 'Ps5', 'Switch', 'Switch2');

-- CreateEnum
CREATE TYPE "metodoPago" AS ENUM ('efectivo', 'debito');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "correo" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "precio_base" INTEGER NOT NULL,
    "tipo" "tipoProducto" NOT NULL,
    "descuento_porcentaje" INTEGER,
    "descuento_fijo" INTEGER,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Juego" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "consola" "Consola" NOT NULL,
    "estado" "estadoJuego" NOT NULL,
    "tier" TEXT NOT NULL,
    "fotos" TEXT[],

    CONSTRAINT "Juego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venta" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "metodo_pago" "metodoPago" NOT NULL,
    "vendedor_id" INTEGER NOT NULL,
    "cliente_id" INTEGER,
    "total" INTEGER NOT NULL,
    "descuento_porcentaje" INTEGER,
    "descuento_fijo" INTEGER,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentaJuego" (
    "id" SERIAL NOT NULL,
    "venta_id" INTEGER NOT NULL,
    "juego_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" INTEGER NOT NULL,

    CONSTRAINT "VentaJuego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intercambio" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "metodo_pago" "metodoPago",
    "dinero_extra" INTEGER,
    "vendedor_id" INTEGER NOT NULL,
    "cliente_id" INTEGER,

    CONSTRAINT "Intercambio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intercambioJuego" (
    "id" SERIAL NOT NULL,
    "intercambio_id" INTEGER NOT NULL,
    "juego_id" INTEGER NOT NULL,
    "rol" "rolIntercambio" NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "intercambioJuego_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- AddForeignKey
ALTER TABLE "Juego" ADD CONSTRAINT "Juego_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaJuego" ADD CONSTRAINT "VentaJuego_juego_id_fkey" FOREIGN KEY ("juego_id") REFERENCES "Juego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaJuego" ADD CONSTRAINT "VentaJuego_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intercambio" ADD CONSTRAINT "Intercambio_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intercambioJuego" ADD CONSTRAINT "intercambioJuego_intercambio_id_fkey" FOREIGN KEY ("intercambio_id") REFERENCES "Intercambio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intercambioJuego" ADD CONSTRAINT "intercambioJuego_juego_id_fkey" FOREIGN KEY ("juego_id") REFERENCES "Juego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
