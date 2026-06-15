# Zipão Web — publicar no Vercel (tudo pelo navegador)

App React (Vite) do Zipão. Os módulos **Produtos** e **Clientes** já gravam,
editam e excluem de verdade no banco Supabase. O resto está com dados de
demonstração.

## Publicar (sem instalar nada)

### 1. Subir no GitHub
1. Em github.com, crie um repositório novo chamado `zipao-web` (pode ser Public ou Private).
2. Na página do repositório: **Add file > Upload files**.
3. Arraste para a área de upload **todos os arquivos desta pasta**:
   `index.html`, `package.json`, `vite.config.js`, `.gitignore`, e a pasta `src`.
   NÃO suba `node_modules` nem `dist` (o Vercel gera sozinho).
4. Clique **Commit changes**.

### 2. Publicar no Vercel
1. Em vercel.com, clique **Add New > Project**.
2. Escolha **Import** no repositório `zipao-web`.
3. O Vercel detecta o Vite automaticamente. Deixe tudo como está.
4. Clique **Deploy**. Em ~1 minuto sai a URL pública do seu sistema.

Pronto: ao abrir, entre como **Dono**, vá em **Produtos & cardápio** ou
**Clientes & cashback** e teste cadastrar, editar e excluir — os dados são
gravados no banco real.

## Importante (segurança)

Para a demonstração funcionar direto do navegador, liberei acesso público de
leitura/escrita (RLS aberto) nas tabelas `products`, `ingredients` e `customers`.
Isso é adequado para testar, mas **antes de operar pra valer** essas regras
devem ser trocadas por acesso com login real (autenticação), senão qualquer
pessoa com o endereço poderia alterar os dados.

## Rodar local (opcional)
```bash
npm install
npm run dev
```
