-- =============================================================================
-- KABRA Site — Migration completa
-- Rodar no SQL Editor do Supabase em ordem sequencial
-- =============================================================================


-- =============================================================================
-- 1. EXTENSÕES
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =============================================================================
-- 2. TABELAS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- blogs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blogs (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title           text        NOT NULL,
    excerpt         text        NOT NULL,
    content         text        NOT NULL DEFAULT '',
    image_url       text,
    slug            text        NOT NULL,
    meta_description text,
    published       boolean     NOT NULL DEFAULT false,
    author          text                  DEFAULT 'Agência KABRA',
    author_id       uuid        REFERENCES auth.users (id) ON DELETE SET NULL,
    material_url    text,
    material_title  text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS blogs_slug_unique ON public.blogs (slug);
CREATE INDEX IF NOT EXISTS blogs_published_idx   ON public.blogs (published);
CREATE INDEX IF NOT EXISTS blogs_created_at_idx  ON public.blogs (created_at DESC);

-- -----------------------------------------------------------------------------
-- blog_images
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_images (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    url         text        NOT NULL,
    title       text        NOT NULL,
    description text,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_images_created_at_idx ON public.blog_images (created_at DESC);

-- -----------------------------------------------------------------------------
-- submissions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.submissions (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email                text        NOT NULL,
    name                 text,
    phone                text,
    company              text,
    role                 text,
    classification       text,
    investment_plan      text,
    average_revenue      text,
    origin               text                  DEFAULT 'geral',
    status               text        NOT NULL DEFAULT 'new'
                             CHECK (status IN ('new', 'read')),
    completed_second_step boolean    NOT NULL DEFAULT false,
    created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS submissions_status_idx      ON public.submissions (status);
CREATE INDEX IF NOT EXISTS submissions_created_at_idx  ON public.submissions (created_at DESC);


-- =============================================================================
-- 3. ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.blogs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions  ENABLE ROW LEVEL SECURITY;


-- -----------------------------------------------------------------------------
-- blogs — policies
-- -----------------------------------------------------------------------------

-- Qualquer visitante lê posts publicados
CREATE POLICY "blogs: leitura pública de publicados"
    ON public.blogs FOR SELECT
    USING (published = true);

-- Admin autenticado vê todos (incluindo rascunhos)
CREATE POLICY "blogs: admin vê todos"
    ON public.blogs FOR SELECT
    TO authenticated
    USING (true);

-- Admin cria
CREATE POLICY "blogs: admin cria"
    ON public.blogs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Admin edita
CREATE POLICY "blogs: admin edita"
    ON public.blogs FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Admin exclui
CREATE POLICY "blogs: admin exclui"
    ON public.blogs FOR DELETE
    TO authenticated
    USING (true);


-- -----------------------------------------------------------------------------
-- blog_images — policies
-- -----------------------------------------------------------------------------

-- Qualquer visitante lê
CREATE POLICY "blog_images: leitura pública"
    ON public.blog_images FOR SELECT
    USING (true);

-- Admin cria
CREATE POLICY "blog_images: admin cria"
    ON public.blog_images FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Admin exclui
CREATE POLICY "blog_images: admin exclui"
    ON public.blog_images FOR DELETE
    TO authenticated
    USING (true);


-- -----------------------------------------------------------------------------
-- submissions — policies
-- -----------------------------------------------------------------------------

-- Visitante anônimo pode inserir (formulário de lead)
CREATE POLICY "submissions: anon insere"
    ON public.submissions FOR INSERT
    TO anon
    WITH CHECK (true);

-- Usuário autenticado também pode inserir (material gate)
CREATE POLICY "submissions: auth insere"
    ON public.submissions FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Admin lê todos os leads
CREATE POLICY "submissions: admin lê todos"
    ON public.submissions FOR SELECT
    TO authenticated
    USING (true);

-- Admin atualiza (marcar como lido, completar etapa 2)
CREATE POLICY "submissions: admin atualiza"
    ON public.submissions FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- =============================================================================
-- 4. STORAGE — bucket blog-images
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Qualquer um lê arquivos do bucket (URLs públicas funcionarem)
CREATE POLICY "storage blog-images: leitura pública"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'blog-images');

-- Só admin faz upload
CREATE POLICY "storage blog-images: admin upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'blog-images');

-- Só admin atualiza
CREATE POLICY "storage blog-images: admin update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'blog-images');

-- Só admin exclui
CREATE POLICY "storage blog-images: admin delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'blog-images');
