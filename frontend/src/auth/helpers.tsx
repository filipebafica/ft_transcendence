export const getUserIdFromToken = (token: string) => {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token')
  }

  // Decode the payload part
  const payload = parts[1]
  const decodedPayload = JSON.parse(window.atob(payload))

  // Extract information
  const userId = decodedPayload.sub

  return userId
}

