export interface Asu {
  id: string;
  name: string;
  created_at: string;
}

export interface NodePhoto {
  id: string;
  asu_id: string;
  container_name: string;
  node_name: string;
  storage_path: string;
  filename: string;
  created_at: string;
}

export type ScreenName =
  | 'main'
  | 'select-asu'
  | 'containers'
  | 'nodes'
  | 'camera'
  | 'preview';

export interface CapturedPhoto {
  blob: Blob;
  dataUrl: string;
  filename: string;
}
