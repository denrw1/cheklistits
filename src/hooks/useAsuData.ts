import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Asu, NodePhoto } from '@/types';

export function useAsuData() {
  const [asus, setAsus] = useState<Asu[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAsus = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('asus')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to load ASUs:', error.message);
    }
    setAsus(data ?? []);
    setLoading(false);
  }, []);

  const createAsu = useCallback(async (name: string): Promise<Asu | null> => {
    const { data, error } = await supabase
      .from('asus')
      .insert({ name })
      .select()
      .single();
    if (error) {
      console.error('Failed to create ASU:', error.message);
      return null;
    }
    setAsus((prev) => [data, ...prev]);
    return data;
  }, []);

  const deleteAsu = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('asus').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete ASU:', error.message);
      return false;
    }
    setAsus((prev) => prev.filter((a) => a.id !== id));
    return true;
  }, []);

  const fetchPhotos = useCallback(
    async (asuId: string): Promise<Record<string, NodePhoto[]>> => {
      const { data, error } = await supabase
        .from('node_photos')
        .select('*')
        .eq('asu_id', asuId);
      if (error) {
        console.error('Failed to load photos:', error.message);
        return {};
      }
      const map: Record<string, NodePhoto[]> = {};
      for (const photo of data ?? []) {
        const key = `${photo.container_name}|||${photo.node_name}`;
        if (!map[key]) map[key] = [];
        map[key].push(photo);
      }
      return map;
    },
    []
  );

  const savePhoto = useCallback(
    async (
      asuId: string,
      containerName: string,
      nodeName: string,
      blob: Blob,
      filename: string
    ): Promise<boolean> => {
      const filePath = `${asuId}/${filename}`;
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, blob, { contentType: 'image/jpeg' });
      if (uploadError) {
        console.error('Upload failed:', uploadError.message);
        return false;
      }
      const { error: dbError } = await supabase
        .from('node_photos')
        .insert({
          asu_id: asuId,
          container_name: containerName,
          node_name: nodeName,
          storage_path: filePath,
          filename,
        });
      if (dbError) {
        console.error('DB insert failed:', dbError.message);
        return false;
      }
      return true;
    },
    []
  );

  const deletePhoto = useCallback(async (photoId: string, storagePath: string): Promise<boolean> => {
    const { error: delError } = await supabase.storage.from('photos').remove([storagePath]);
    if (delError) {
      console.error('Storage delete failed:', delError.message);
    }
    const { error } = await supabase.from('node_photos').delete().eq('id', photoId);
    if (error) {
      console.error('DB delete failed:', error.message);
      return false;
    }
    return true;
  }, []);

  const getPhotoUrl = useCallback((storagePath: string): string => {
    return supabase.storage.from('photos').getPublicUrl(storagePath).data.publicUrl;
  }, []);

  useEffect(() => {
    fetchAsus();
  }, [fetchAsus]);

  return {
    asus,
    loading,
    fetchAsus,
    createAsu,
    deleteAsu,
    fetchPhotos,
    savePhoto,
    deletePhoto,
    getPhotoUrl,
  };
}
