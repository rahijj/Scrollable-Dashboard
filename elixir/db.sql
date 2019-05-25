create table auth (
	id text unique not null,
	password text not null
);

create table sync_store (
	id text unique not null,
	sync_state jsonb
);

create table tokens (
	id text not null,
	token text not null,
	client_id text not null
);

create table writes (
	id text,
	path[] text,
	value jsonb,
	time bigint,
	type text,
	client_id text,
	sync_time timestamp default current_timestamp
);

create index on writes(id);
create index on writes(time);
