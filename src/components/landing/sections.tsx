import { Badge } from "@/components/ui/badge"

export const sections = [
  {
    id: 'hero',
    subtitle: <Badge variant="outline" className="text-violet-400 border-violet-400">Нейросети для творчества</Badge>,
    title: "Создавай. Без ограничений.",
    showButton: true,
    buttonText: 'Попробовать бесплатно'
  },
  {
    id: 'photo',
    title: 'Фото за секунды.',
    content: 'Генерируй уникальные изображения по текстовому описанию. Портреты, пейзажи, концепт-арт — любой стиль, любое настроение.'
  },
  {
    id: 'video',
    title: 'Видео из текста.',
    content: 'Превращай идеи в готовые видеоролики. Реклама, клипы, короткие анимации — без оператора и монтажёра.'
  },
  {
    id: 'music',
    title: 'Музыка по запросу.',
    content: 'Создавай треки и саундтреки в любом жанре. Джаз, электроника, оркестр — нейросеть напишет музыку под твой проект.'
  },
  {
    id: 'gallery',
    title: 'Примеры работ.',
    content: 'Всё это создано нейросетью — за секунды, по текстовому запросу.',
    gallery: [
      {
        src: 'https://cdn.poehali.dev/projects/bca5d402-5124-422b-9ea1-f7474baf2acc/files/ff2ddb02-1c1d-4106-beaf-eba7c3daf1ff.jpg',
        label: 'Фото'
      },
      {
        src: 'https://cdn.poehali.dev/projects/bca5d402-5124-422b-9ea1-f7474baf2acc/files/b5980f21-2d6a-44d9-96d4-6d685f2ed868.jpg',
        label: 'Видео'
      },
      {
        src: 'https://cdn.poehali.dev/projects/bca5d402-5124-422b-9ea1-f7474baf2acc/files/c683617f-ee07-409e-996f-4be3d277a50f.jpg',
        label: 'Музыка'
      },
      {
        src: 'https://cdn.poehali.dev/projects/bca5d402-5124-422b-9ea1-f7474baf2acc/files/cd050e22-3563-420c-8900-689390ed62e9.jpg',
        label: 'Креативы'
      },
    ]
  },
  {
    id: 'video-gallery',
    title: 'Видео из текста.',
    content: 'Введи описание — получи готовый ролик. Реклама, клипы, кино — нейросеть снимает за тебя.',
    videoGallery: [
      {
        src: 'https://cdn.poehali.dev/projects/bca5d402-5124-422b-9ea1-f7474baf2acc/files/b87197a4-47ee-4beb-9b22-cbfbd8251602.jpg',
        label: 'Футуристичный город',
        duration: '0:15'
      },
      {
        src: 'https://cdn.poehali.dev/projects/bca5d402-5124-422b-9ea1-f7474baf2acc/files/346d7fa8-bb8b-4d91-aa0c-269f239e03bb.jpg',
        label: 'Fashion реклама',
        duration: '0:30'
      },
      {
        src: 'https://cdn.poehali.dev/projects/bca5d402-5124-422b-9ea1-f7474baf2acc/files/5565c681-698f-4165-821d-067a846c3b2a.jpg',
        label: 'Волшебный лес',
        duration: '0:45'
      },
      {
        src: 'https://cdn.poehali.dev/projects/bca5d402-5124-422b-9ea1-f7474baf2acc/files/15bb45b8-377b-4053-8c63-5fd4cf8ac1d5.jpg',
        label: 'Tech продукт',
        duration: '0:20'
      },
    ]
  },
  {
    id: 'cta',
    title: 'Твой контент — твои правила.',
    content: 'Все форматы в одном месте. Создавай фото, видео, музыку и креативы быстрее и дешевле, чем когда-либо.',
    showButton: true,
    buttonText: 'Начать создавать'
  },
]