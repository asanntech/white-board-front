import { useSyncExternalStore } from 'react'

/**
 * サーバーサイドレンダリング中かどうかを判定するフック
 *
 * @returns {boolean} サーバーサイドレンダリング中の場合はtrue、クライアントサイドの場合はfalse
 */
export const useIsServerRender = () => {
  return useSyncExternalStore(
    () => () => {},
    () => false,
    () => true
  )
}
