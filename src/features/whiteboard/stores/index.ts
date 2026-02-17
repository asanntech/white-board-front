// Re-export from hooks for backward compatibility
export {
  useWhiteboardStore,
  selectIsSpacePressed,
  selectLineNodes,
  selectCanUndo,
  selectCanRedo,
} from '../hooks/useWhiteboardStore'
export type { ClientToServerEvents } from '../hooks/useWhiteboardStore'
