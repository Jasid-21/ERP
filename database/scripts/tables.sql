create table modules (
	id INT generated always as identity primary key,
	name VARCHAR(255) not null,
	parent_id int,
	
	foreign key (parent_id) references modules (id)
);

create table actions (
	id INT generated always as identity primary key,
	name VARCHAR(50) not null,
	code varchar(2)
);

ALTER TABLE modules
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE actions
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

create table users (
	id int generated always as identity primary key,
	username varchar(50) not null,
	email varchar(255) not null,
	password varchar(255) not null,
	isEmailVerified bool not null
);
alter table users rename column isemailverified to is_email_verified;
alter table users alter column is_email_verified set default false;

ALTER TABLE modules
ADD COLUMN created_by int not null references users (id),
ADD COLUMN updated_by int not null references users (id);

ALTER TABLE actions
ADD COLUMN created_by int not null references users (id),
ADD COLUMN updated_by int not null references users (id);

alter table modules alter column updated_by drop not null;
alter table actions alter column updated_by drop not null;

insert into users (username, email, password, is_email_verified)
values ('system', 'system@system', 'system_password', true);

ALTER TABLE users
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN created_by int references users (id),
ADD COLUMN updated_by int references users (id);

create table roles (
	id int not null generated always as identity primary key,
	name varchar(50),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by int not null references users (id),
	updated_by int not null references users (id)
);
alter table roles alter column updated_by drop not null;

create table roles_permits (
	role_id int not null,
	module_id int not null,
	action_id int not null,
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by int not null references users (id),
	updated_by int not null references users (id),
	
	foreign key (role_id) references roles(id),
	foreign key (module_id) references modules(id),
	foreign key (action_id) references actions(id)
);
alter table roles_permits alter column updated_by drop not null;

create table users_roles (
	user_id int not null,
	role_id int not null,
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by int not null references users (id),
	updated_by int not null references users (id),
	
	foreign key (user_id) references users (id),
	foreign key (role_id) references roles (id)
);
alter table users_roles alter column updated_by drop not null;

CREATE TABLE companies (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nit VARCHAR(255) NOT NULL,
  rut VARCHAR(255),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by INT NOT NULL REFERENCES users(id),
  updated_by INT REFERENCES users(id)
);
alter table companies alter column updated_by drop not null;

CREATE TABLE company_certificates (
  id SERIAL PRIMARY KEY,
  company_id INT NOT NULL REFERENCES companies(id),
  provider VARCHAR(100),
  serial_number VARCHAR(255),
  fingerprint VARCHAR(64),
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  storage_path TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'expired', 'revoked')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by INT NOT NULL REFERENCES users(id),
  updated_by INT REFERENCES users(id)
);

create table companies_users (
	user_id int not null references users (id),
	company_id int not null references companies (id)
);

create table warehouses (
	id int not null generated always as identity primary key,
	name varchar(255) not null,
	description text,
	company_id int not null references companies (id),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);

create table products (
	id int not null generated always as identity primary key,
	serial varchar(255) not null,
	name varchar(255) not null,
	type varchar(20) not null default 'bien' check (type in ('bien', 'servicio')),
	description text,
	measurement decimal(10, 2),
	measurement_unit varchar(10),
	standard_code varchar(20),
	base_price decimal(10,2),
	company_id int not null references companies(id),
	image varchar(255),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);

SELECT conname
FROM pg_constraint
WHERE conrelid = 'products'::regclass
  AND contype = 'c';

ALTER TABLE products
DROP CONSTRAINT products_type_check;

ALTER TABLE products
ADD CONSTRAINT products_type_check
CHECK (type IN ('good', 'service'));

create table stock (
	id int not null generated always as identity primary key,
	product_id int not null references products(id),
	amount int not null,
	warehouse_id int not null references warehouses(id),
	alert_minimum int,
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id),
	
	unique(product_id, warehouse_id)
);

create table catalog (
	id int not null generated always as identity primary key,
	product_id int not null references products(id),
	sale_price decimal(10, 2) not null,
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);
alter table catalog add column company_id int not null references companies(id);

create table inventory_movements (
	id int not null generated always as identity primary key,
	product_id int not null references products(id),
	warehouse_id int not null references warehouses(id),
	type varchar(20) check (type in ('entrada', 'salida', 'ajuste')),
	amount int not null,
	motive text,
	movement_date timestamptz not null default now(),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);
alter table inventory_movements add column sale_id int references sales(id);
alter table inventory_movements add column purchase_id int references purchases(id);

SELECT conname
FROM pg_constraint
WHERE conrelid = 'inventory_movements'::regclass
  AND contype = 'c';

ALTER TABLE products
DROP CONSTRAINT inventory_movements_type_check;

ALTER TABLE products
ADD CONSTRAINT inventory_movements_type_check
CHECK (type IN ('income', 'outcome', 'adjustment'));

create table clients (
	id int not null generated always as identity primary key,
	names varchar(255) not null,
	lastnames varchar(255) not null,
	dni_type varchar(5) check (dni_type in ('CC', 'TI', 'CE', 'PSP', 'CD', 'DNI')),
	address varchar(255),
	email varchar(255),
	phone varchar(20),
	fiscal_responsability varchar(10),
	municipality varchar(50),
	company_id int not null references companies(id),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);

create table budgets (
	id int not null generated always as identity primary key,
	emitter_id int not null references users(id),
	client_id int references clients(id),
	status varchar(10) not null default 'draft' check (status in ('draft', 'approved', 'rejected', 'converted')),
	company_id int not null references companies(id)
);

ALTER TABLE budgets
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN created_by int not null references users (id),
ADD COLUMN updated_by int references users (id);

create table budget_products (
	budget_id int not null references budgets(id),
	product_id int not null references products(id),
	amount int not null,
	unit_price decimal(10, 2) not null,
	discount decimal(10, 2) not null default 0.00,
	comments text,
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);

create table payment_methods (
	id int not null generated always as identity primary key,
	name varchar(50) not null,
	code varchar(5) not null,
	company_id int references companies(id),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);

create table sales (
	id int not null generated always as identity primary key,
	emitter_id int not null references users(id),
	approver_id int references users(id),
	emission_date timestamptz not null,
	approvement_date timestamptz,
	client_id int not null references clients(id),
	subtotal decimal(10, 2) not null,
	taxes decimal(10, 2) not null,
	total decimal(10, 2) not null,
	comments text,
	status varchar(10) default 'emiited' check (status in ('emitted', 'approved', 'rejected')),
	company_id int not null references companies(id),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);
alter table sales drop column emission_date;
alter table sales add column emission_date timestamptz not null default now();

create table sales_products (
	sale_id int not null references sales(id),
	product_id int not null references products(id),
	amount int not null,
	unit_price decimal(10, 2) not null,
	discount decimal(10, 2) not null default 0.00,
	comments text,
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);

create table sales_payments (
	id int not null generated always as identity primary key,
	sale_id int not null references sales(id),
	payment_method_id int not null references payment_methods(id),
	
	brute_value decimal(10, 2) not null,
	net_value decimal(10, 2) not null,
	currency varchar(5) not null default 'COP',
	payment_date timestamptz not null default now(),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);

CREATE TABLE sales_payments_details (
  sales_payment_id INT NOT NULL REFERENCES sales_payments(id),
  type VARCHAR(30) NOT null,
  description TEXT,
  amount decimal(10, 2) NOT NULL
);

CREATE TABLE providers (
  id int not null generated always as identity primary key,

  -- Identificación
  legal_name        VARCHAR(255) NOT NULL,
  trade_name        VARCHAR(255),
  dni_type varchar(5) not null check (dni_type in ('CC', 'TI', 'CE', 'PSP', 'CD', 'DNI')),
  document_number   VARCHAR(50) NOT NULL,

  email             VARCHAR(255),
  phone             VARCHAR(50),
  address           TEXT,

  fiscal_responsability VARCHAR(100),              -- simplificado, responsable IVA, etc.
  municipality_code VARCHAR(10),
  
  is_active         BOOLEAN NOT NULL DEFAULT true,
  company_id        INT NOT NULL REFERENCES companies(id),

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        INT NOT NULL REFERENCES users(id),
  updated_by        INT REFERENCES users(id)
);

create table purchases (
	id int not null generated always as identity primary key,
	emitter_id int not null references users(id),
	approver_id int references users(id),
	emission_date timestamptz not null,
	approvement_date timestamptz,
	provider_id int not null references providers(id),
	subtotal decimal(10, 2) not null,
	taxes decimal(10, 2) not null,
	total decimal(10, 2) not null,
	comments text,
	status varchar(10) default 'emiited' check (status in ('emitted', 'approved', 'rejected')),
	company_id int not null references companies(id),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);
alter table purchases drop column emission_date;
alter table purchases add column emission_date timestamptz not null default now();

create table purchases_products (
	purchase_id int not null references purchases(id),
	product_id int not null references products(id),
	amount int not null,
	unit_price decimal(10, 2) not null,
	discount decimal(10, 2) not null default 0.00,
	comments text,
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);

create table purchases_payments (
	id int not null generated always as identity primary key,
	purchase_id int not null references purchases(id),
	payment_method_id int not null references payment_methods(id),
	
	brute_value decimal(10, 2) not null,
	net_value decimal(10, 2) not null,
	currency varchar(5) not null default 'COP',
	payment_date timestamptz not null default now(),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);

CREATE TABLE purchases_payments_details (
  purchase_payment_id INT NOT NULL REFERENCES purchases_payments(id),
  type VARCHAR(30) NOT null,
  description TEXT,
  amount decimal(10, 2) NOT NULL
);

create table boxes (
	id int not null generated always as identity primary key,
	name varchar(100) not null,
	responsible_id int not null references users(id),
	status varchar(20) not null default 'closed' check (status in ('closed', 'opened', 'locked', 'unlocked')),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);
alter table boxes add column balance decimal(10, 2) not null;

create table boxes_actions (
	id int not null generated always as identity primary key,
	box_action varchar(20) not null check (box_action in ('open', 'close', 'lock', 'unlock')),
	action_date timestamptz not null,
	box_id int not null references boxes(id),
	balance decimal(10, 2) not null,
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);

alter table boxes_actions drop column action_date;
alter table boxes_actions add column action_date timestamptz not null default now();

create table box_movement (
	id int not null generated always as identity primary key,
	box_id  int not null references boxes(id),
	type varchar(20) not null check (type in ('income', 'outcome')),
	purchase_id int references purchases(id),
	sale_id int references sales(id),
	status varchar(20) check (status in ('pending', 'confirmed', 'canceled')),
	user_id int not null references users(id),
	amount decimal(10, 2) not null,
	description text,
	movement_date timestamptz not null default now(),
	
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_by INT NOT NULL REFERENCES users(id),
	updated_by INT REFERENCES users(id)
);

alter table inventory_movements rename column type to movement_type;
alter table products drop constraint inventory_movements_type_check;

alter table inventory_movements drop constraint inventory_movements_type_check;
ALTER TABLE inventory_movements
ADD CONSTRAINT inventory_movements_type_check
CHECK (movement_type IN ('income', 'outcome', 'adjustment'));
