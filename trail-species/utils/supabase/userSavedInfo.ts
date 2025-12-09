import { createClient } from "@/utils/supabase/client";
import {getUser} from "@/utils/supabase/getUser_client";

const supabase = createClient();

export async function getUserSearches() {
    const user = await getUser()
    const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user?.id);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function saveUserSearch(searchParams: string) {
    const user = await getUser()
    const { data, error } = await supabase
        .from('saved_searches')
        .insert([{ user_id: user?.id, searchParams: searchParams }]);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function getUserSavedTrails() {
    const user = await getUser()
    const { data, error } = await supabase
        .from('saved_trails')
        .select('*')
        .eq('user_id', user?.id);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function saveTrail(name: string) {
    const user = await getUser()
    const { data, error } = await supabase
        .from('saved_trails')
        .insert([{ user_id: user?.id, name: name }]);
    if (error) {
        throw new Error(error.message);
    }
    return data;
}