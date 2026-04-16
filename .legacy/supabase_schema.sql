-- Execute este código no 'SQL Editor' do painel do Supabase para criar as tabelas e politicas.

-- ==========================================
-- TABELA: SUBMISSIONS (Formulários do site)
-- ==========================================
CREATE TABLE public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    origin TEXT, -- Para identificar de onde veio: "cta" (header) ou "popup" (modal)
    name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    role TEXT,
    classification TEXT,
    status TEXT DEFAULT 'new' -- 'new' (nova) ou 'read' (lida)
);

-- Segurança: Ativando RLS (Row Level Security)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir que QUALQUER USUÁRIO (anon) insira dados (para o formulário do site funcionar sem login)
CREATE POLICY "Public pode enviar formularos" ON public.submissions
FOR INSERT TO anon
WITH CHECK (true);

-- Política 2: Permitir que apenas USUÁRIOS LOGADOS (auth.users) possam visualizar e editar submissões
CREATE POLICY "Admins poodem ver submissoes" ON public.submissions
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Admins podem atualizar submissoes" ON public.submissions
FOR UPDATE TO authenticated
USING (true);


-- ==========================================
-- TABELA: BLOGS (Postagens)
-- ==========================================
CREATE TABLE public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT true,
    author_id UUID REFERENCES auth.users(id) -- Liga a postagem ao usuário logado que a criou
);

-- Segurança: Ativando RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Política 1: Qualquer um pode visualizar os posts do blog
CREATE POLICY "Public pode ver blogs" ON public.blogs
FOR SELECT TO public
USING (true);

-- Política 2: Apenas admins podem criar posts
CREATE POLICY "Admins podem inserir blogs" ON public.blogs
FOR INSERT TO authenticated
WITH CHECK (true);

-- Política 3: Apenas admins podem atualizar posts
CREATE POLICY "Admins podem editar blogs" ON public.blogs
FOR UPDATE TO authenticated
USING (true);

-- Política 4: Apenas admins podem deletar posts
CREATE POLICY "Admins podem deletar blogs" ON public.blogs
FOR DELETE TO authenticated
USING (true);
