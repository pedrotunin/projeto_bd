create table usuarios(
	id serial,
	email varchar not null,
	senha text not null,
	tipo integer not null,
	primary key (id),
	unique (email)
);

select * from usuarios;

delete from usuarios;

drop table usuarios;

create table clientes(
	id_cliente serial,
	id_usuario integer,
	nome varchar not null,
	cpf char(11) not null,
	rg char(10) not null,
	primary key (id_cliente),
    foreign key (id_usuario) references usuarios(id),
    unique(cpf)
);

select * from clientes;

delete from clientes;

drop table clientes;

create table restaurantes(
	id_restaurante serial,
	id_usuario integer,
	nome_oficial varchar not null,
	nome_fantasia varchar not null,
	cnpj char(14) not null,
	raio_atendimento integer not null,
	hora_abre integer not null,
	hora_fecha integer not null,
	tipo text not null,
	primary key(id_restaurante),
	foreign key(id_usuario) references usuarios(id)
);

select * from restaurantes;

delete from restaurantes;

drop table restaurantes;

create table entregadores(
	id_entregador serial,
	id_usuario integer,
	nome varchar not null,
	cpf char(11) not null,
	tipo_veiculo text not null,
	placa_veiculo char(15) not null,
	modelo_veiculo text not null,
	ano_veiculo integer not null,
	primary key(id_entregador),
	foreign key(id_usuario) references usuarios(id),
	unique(cpf)
);

select * from entregadores;

delete from entregadores;

drop table entregadores;

create table telefones(
	id_usuario integer,
	numero char(20) not null,
	primary key (id_usuario, numero),
	foreign key (id_usuario) references usuarios(id)
);

select * from telefones;

delete from telefones;

drop table telefones;

create table enderecos(
	id_usuario integer,
	cep char(8) not null,
	logradouro varchar not null,
	numero char(10) not null,
	complemento text,
	primary key (id_usuario, cep, numero),
	foreign key (id_usuario) references usuarios(id)
);

select * from enderecos;

delete from enderecos;

drop table enderecos;

create table pratos(
	id_prato serial,
	id_restaurante integer,
	nome varchar not null,
	descricao text not null,
	preco integer not null,
	tipo text not null,
	is_disponivel boolean not null,
	caminho_foto text,
	primary key(id_prato),
	foreign key(id_restaurante) references restaurantes(id_restaurante)
);

select * from pratos;

drop table pratos;

create table carrinho(
	id_cliente integer,
	id_restaurante integer,
	id_prato integer,
	qtd_prato integer,
	foreign key(id_cliente) references clientes(id_cliente),
	foreign key(id_restaurante) references restaurantes(id_restaurante),
	foreign key(id_prato) references pratos(id_prato)
)

select * from carrinho;

drop table carrinho;

create table pedidos(
	id_pedido serial,
	id_cliente integer,
	id_restaurante integer,
	id_entregador integer,
	detalhe_pedido json not null,
	detalhe_pagamento json not null,
	tempo_estimado_minutos integer not null,
	is_finalizado boolean not null,
	primary key (id_pedido),
	foreign key (id_cliente) references clientes(id_cliente),
	foreign key (id_restaurante) references restaurantes(id_restaurante),
	foreign key (id_entregador) references entregadores(id_entregador)
);

drop table pedidos;