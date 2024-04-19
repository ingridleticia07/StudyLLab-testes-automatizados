create sequence disciplinas_id_disciplina_seq
    as integer;

alter sequence disciplinas_id_disciplina_seq owner to admin;

create sequence respota_forum_id_respota_seq
    as integer;

alter sequence respota_forum_id_respota_seq owner to admin;

create table if not exists codigo_usuario
(
    id_codigo      serial,
    fk_usuario     integer,
    codigo_usuario varchar(45),
    tipo           integer
);

alter table codigo_usuario
    owner to admin;

alter table codigo_usuario
    add primary key (id_codigo);

create table if not exists curso
(
    id_curso   serial,
    nome_curso varchar(45) not null
);

alter table curso
    owner to admin;

alter table curso
    add primary key (id_curso);

create table if not exists disciplina
(
    id_disciplina        integer default nextval('disciplinas_id_disciplina_seq'::regclass) not null,
    nome_disciplina      varchar(45)                                                        not null,
    professor_disciplina varchar(45)                                                        not null,
    fk_curso             integer                                                            not null,
    quantidade_aluno     integer,
    codigo_disciplina    varchar(10)
);

alter table disciplina
    owner to admin;

alter sequence disciplinas_id_disciplina_seq owned by disciplina.id_disciplina;

alter table disciplina
    add constraint disciplinas_pkey
        primary key (id_disciplina);

alter table disciplina
    add constraint disciplinas_fk_disciplina_fkey
        foreign key (fk_curso) references curso;

create table if not exists documento
(
    id_documento       serial,
    data_documento     date        not null,
    diretorio_material varchar(45) not null,
    tipo_material      integer     not null,
    fk_topico          integer     not null
);

alter table documento
    owner to admin;

alter table documento
    add primary key (id_documento);

create table if not exists forum
(
    id_forum          serial,
    fk_resposta_forum integer,
    fk_usuario        integer
);

alter table forum
    owner to admin;

alter table forum
    add primary key (id_forum);

create table if not exists material
(
    id_material  serial,
    fk_documento integer not null,
    fk_topico    integer not null,
    fk_usuario   integer not null
);

alter table material
    owner to admin;

alter table material
    add primary key (id_material);

alter table material
    add foreign key (fk_documento) references documento;

create table if not exists resposta_forum
(
    id_resposta   integer default nextval('respota_forum_id_respota_seq'::regclass) not null,
    resposta      varchar(150)                                                      not null,
    data_resposta date                                                              not null,
    fk_topico     integer                                                           not null,
    fk_usuario    integer                                                           not null
);

alter table resposta_forum
    owner to admin;

alter sequence respota_forum_id_respota_seq owned by resposta_forum.id_resposta;

alter table resposta_forum
    add constraint respota_forum_pkey
        primary key (id_resposta);

alter table forum
    add foreign key (fk_resposta_forum) references resposta_forum
        on delete cascade;

create table if not exists topico_discussao
(
    id_topico     serial,
    nome_topico   varchar(45) not null,
    data_topico   date        not null,
    fk_disciplina integer     not null
);

alter table topico_discussao
    owner to admin;

alter table topico_discussao
    add primary key (id_topico);

alter table documento
    add foreign key (fk_topico) references topico_discussao;

alter table material
    add foreign key (fk_topico) references topico_discussao;

alter table resposta_forum
    add constraint respota_forum_fk_topico_fkey
        foreign key (fk_topico) references topico_discussao;

alter table topico_discussao
    add foreign key (fk_disciplina) references disciplina;

create table if not exists usuario
(
    id_usuario            serial,
    email_usuario         varchar(60) not null,
    matricula             varchar(6)  not null,
    senha_usuario         varchar(60) not null,
    status_usuario        boolean,
    tipo_usuario          integer     not null,
    fk_curso              integer     not null,
    nome_usuario          varchar(45) not null,
    data_cadastro_usuario date        not null,
    imagem                varchar(45)
);

alter table usuario
    owner to admin;

alter table usuario
    add primary key (id_usuario);

alter table codigo_usuario
    add constraint fk_usuario
        foreign key (fk_usuario) references usuario;

alter table forum
    add foreign key (fk_usuario) references usuario
        on delete cascade;

alter table material
    add foreign key (fk_usuario) references usuario;

alter table resposta_forum
    add constraint respota_forum_fk_usuario_fkey
        foreign key (fk_usuario) references usuario;

alter table usuario
    add constraint pk_curso
        foreign key (fk_curso) references curso;

create or replace function get_curso_id(p_nome_curso text)
    returns TABLE(curso_id integer)
    language plpgsql
as
$$
BEGIN
    RETURN QUERY
    SELECT id_curso AS curso_id
    FROM curso
    WHERE nome_curso ILIKE '%' || p_nome_curso || '%';
END;
$$;

alter function get_curso_id(text) owner to admin;

insert into curso (id_curso, nome_curso) values 
    (1, 'Engenharia de Software'), 
    (2, 'Ciência da Computação');