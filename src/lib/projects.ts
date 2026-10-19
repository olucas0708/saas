import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { SiteData } from "./builder";

export async function getMyWorkspaceId(): Promise<string> {
  const { data, error } = await supabase.from("workspace_members").select("workspace_id").order("created_at").limit(1).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Nenhum workspace encontrado para sua conta.");
  return data.workspace_id;
}

export async function listProjects() {
  const { data, error } = await supabase.from("projects").select("id, name, niche, updated_at, data").order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createProject(name: string, niche: string, data: SiteData) {
  const workspace_id = await getMyWorkspaceId();
  const { data: row, error } = await supabase.from("projects").insert({ workspace_id, name, niche, data: data as unknown as Json }).select("id").single();
  if (error) throw error;
  return row.id;
}

export async function getProject(id: string) {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveProject(id: string, name: string, data: SiteData) {
  const { error } = await supabase.from("projects").update({ name, data: data as unknown as Json }).eq("id", id);
  if (error) throw error;
}

export async function saveVersion(project_id: string, data: SiteData, label: string) {
  const { error } = await supabase.from("project_versions").insert({ project_id, data: data as unknown as Json, label });
  if (error) throw error;
}

export async function listVersions(project_id: string) {
  const { data, error } = await supabase.from("project_versions").select("id, label, created_at, data").eq("project_id", project_id).order("created_at", { ascending: false }).limit(30);
  if (error) throw error;
  return data;
}
