import { api } from './client'

export function getEvents() {
  return api.get('/gilmok-platform/admin/events')
}

export function getEvent(eventId) {
  return api.get(`/gilmok-platform/admin/events/${eventId}`)
}
