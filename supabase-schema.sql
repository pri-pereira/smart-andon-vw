-- Smart Andon - Schema SQL para Supabase
-- Execute este script no SQL Editor do Supabase

-- Tabela: catalogo_pecas
CREATE TABLE IF NOT EXISTS catalogo_pecas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(10) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela: registros_andon
CREATE TABLE IF NOT EXISTS registros_andon (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tacto VARCHAR(3) NOT NULL,
  codigo_peca VARCHAR(10) NOT NULL,
  nome_peca VARCHAR(255) NOT NULL,
  celula VARCHAR(100) NOT NULL,
  horario TIMESTAMP WITH TIME ZONE NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (codigo_peca) REFERENCES catalogo_pecas(codigo)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_catalogo_pecas_codigo ON catalogo_pecas(codigo);
CREATE INDEX IF NOT EXISTS idx_catalogo_pecas_ativo ON catalogo_pecas(ativo);
CREATE INDEX IF NOT EXISTS idx_registros_andon_criado_em ON registros_andon(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_registros_andon_codigo_peca ON registros_andon(codigo_peca);

-- Seed Data: Catálogo de Peças
INSERT INTO catalogo_pecas (codigo, nome, descricao, ativo) VALUES
  ('088', 'Vidro Lateral Polo', 'Vidro lateral para Polo', true),
  ('101', 'Para-brisa Taos', 'Para-brisa para Taos', true),
  ('202', 'Vigia Traseiro T-Cross', 'Vigia traseiro para T-Cross', true),
  ('303', 'Vidro Porta Dianteira', 'Vidro de porta dianteira', true),
  ('404', 'Kit Fixação Cola', 'Kit de fixação com cola', true),
  ('505', 'Guarnição de Borracha', 'Guarnição de borracha para vidros', true),
  ('606', 'Sensor de Chuva', 'Sensor de chuva automático', true),
  ('707', 'Presilha de Fixação', 'Presilha para fixação de vidros', true),
  ('808', 'Vidro Lateral Virtus', 'Vidro lateral para Virtus', true),
  ('909', 'Selante PU Industrial', 'Selante poliuretano para uso industrial', true)
ON CONFLICT (codigo) DO NOTHING;

-- Enable Row Level Security (RLS) - Opcional para segurança
-- ALTER TABLE catalogo_pecas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE registros_andon ENABLE ROW LEVEL SECURITY;

-- Policies para acesso público (leitura)
-- CREATE POLICY "Allow public read on catalogo_pecas"
--   ON catalogo_pecas FOR SELECT
--   USING (ativo = true);

-- CREATE POLICY "Allow public insert on registros_andon"
--   ON registros_andon FOR INSERT
--   WITH CHECK (true);

-- CREATE POLICY "Allow public read on registros_andon"
--   ON registros_andon FOR SELECT
--   USING (true);
