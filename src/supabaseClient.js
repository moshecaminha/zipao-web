import { createClient } from "@supabase/supabase-js";

// Valores públicos (a chave publishable pode ficar no front; a segurança é via RLS no banco).
export const supabase = createClient(
  "https://qngipsnzmgtbfwzodegi.supabase.co",
  "sb_publishable_sSB-g8fkzUuARBFzJSCHEg_ckCfxHnY"
);

// Loja de demonstração
export const STORE_ID = "cmq05qx6r0002j5kvjm9sml1o";
