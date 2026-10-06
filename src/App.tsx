import { useState, useCallback, useEffect } from 'react';
import { useAsuData } from '@/hooks/useAsuData';
import { useCamera } from '@/hooks/useCamera';
import { NODES_STRUCTURE, CONTAINER_NAMES } from '@/data/nodeStructure';
import type { Asu, ScreenName, NodePhoto, CapturedPhoto } from '@/types';

import { MainMenu } from '@/components/screens/MainMenu';
import { SelectAsu } from '@/components/screens/SelectAsu';
import { ContainersScreen } from '@/components/screens/ContainersScreen';
import { NodesScreen } from '@/components/screens/NodesScreen';
import { CameraScreen } from '@/components/screens/CameraScreen';
import { PreviewScreen } from '@/components/screens/PreviewScreen';
import { CreateAsuModal } from '@/components/CreateAsuModal';

function generateFilename(asuName: string, containerName: string, nodeName: string): string {
  const date = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  const sanitize = (s: string) => s.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_').replace(/_+/g, '_');
  return `${sanitize(asuName)}_${sanitize(containerName)}_${sanitize(nodeName)}_${stamp}.jpg`;
}

function App() {
  const [screen, setScreen] = useState<ScreenName>('main');
  const [showAsuModal, setShowAsuModal] = useState(false);

  const [currentAsu, setCurrentAsu] = useState<Asu | null>(null);
  const [currentContainer, setCurrentContainer] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<string | null>(null);

  const [photosByNode, setPhotosByNode] = useState<Record<string, NodePhoto[]>>({});
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    asus,
    loading,
    createAsu,
    fetchPhotos,
    savePhoto,
    deletePhoto,
    getPhotoUrl,
  } = useAsuData();

  const cam = useCamera();

  const refreshPhotos = useCallback(
    async (asuId: string) => {
      const photos = await fetchPhotos(asuId);
      setPhotosByNode(photos);
    },
    [fetchPhotos]
  );

  const handleCreateAsu = useCallback(
    async (name: string) => {
      const asu = await createAsu(name);
      if (asu) {
        setShowAsuModal(false);
        setCurrentAsu(asu);
        await refreshPhotos(asu.id);
        setScreen('containers');
      }
    },
    [createAsu, refreshPhotos]
  );

  const handleSelectAsu = useCallback(
    (asu: Asu) => {
      setCurrentAsu(asu);
      refreshPhotos(asu.id);
      setScreen('containers');
    },
    [refreshPhotos]
  );

  const handleSelectContainer = useCallback((containerName: string) => {
    setCurrentContainer(containerName);
    setScreen('nodes');
  }, []);

  const handleCaptureNode = useCallback(
    (nodeName: string) => {
      setCurrentNode(nodeName);
      setScreen('camera');
    },
    []
  );

  const handleCapture = useCallback(() => {
    const result = cam.capture();
    if (!result) return;
    const filename = generateFilename(
      currentAsu?.name ?? 'ASU',
      currentContainer ?? 'container',
      currentNode ?? 'node'
    );
    setCapturedPhoto({ blob: result.blob, dataUrl: result.dataUrl, filename });
    cam.stopCamera();
    setScreen('preview');
  }, [cam, currentAsu, currentContainer, currentNode]);

  const handleRetake = useCallback(() => {
    setCapturedPhoto(null);
    setScreen('camera');
  }, []);

  const handleSavePhoto = useCallback(async () => {
    if (!capturedPhoto || !currentAsu || !currentContainer || !currentNode) return;
    setSaving(true);
    const ok = await savePhoto(
      currentAsu.id,
      currentContainer,
      currentNode,
      capturedPhoto.blob,
      capturedPhoto.filename
    );
    setSaving(false);
    if (ok) {
      setCapturedPhoto(null);
      await refreshPhotos(currentAsu.id);
      setScreen('nodes');
    }
  }, [capturedPhoto, currentAsu, currentContainer, currentNode, savePhoto, refreshPhotos]);

  const handleDeletePhoto = useCallback(
    async (photoId: string, storagePath: string): Promise<boolean> => {
      const ok = await deletePhoto(photoId, storagePath);
      if (ok && currentAsu) {
        await refreshPhotos(currentAsu.id);
      }
      return ok;
    },
    [deletePhoto, refreshPhotos, currentAsu]
  );

  const handleCancelCamera = useCallback(() => {
    cam.stopCamera();
    setCapturedPhoto(null);
    setScreen('nodes');
  }, [cam]);

  // Compute container photo counts for the containers screen
  const containerPhotoCounts: Record<string, number> = {};
  if (currentAsu) {
    for (const container of CONTAINER_NAMES) {
      const nodes = NODES_STRUCTURE[container] ?? [];
      let done = 0;
      for (const node of nodes) {
        const key = `${container}|||${node}`;
        if ((photosByNode[key] ?? []).length > 0) done++;
      }
      containerPhotoCounts[container] = done;
    }
  }

  // Clean up camera on unmount
  useEffect(() => {
    return () => cam.stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      {screen === 'main' && (
        <MainMenu
          onCreateNew={() => setShowAsuModal(true)}
          onSelectExisting={() => setScreen('select-asu')}
        />
      )}

      {screen === 'select-asu' && (
        <SelectAsu
          asus={asus}
          loading={loading}
          onBack={() => setScreen('main')}
          onSelect={handleSelectAsu}
        />
      )}

      {screen === 'containers' && currentAsu && (
        <ContainersScreen
          asuName={currentAsu.name}
          photoCounts={containerPhotoCounts}
          onBack={() => setScreen('main')}
          onSelectContainer={handleSelectContainer}
        />
      )}

      {screen === 'nodes' && currentContainer && (
        <NodesScreen
          containerName={currentContainer}
          photosByNode={photosByNode}
          photoBaseUrl={getPhotoUrl}
          onBack={() => setScreen('containers')}
          onCaptureNode={handleCaptureNode}
          onDeletePhoto={handleDeletePhoto}
        />
      )}

      {screen === 'camera' && (
        <CameraScreen
          title={currentNode ?? 'Камера'}
          videoRef={cam.videoRef}
          error={cam.error}
          isReady={cam.isReady}
          torchOn={cam.torchOn}
          onStart={cam.startCamera}
          onStop={handleCancelCamera}
          onCapture={handleCapture}
          onToggleTorch={cam.toggleTorch}
        />
      )}

      {screen === 'preview' && capturedPhoto && (
        <PreviewScreen
          dataUrl={capturedPhoto.dataUrl}
          filename={capturedPhoto.filename}
          saving={saving}
          onSave={handleSavePhoto}
          onRetake={handleRetake}
          onCancel={handleCancelCamera}
        />
      )}

      <CreateAsuModal
        open={showAsuModal}
        onClose={() => setShowAsuModal(false)}
        onCreate={handleCreateAsu}
      />
    </div>
  );
}

export default App;
