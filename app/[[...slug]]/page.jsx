import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('pageMap')

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { metadata } = await importPage(slug)
  return metadata
}

export default async function Page({ params }) {
  const { slug } = await params
  const { default: MDXContent, toc, metadata } = await importPage(slug)
  const { wrapper: Wrapper } = useMDXComponents()
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent params={slug} />
    </Wrapper>
  )
}
