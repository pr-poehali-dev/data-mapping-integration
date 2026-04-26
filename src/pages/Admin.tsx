import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import func2url from '../../backend/func2url.json'

const VIDEOS_URL = func2url.videos

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [duration, setDuration] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const videoRef = useRef<HTMLInputElement>(null)
  const thumbRef = useRef<HTMLInputElement>(null)

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim()) {
      setAuthed(true)
      setAuthError(false)
    } else {
      setAuthError(true)
    }
  }

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const getExt = (file: File) => file.name.split('.').pop()?.toLowerCase() || ''

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setThumbFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setThumbPreview(url)
    } else {
      setThumbPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !videoFile) {
      setError('Укажите название и выберите видеофайл')
      return
    }
    setUploading(true)
    setError('')
    try {
      const videoData = await fileToBase64(videoFile)
      const videoExt = getExt(videoFile)
      const body: Record<string, string> = { title, description, category, duration, video_data: videoData, video_ext: videoExt }
      if (thumbFile) {
        body.thumbnail_data = await fileToBase64(thumbFile)
        body.thumb_ext = getExt(thumbFile)
      }
      const res = await fetch(VIDEOS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': password },
        body: JSON.stringify(body),
      })
      if (res.status === 403) {
        setError('Неверный пароль')
        setAuthed(false)
        return
      }
      if (!res.ok) throw new Error('Ошибка сервера')
      setSuccess(true)
      setTitle('')
      setDescription('')
      setCategory('')
      setDuration('')
      setVideoFile(null)
      setThumbFile(null)
      setThumbPreview(null)
      if (videoRef.current) videoRef.current.value = ''
      if (thumbRef.current) thumbRef.current.value = ''
    } catch {
      setError('Ошибка загрузки. Попробуйте ещё раз.')
    } finally {
      setUploading(false)
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={22} className="text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Админ-панель</h1>
            <p className="text-white/40 text-sm mt-1">Введите пароль для доступа</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
            />
            {authError && <p className="text-red-400 text-sm">Введите пароль</p>}
            <Button type="submit" className="w-full bg-violet-500 hover:bg-violet-600 text-white">
              Войти
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/videos" className="text-white/30 hover:text-white/60 text-sm transition-colors">
              ← К видеогалерее
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/videos" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <Icon name="ArrowLeft" size={16} />
            К галерее
          </Link>
          <h1 className="text-lg font-bold">Загрузка видео</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {success && (
          <motion.div
            className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Icon name="CheckCircle" size={20} className="text-green-400 shrink-0" />
            <div>
              <p className="text-green-300 font-medium">Видео успешно загружено!</p>
              <button onClick={() => setSuccess(false)} className="text-green-400/60 text-sm hover:text-green-400">
                Загрузить ещё
              </button>
            </div>
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Title */}
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Название *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Например: Ночной город"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Описание</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Краткое описание видео..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          {/* Category + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Категория</label>
              <input
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Реклама, Клип..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Длительность</label>
              <input
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="0:30"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* Video file */}
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Видеофайл * (mp4, webm, mov)</label>
            <label className="flex items-center gap-3 w-full bg-white/5 border border-dashed border-white/20 hover:border-violet-500/50 rounded-xl px-4 py-4 cursor-pointer transition-colors group">
              <Icon name="Film" size={20} className="text-violet-400 shrink-0" />
              <span className="text-white/50 group-hover:text-white/70 text-sm transition-colors">
                {videoFile ? videoFile.name : 'Выбрать видео'}
              </span>
              <input
                ref={videoRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={e => setVideoFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Превью-картинка (jpg, png)</label>
            <label className="flex items-center gap-3 w-full bg-white/5 border border-dashed border-white/20 hover:border-violet-500/50 rounded-xl px-4 py-4 cursor-pointer transition-colors group">
              <Icon name="Image" size={20} className="text-violet-400 shrink-0" />
              <span className="text-white/50 group-hover:text-white/70 text-sm transition-colors">
                {thumbFile ? thumbFile.name : 'Выбрать превью'}
              </span>
              <input
                ref={thumbRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleThumbChange}
              />
            </label>
            {thumbPreview && (
              <div className="mt-2 rounded-xl overflow-hidden aspect-video max-w-xs">
                <img src={thumbPreview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm flex items-center gap-2">
              <Icon name="AlertCircle" size={14} />
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={uploading}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-xl disabled:opacity-50"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Загружаю...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Icon name="Upload" size={16} />
                Загрузить видео
              </span>
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  )
}
