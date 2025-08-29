'use client'

import { PolotnoContainer, WorkspaceWrap } from 'polotno'
import { Workspace } from 'polotno/canvas/workspace'

import { createStore } from 'polotno/model/store'

const store = createStore({
  key: '',
  showCredit: true,
})
const page = store.addPage()

export const WhiteBoard = () => {
  return (
    <PolotnoContainer style={{ width: '100vw', height: '100vh' }}>
      <WorkspaceWrap>
        <Workspace store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  )
}
