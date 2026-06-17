import { useMDXComponents as nextraComponents } from 'nextra-theme-docs'

export function useMDXComponents(components = {}) {
  return {
    ...nextraComponents(components),
    ...components,
  }
}
