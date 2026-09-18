import { api } from './client'

export function getEvents() {
  return api.get('/admin/events')
}

export function getEvent(eventId) {
  return api.get(`/admin/events/${eventId}`)
}
