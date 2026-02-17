// Re-export from hooks for backward compatibility
export {
  useWhiteboardStore,
  selectIsSpacePressed,
  selectLineNodes,
  selectCanUndo,
  selectCanRedo,
  selectCanYjsUndo,
  selectCanYjsRedo,
} from '../hooks/useWhiteboardStore'
export type { ClientToServerEvents } from '../hooks/useWhiteboardStore'
