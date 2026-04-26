import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from '@/components/ui/icon'
import func2url from '../../backend/func2url.json'

interface Video {
  id: number
  title: string
  description: string
  category: string
  video_url: string
  thumbnail_url: string | null
  duration: string | null
  created_at: string
}

const VIDEOS_URL = func2url.videos

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState<number | null>(null)

  useEffect(() => {
    const url = activeCategory !== 'all'
      ? `${VIDEOS_URL}?category=${encodeURIComponent(activeCategory)}`
      : VIDEOS_URL
    setLoading(true)
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setVideos(data.videos || [])
        setCategories(data.categories || [])
      })
      .finally(() => setLoading(false))
  }, [activeCategory])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <Icon name="ArrowLeft" size={16} />
            На главную
          </Link>
          <h1 className="text-lg font-bold tracking-tight">Видеогалерея</h1>
          <Link
            to="/admin"
            className="text-violet-400 hover:text-violet-300 transition-colors text-sm flex items-center gap-1"
          >
            <Icon name="Upload" size={14} />
            Добавить
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">
            Видео из текста.
          </h2>
          <p className="text-neutral-400 text-lg max-w-xl">
            Примеры роликов, созданных нейросетью по текстовому описанию.
          </p>
        </motion.div>

        {/* Filters */}
        {categories.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-violet-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              Все
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && videos.length === 0 && (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Icon name="VideoOff" size={48} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-lg">Видео пока не добавлены</p>
            <Link
              to="/admin"
              className="mt-4 inline-block text-violet-400 hover:text-violet-300 text-sm"
            >
              Загрузить первое видео →
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && videos.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-violet-500/40 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                {/* Video / Thumbnail */}
                <div className="relative aspect-video bg-black">
                  {playing === video.id ? (
                    <video
                      src={video.video_url}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      onEnded={() => setPlaying(null)}
                    />
                  ) : (
                    <>
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-violet-950/40">
                          <Icon name="Film" size={40} className="text-violet-400/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      <button
                        onClick={() => setPlaying(video.id)}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-500/70 transition-all duration-300">
                          <Icon name="Play" size={22} className="text-white ml-1" />
                        </div>
                      </button>
                      {video.duration && (
                        <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
                          {video.duration}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white leading-tight">{video.title}</h3>
                    {video.category && (
                      <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {video.category}
                      </span>
                    )}
                  </div>
                  {video.description && (
                    <p className="mt-1.5 text-sm text-white/50 line-clamp-2">{video.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
