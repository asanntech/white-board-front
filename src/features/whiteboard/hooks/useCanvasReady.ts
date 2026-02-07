import { useWhiteboardStore } from '../stores'

/**
 * キャンバスの準備状態を取得するフック
 * 外部コンテキストから whiteboard ドメインの状態にアクセスするための公開API
 */
export const useCanvasReady = () => {
  return useWhiteboardStore((s) => s.isReadyCanvas)
}
