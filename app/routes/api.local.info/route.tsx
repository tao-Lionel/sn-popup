import { json } from '@remix-run/node'
import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node'
export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const params = new URL(request.url).searchParams
  return json({
    result: 'success',
    data: `你请求了本地接口，参数是${params}`,
  })
}
