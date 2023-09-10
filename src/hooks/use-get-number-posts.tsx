import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import useSWR from 'swr'
const fetcher = (url: any) => axios.get(url).then((res) => res.data)

export const useGetNumberPosts = () => {
  const { data, error, isLoading } = useSWR('/api/getAllPosts', fetcher)

  return { data, error, isLoading }
}
