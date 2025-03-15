import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add any custom options you need
}

function render(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  return rtlRender(ui, { ...options })
}

export * from '@testing-library/react'
export { render }