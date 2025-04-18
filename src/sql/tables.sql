-- Tabla CATEGORIA
CREATE TABLE CATEGORIA (
    ID SERIAL PRIMARY KEY,
    DESCRIPCION VARCHAR(255),
    TIPO VARCHAR(50),
    ESTADO VARCHAR(50)
);

-- Tabla ITEM
CREATE TABLE ITEM (
    ID SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(255) NOT NULL,
    DESCRIPCION TEXT,
    CATEGORIA_ID INTEGER REFERENCES CATEGORIA(ID) ON DELETE RESTRICT,
    TIPO VARCHAR(50) CHECK (TIPO IN ('PRODUCTO', 'SERVICIO')) NOT NULL,
    ESTADO VARCHAR(50)
);

-- Tabla PRODUCTOS
CREATE TABLE PRODUCTOS (
    ID SERIAL PRIMARY KEY,
    ITEM_ID INTEGER UNIQUE NOT NULL REFERENCES ITEM(ID) ON DELETE RESTRICT,
    STOCK INTEGER NOT NULL DEFAULT 0,
    PRECIO DECIMAL(10, 2),
    COSTE DECIMAL(10, 2)
);

-- Tabla SERVICIO
CREATE TABLE SERVICIO (
    ID SERIAL PRIMARY KEY,
    ITEM_ID INTEGER UNIQUE NOT NULL REFERENCES ITEM(ID) ON DELETE RESTRICT,
    PRECIO DECIMAL(10, 2) NOT NULL
);

-- Tabla AJUSTE_PRECIO
CREATE TABLE AJUSTE_PRECIO (
    ID SERIAL PRIMARY KEY,
    DESCRIPCION VARCHAR(255),
    APLICABLE_A VARCHAR(50),
    TIPO VARCHAR(50) CHECK (TIPO IN ('IMPUESTO', 'DESCUENTO')) NOT NULL,
    VALOR DECIMAL(10, 2) NOT NULL,
    ESTADO VARCHAR(50)
);

-- Tabla ITEM_AJUSTE
CREATE TABLE ITEM_AJUSTE (
    ID SERIAL PRIMARY KEY,
    ITEM_ID INTEGER REFERENCES ITEM(ID) ON DELETE RESTRICT,
    AJUSTE_PRECIO_ID INTEGER REFERENCES AJUSTE_PRECIO(ID) ON DELETE RESTRICT
);

-- Tabla CLIENTE
CREATE TABLE CLIENTE (
    ID SERIAL PRIMARY KEY,
    DNI VARCHAR(20) UNIQUE,
    RAZON_SOCIAL VARCHAR(255),
    ESTADO VARCHAR(50)
);

-- Tabla DIRECCION
CREATE TABLE DIRECCION (
    ID SERIAL PRIMARY KEY,
    PAIS VARCHAR(100),
    ESTADO VARCHAR(100),
    MUNICIPIO VARCHAR(100),
    PARROQUIA VARCHAR(100),
    SECTOR VARCHAR(100),
    CALLE VARCHAR(100),
    CASA VARCHAR(50)
);

-- Tabla CLIENTE_DIRECCIONES (Relación muchos a muchos entre Cliente y Dirección)
CREATE TABLE CLIENTE_DIRECCIONES (
    CLIENTE_ID INTEGER REFERENCES CLIENTE(ID) ON DELETE RESTRICT,
    DIRECCION_ID INTEGER REFERENCES DIRECCION(ID) ON DELETE RESTRICT,
    ESTADO VARCHAR(50),
    PRIMARY KEY (CLIENTE_ID, DIRECCION_ID)
);

-- Tabla TELEFONO
CREATE TABLE TELEFONO (
    ID SERIAL PRIMARY KEY,
    CLIENTE_ID INTEGER REFERENCES CLIENTE(ID) ON DELETE RESTRICT,
    PAIS VARCHAR(5),
    OPERADORA VARCHAR(100),
    NUMERO VARCHAR(20) NOT NULL,
    ESTADO VARCHAR(50)
);

-- Tabla CORREO
CREATE TABLE CORREO (
    ID SERIAL PRIMARY KEY,
    CLIENTE_ID INTEGER REFERENCES CLIENTE(ID) ON DELETE RESTRICT,
    DESCRIPCION VARCHAR(255),
    DOMINIO VARCHAR(255) NOT NULL,
    ESTADO VARCHAR(50)
);

-- Tabla ORDEN
CREATE TABLE ORDEN (
    ID SERIAL PRIMARY KEY,
    CLIENTE_ID INTEGER REFERENCES CLIENTE(ID) ON DELETE RESTRICT,
    FECHA DATE NOT NULL DEFAULT CURRENT_DATE,
    ESTADO VARCHAR(50)
);

-- Tabla FACTURA
CREATE TABLE FACTURA (
    ID SERIAL PRIMARY KEY,
    ORDEN_ID INTEGER UNIQUE NOT NULL REFERENCES ORDEN(ID) ON DELETE RESTRICT,
    SERIE VARCHAR(50),
    NUMERO VARCHAR(50) UNIQUE NOT NULL,
    FECHA DATE NOT NULL DEFAULT CURRENT_DATE,
    ESTADO VARCHAR(50)
);

-- Tabla DETALLES_ORDEN
CREATE TABLE DETALLES_ORDEN (
    ID SERIAL PRIMARY KEY,
    ORDEN_ID INTEGER NOT NULL REFERENCES ORDEN(ID) ON DELETE RESTRICT,
    ITEM_ID INTEGER NOT NULL REFERENCES ITEM(ID) ON DELETE RESTRICT,
    CANTIDAD INTEGER NOT NULL,
    SUBTOTAL DECIMAL(10, 2),
    IMPUESTO_APLICADO DECIMAL(10, 2),
    DESCUENTO_APLICADO DECIMAL(10, 2)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_categoria_tipo ON CATEGORIA (TIPO);
CREATE INDEX idx_item_tipo ON ITEM (TIPO);
CREATE INDEX idx_productos_item_id ON PRODUCTOS (ITEM_ID);
CREATE INDEX idx_servicio_item_id ON SERVICIO (ITEM_ID);
CREATE INDEX idx_item_ajuste_item_id ON ITEM_AJUSTE (ITEM_ID);
CREATE INDEX idx_item_ajuste_ajuste_precio_id ON ITEM_AJUSTE (AJUSTE_PRECIO_ID);
CREATE INDEX idx_cliente_dni ON CLIENTE (DNI);
CREATE INDEX idx_cliente_razon_social ON CLIENTE (RAZON_SOCIAL);
CREATE INDEX idx_cliente_direcciones_cliente_id ON CLIENTE_DIRECCIONES (CLIENTE_ID);
CREATE INDEX idx_cliente_direcciones_direccion_id ON CLIENTE_DIRECCIONES (DIRECCION_ID);
CREATE INDEX idx_telefono_cliente_id ON TELEFONO (CLIENTE_ID);
CREATE INDEX idx_correo_cliente_id ON CORREO (CLIENTE_ID);
CREATE INDEX idx_orden_cliente_id ON ORDEN (CLIENTE_ID);
CREATE INDEX idx_orden_fecha ON ORDEN (FECHA);
CREATE INDEX idx_factura_orden_id ON FACTURA (ORDEN_ID);
CREATE INDEX idx_factura_numero ON FACTURA (NUMERO);
CREATE INDEX idx_detalles_orden_orden_id ON DETALLES_ORDEN (ORDEN_ID);
CREATE INDEX idx_detalles_orden_item_id ON DETALLES_ORDEN (ITEM_ID);