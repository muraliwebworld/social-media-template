import { Platform } from 'react-native'
export const getDeepLink = (path = "") => {
  const scheme = 'chforum'
  const prefix = Platform.OS == 'android' ? `${scheme}://chforum/` : `${scheme}://`
  return prefix + path
}