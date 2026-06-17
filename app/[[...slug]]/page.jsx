import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('pageMap')

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { metadata } = await importPage(slug)
  return metadata
}

const { wrapper: Wrapper } = useMDXComponents()

export default async function Page({ params, ...props }) {
  const { slug } = await params
  const { default: MDXContent, toc, metadata } = await importPage(slug)
  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent params={slug} {...props} />
    </Wrapper>
  )
}
