import { CanvasSlice } from './canvasSlice'
import { ToolSlice } from './toolSlice'
import { KeyboardSlice } from './keyboardSlice'
import { HistorySlice } from './historySlice'
import { SocketSlice } from './socketSlice'
import { YjsSlice } from './yjsSlice'

export type KonvaStore = CanvasSlice & ToolSlice & KeyboardSlice & HistorySlice & SocketSlice & YjsSlice
