import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@devbook:token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Auth ────────────────────────────────────────────────────────────────────
export const login = (dados) =>
  api.post('/login', dados)

// ─── Usuários ────────────────────────────────────────────────────────────────
export const criarUsuario = (dados) =>
  api.post('/usuarios', dados)

export const buscarUsuarios = () =>
  api.get('/usuarios')

export const buscarUsuarioPorId = (id) =>
  api.get(`/usuarios/${id}`)

export const atualizarUsuario = (id, dados) =>
  api.put(`/usuarios/${id}`, dados)

export const deletarUsuario = (id) =>
  api.delete(`/usuarios/${id}`)

export const atualizarSenha = (id, dados) =>
  api.post(`/usuarios/${id}/atualizar-senha`, dados)

export const seguirUsuario = (id) =>
  api.post(`/usuarios/${id}/seguir`)

export const deixarDeSeguir = (id) =>
  api.post(`/usuarios/${id}/deixar-de-seguir`)

export const buscarSeguidores = (id) =>
  api.get(`/usuarios/${id}/seguidores`)

export const buscarSeguindo = (id) =>
  api.get(`/usuarios/${id}/seguindo`)

// ─── Publicações ─────────────────────────────────────────────────────────────
export const buscarPublicacoes = () =>
  api.get('/publicacoes')

export const buscarPublicacaoPorId = (id) =>
  api.get(`/publicacoes/${id}`)

export const criarPublicacao = (dados) =>
  api.post('/publicacoes', dados)

export const atualizarPublicacao = (id, dados) =>
  api.put(`/publicacoes/${id}`, dados)

export const deletarPublicacao = (id) =>
  api.delete(`/publicacoes/${id}`)

export const buscarPublicacoesDoUsuario = (usuarioId) =>
  api.get(`/usuarios/${usuarioId}/publicacoes`)

export const curtirPublicacao = (id) =>
  api.post(`/publicacoes/${id}/curtir`)

export const descurtirPublicacao = (id) =>
  api.post(`/publicacoes/${id}/deslike`)

export default api
