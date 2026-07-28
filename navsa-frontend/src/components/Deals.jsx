// import {
//   forwardRef,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react'
// import HTMLFlipBook from 'react-pageflip'
// import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs'
// import './Deals.css'

// pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString()

// const API_BASE = import.meta.env.VITE_API_URL || '/api'
// const PAGE_FLIP_SOUND = '/sounds/page-turn.mp3'

// function normalisePdfUrl(url) {
//   if (!url) return ''

//   try {
//     const parsedUrl = new URL(url, window.location.origin)

//     if (import.meta.env.DEV && parsedUrl.pathname.startsWith('/storage/')) {
//       return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
//     }

//     return parsedUrl.href
//   } catch (error) {
//     console.error('Invalid PDF URL:', url, error)
//     return url
//   }
// }

// function formatDate(value) {
//   if (!value) return ''

//   const date = new Date(`${value}T00:00:00`)
//   if (Number.isNaN(date.getTime())) return value

//   return new Intl.DateTimeFormat('en-GB', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   }).format(date)
// }

// function normaliseDeals(payload) {
//   const collection = Array.isArray(payload)
//     ? payload
//     : payload?.data ?? payload?.items ?? payload?.results ?? []

//   if (!Array.isArray(collection)) return []

//   return collection
//     .filter((item) => item && item.file_url && item.is_active !== false)
//     .map((item, index) => ({
//       id: item.id ?? `deal-${index}`,
//       title: item.title ?? `NAVSA Promotion ${index + 1}`,
//       validFrom: item.valid_from ?? '',
//       validTo: item.valid_to ?? '',
//       validityText: item.validity_text ?? '',
//       description: item.description ?? '',
//       pdfFile: normalisePdfUrl(item.file_url),
//       badge: item.badge || 'PROMOTION',
//       sortOrder: Number(item.sort_order ?? index + 1),
//     }))
//     .sort((a, b) => a.sortOrder - b.sortOrder || Number(a.id) - Number(b.id))
//     .slice(0, 4)
// }

// async function renderPageToCanvas(page, canvas, cssWidth, qualityMultiplier = 2.2) {
//   const baseViewport = page.getViewport({ scale: 1 })
//   const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2.5)
//   const desiredPixels = Math.max(cssWidth * dpr * qualityMultiplier, 1200)
//   const scale = desiredPixels / baseViewport.width
//   const viewport = page.getViewport({ scale })
//   const context = canvas.getContext('2d', { alpha: false })

//   canvas.width = Math.ceil(viewport.width)
//   canvas.height = Math.ceil(viewport.height)
//   canvas.style.width = '100%'
//   canvas.style.height = '100%'

//   const renderTask = page.render({
//     canvasContext: context,
//     viewport,
//     background: '#ffffff',
//   })

//   await renderTask.promise
//   return renderTask
// }

// function PdfCover({ pdfUrl, title }) {
//   const canvasRef = useRef(null)
//   const [status, setStatus] = useState('loading')

//   useEffect(() => {
//     let cancelled = false
//     let loadingTask = null
//     let renderTask = null

//     const load = async () => {
//       setStatus('loading')

//       try {
//         loadingTask = pdfjsLib.getDocument({
//           url: pdfUrl,
//           withCredentials: false,
//         })

//         const pdf = await loadingTask.promise
//         const page = await pdf.getPage(1)

//         if (cancelled || !canvasRef.current) return

//         const width = Math.max(
//           520,
//           canvasRef.current.parentElement?.clientWidth || 520,
//         )

//         renderTask = await renderPageToCanvas(page, canvasRef.current, width, 1.7)

//         if (!cancelled) setStatus('ready')
//       } catch (error) {
//         if (error?.name !== 'RenderingCancelledException') {
//           console.error(`Unable to render first page of ${title}:`, error)
//           if (!cancelled) setStatus('error')
//         }
//       }
//     }

//     load()

//     return () => {
//       cancelled = true
//       try {
//         renderTask?.cancel?.()
//       } catch {
//         // Rendering may already be complete.
//       }
//       loadingTask?.destroy?.().catch?.(() => {})
//     }
//   }, [pdfUrl, title])

//   return (
//     <div className={`deals-cover deals-cover--${status}`}>
//       <div className="deals-cover__book">
//         <div className="deals-cover__spine" aria-hidden="true" />
//         <div className="deals-cover__pages" aria-hidden="true" />

//         <canvas
//           ref={canvasRef}
//           className="deals-cover__canvas"
//           aria-label={`${title} catalogue cover`}
//         />

//         {status === 'loading' && (
//           <div className="deals-cover__loading" role="status">
//             <span className="deals-spinner" />
//             <span>Loading cover…</span>
//           </div>
//         )}

//         {status === 'error' && (
//           <div className="deals-cover__fallback">
//             <span>NAVSA</span>
//             <strong>{title}</strong>
//             <small>PDF Catalogue</small>
//           </div>
//         )}

//         <div className="deals-cover__shine" aria-hidden="true" />
//       </div>

//       <div className="deals-cover__shadow" aria-hidden="true" />
//     </div>
//   )
// }

// const MagazinePage = forwardRef(function MagazinePage(
//   { pdf, pageNumber, pageWidth, pageHeight, zoom },
//   ref,
// ) {
//   const canvasRef = useRef(null)
//   const [status, setStatus] = useState('loading')

//   useEffect(() => {
//     let cancelled = false
//     let renderTask = null

//     const render = async () => {
//       setStatus('loading')

//       try {
//         const page = await pdf.getPage(pageNumber)
//         if (cancelled || !canvasRef.current) return

//         renderTask = await renderPageToCanvas(
//           page,
//           canvasRef.current,
//           pageWidth * zoom,
//           1.25,
//         )

//         if (!cancelled) setStatus('ready')
//       } catch (error) {
//         if (error?.name !== 'RenderingCancelledException') {
//           console.error(`Unable to render PDF page ${pageNumber}:`, error)
//           if (!cancelled) setStatus('error')
//         }
//       }
//     }

//     render()

//     return () => {
//       cancelled = true
//       try {
//         renderTask?.cancel?.()
//       } catch {
//         // Rendering may already be complete.
//       }
//     }
//   }, [pageHeight, pageNumber, pageWidth, pdf, zoom])

//   return (
//     <div
//       ref={ref}
//       className="magazine-page"
//       style={{ width: pageWidth, height: pageHeight }}
//     >
//       <div className="magazine-page__paper">
//         <canvas
//           ref={canvasRef}
//           className="magazine-page__canvas"
//           aria-label={`Catalogue page ${pageNumber}`}
//         />

//         {status === 'loading' && (
//           <div className="magazine-page__status">
//             <span className="deals-spinner" />
//             Rendering page {pageNumber}…
//           </div>
//         )}

//         {status === 'error' && (
//           <div className="magazine-page__status magazine-page__status--error">
//             Page {pageNumber} could not be displayed.
//           </div>
//         )}

//         <span className="magazine-page__number">{pageNumber}</span>
//       </div>
//     </div>
//   )
// })

// function MagazineViewer({ deal, onClose }) {
//   const [pdf, setPdf] = useState(null)
//   const [loadStatus, setLoadStatus] = useState('loading')
//   const [currentPageIndex, setCurrentPageIndex] = useState(0)
//   const [zoom, setZoom] = useState(1)
//   const [soundEnabled, setSoundEnabled] = useState(true)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [viewport, setViewport] = useState({ width: 1200, height: 760 })

//   const shellRef = useRef(null)
//   const flipBookRef = useRef(null)
//   const soundRef = useRef(null)

//   useEffect(() => {
//     soundRef.current = new Audio(PAGE_FLIP_SOUND)
//     soundRef.current.preload = 'auto'
//     soundRef.current.volume = 0.2

//     return () => {
//       soundRef.current?.pause?.()
//       soundRef.current = null
//     }
//   }, [])

//   const playFlipSound = useCallback(() => {
//     if (!soundEnabled || !soundRef.current) return

//     try {
//       soundRef.current.currentTime = 0
//       const playPromise = soundRef.current.play()
//       playPromise?.catch?.((error) => {
//         console.warn('Page-flip sound was blocked by the browser:', error)
//       })
//     } catch (error) {
//       console.warn('Page-flip sound could not be played:', error)
//     }
//   }, [soundEnabled])

//   useEffect(() => {
//     let cancelled = false
//     let task = null

//     const load = async () => {
//       setLoadStatus('loading')

//       try {
//         task = pdfjsLib.getDocument({
//           url: deal.pdfFile,
//           withCredentials: false,
//         })

//         const loadedPdf = await task.promise

//         if (!cancelled) {
//           setPdf(loadedPdf)
//           setCurrentPageIndex(0)
//           setLoadStatus('ready')
//         }
//       } catch (error) {
//         console.error(`Unable to open ${deal.title}:`, error)
//         if (!cancelled) setLoadStatus('error')
//       }
//     }

//     load()

//     return () => {
//       cancelled = true
//       task?.destroy?.().catch?.(() => {})
//     }
//   }, [deal])

//   useEffect(() => {
//     const updateViewport = () => {
//       const width = Math.max(720, window.innerWidth - 96)
//       const height = Math.max(560, window.innerHeight - 190)
//       setViewport({ width, height })
//     }

//     updateViewport()
//     window.addEventListener('resize', updateViewport)

//     return () => window.removeEventListener('resize', updateViewport)
//   }, [])

//   useEffect(() => {
//     const onFullscreenChange = () => {
//       setIsFullscreen(Boolean(document.fullscreenElement))
//     }

//     document.addEventListener('fullscreenchange', onFullscreenChange)
//     return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
//   }, [])

//   const pageSize = useMemo(() => {
//     const availableWidth = Math.min(viewport.width, 1720)
//     const availableHeight = Math.min(viewport.height, 1080)

//     const widthFromSpread = availableWidth / 2.08
//     const widthFromHeight = availableHeight * 0.72
//     const baseWidth = Math.max(420, Math.min(widthFromSpread, widthFromHeight, 780))
//     const width = Math.round(baseWidth * zoom)
//     const height = Math.round(width * 1.414)

//     return { width, height }
//   }, [viewport, zoom])

//   const pageCount = pdf?.numPages ?? 0

//   const next = useCallback(() => {
//     flipBookRef.current?.pageFlip?.().flipNext?.()
//   }, [])

//   const previous = useCallback(() => {
//     flipBookRef.current?.pageFlip?.().flipPrev?.()
//   }, [])

//   const goToPage = useCallback((pageIndex) => {
//     const safeIndex = Math.max(0, Math.min(pageCount - 1, Number(pageIndex) || 0))
//     flipBookRef.current?.pageFlip?.().turnToPage?.(safeIndex)
//     setCurrentPageIndex(safeIndex)
//   }, [pageCount])

//   useEffect(() => {
//     const onKeyDown = (event) => {
//       if (event.key === 'Escape') {
//         onClose()
//         return
//       }

//       if (event.key === 'ArrowRight' || event.key === 'PageDown') {
//         event.preventDefault()
//         next()
//       }

//       if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
//         event.preventDefault()
//         previous()
//       }

//       if (event.key === 'Home') {
//         event.preventDefault()
//         goToPage(0)
//       }

//       if (event.key === 'End' && pageCount) {
//         event.preventDefault()
//         goToPage(pageCount - 1)
//       }
//     }

//     window.addEventListener('keydown', onKeyDown)
//     document.body.style.overflow = 'hidden'

//     return () => {
//       window.removeEventListener('keydown', onKeyDown)
//       document.body.style.overflow = ''
//     }
//   }, [goToPage, next, onClose, pageCount, previous])

//   const toggleFullscreen = async () => {
//     try {
//       if (!document.fullscreenElement) {
//         await shellRef.current?.requestFullscreen?.()
//       } else {
//         await document.exitFullscreen?.()
//       }
//     } catch (error) {
//       console.warn('Fullscreen could not be opened:', error)
//     }
//   }

//   const visibleLabel = useMemo(() => {
//     if (!pageCount) return 'Opening catalogue…'

//     const page = currentPageIndex + 1

//     if (page === 1) return `Front cover · 1 of ${pageCount}`
//     if (page === pageCount) return `Back cover · ${pageCount} of ${pageCount}`

//     const left = page % 2 === 0 ? page : page - 1
//     const right = Math.min(pageCount, left + 1)
//     return `Pages ${left}–${right} of ${pageCount}`
//   }, [currentPageIndex, pageCount])

//   return (
//     <div
//       className="magazine-overlay"
//       role="dialog"
//       aria-modal="true"
//       aria-label={`${deal.title} magazine viewer`}
//     >
//       <div className="magazine-shell" ref={shellRef}>
//         <header className="magazine-toolbar">
//           <div className="magazine-toolbar__title">
//             <strong>{deal.title}</strong>
//             <span>{visibleLabel}</span>
//           </div>

//           <div className="magazine-toolbar__actions">
//             <button
//               type="button"
//               onClick={() => setZoom((value) => Math.max(0.75, Number((value - 0.1).toFixed(2))))}
//               title="Zoom out"
//             >
//               −
//             </button>

//             <span className="magazine-zoom-label">{Math.round(zoom * 100)}%</span>

//             <button
//               type="button"
//               onClick={() => setZoom((value) => Math.min(1.35, Number((value + 0.1).toFixed(2))))}
//               title="Zoom in"
//             >
//               +
//             </button>

//             <button
//               type="button"
//               className={soundEnabled ? 'is-active' : ''}
//               onClick={() => {
//                 setSoundEnabled((value) => !value)
//                 if (!soundEnabled) {
//                   window.setTimeout(playFlipSound, 0)
//                 }
//               }}
//             >
//               {soundEnabled ? 'Sound: On' : 'Sound: Off'}
//             </button>

//             <button type="button" onClick={toggleFullscreen}>
//               {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
//             </button>

//             <a
//               href={deal.pdfFile}
//               download
//               onClick={(event) => event.stopPropagation()}
//             >
//               Download PDF
//             </a>

//             <button
//               type="button"
//               className="magazine-close"
//               onClick={onClose}
//               aria-label="Close magazine"
//             >
//               ×
//             </button>
//           </div>
//         </header>

//         <main className="magazine-stage">
//           <button
//             type="button"
//             className="magazine-nav magazine-nav--previous"
//             onClick={previous}
//             disabled={!pdf || currentPageIndex <= 0}
//             aria-label="Previous pages"
//           >
//             ‹
//           </button>

//           {loadStatus === 'loading' && (
//             <div className="magazine-status">
//               <span className="deals-spinner" />
//               Loading high-quality magazine…
//             </div>
//           )}

//           {loadStatus === 'error' && (
//             <div className="magazine-status magazine-status--error">
//               The catalogue could not be opened. The original PDF can still be downloaded.
//             </div>
//           )}

//           {loadStatus === 'ready' && pdf && (
//             <div
//               className={[
//                 'magazine-book-wrap',
//                 currentPageIndex === 0 ? 'magazine-book-wrap--front-cover' : '',
//                 pageCount > 1 && currentPageIndex === pageCount - 1
//                   ? 'magazine-book-wrap--back-cover'
//                   : '',
//               ].filter(Boolean).join(' ')}
//               style={{ '--magazine-cover-shift': `${Math.round(pageSize.width / 2)}px` }}
//             >
//               <HTMLFlipBook
//                 key={`${deal.id}-${pageSize.width}-${pageSize.height}`}
//                 ref={flipBookRef}
//                 width={pageSize.width}
//                 height={pageSize.height}
//                 size="fixed"
//                 minWidth={320}
//                 maxWidth={980}
//                 minHeight={452}
//                 maxHeight={1386}
//                 showCover
//                 usePortrait={false}
//                 mobileScrollSupport
//                 clickEventForward
//                 useMouseEvents
//                 swipeDistance={20}
//                 flippingTime={950}
//                 drawShadow
//                 maxShadowOpacity={0.55}
//                 showPageCorners
//                 disableFlipByClick={false}
//                 className="magazine-book"
//                 style={{ margin: '0 auto' }}
//                 startPage={currentPageIndex}
//                 onFlip={(event) => {
//                   setCurrentPageIndex(event.data)
//                   playFlipSound()
//                 }}
//               >
//                 {Array.from({ length: pageCount }, (_, index) => (
//                   <MagazinePage
//                     key={index + 1}
//                     pdf={pdf}
//                     pageNumber={index + 1}
//                     pageWidth={pageSize.width}
//                     pageHeight={pageSize.height}
//                     zoom={zoom}
//                   />
//                 ))}
//               </HTMLFlipBook>
//             </div>
//           )}

//           <button
//             type="button"
//             className="magazine-nav magazine-nav--next"
//             onClick={next}
//             disabled={!pdf || currentPageIndex >= Math.max(0, pageCount - 1)}
//             aria-label="Next pages"
//           >
//             ›
//           </button>
//         </main>

//         <footer className="magazine-footer">
//           <span>Drag page corners, swipe, use ← → keys, or drag the slider.</span>

//           <input
//             type="range"
//             min="0"
//             max={Math.max(0, pageCount - 1)}
//             step="1"
//             value={Math.min(currentPageIndex, Math.max(0, pageCount - 1))}
//             disabled={!pdf}
//             onInput={(event) => goToPage(event.currentTarget.value)}
//             onChange={(event) => goToPage(event.currentTarget.value)}
//             aria-label="Catalogue page position"
//           />

//           <span>
//             {pageCount ? `${currentPageIndex + 1} / ${pageCount}` : '—'}
//           </span>
//         </footer>
//       </div>
//     </div>
//   )
// }

// function DealCard({ deal, onOpen }) {
//   const validity = deal.validityText
//     || (deal.validFrom && deal.validTo
//       ? `Valid ${formatDate(deal.validFrom)} to ${formatDate(deal.validTo)}`
//       : '')

//   const openMagazine = () => onOpen(deal)

//   return (
//     <article
//       className="deals-card"
//       role="button"
//       tabIndex={0}
//       onClick={openMagazine}
//       onKeyDown={(event) => {
//         if (event.key === 'Enter' || event.key === ' ') {
//           event.preventDefault()
//           openMagazine()
//         }
//       }}
//       aria-label={`Open ${deal.title} as a magazine`}
//     >
//       <span className="deals-card__badge">{deal.badge}</span>

//       <div className="deals-card__preview">
//         <PdfCover pdfUrl={deal.pdfFile} title={deal.title} />
//         <span className="deals-card__preview-action">
//           Open magazine <span aria-hidden="true">→</span>
//         </span>
//       </div>

//       <div className="deals-card__body">
//         <div className="deals-card__title-row">
//           <div>
//             <span className="deals-card__kicker">PROMOTION CATALOGUE</span>
//             <h3>{deal.title}</h3>
//           </div>
//           <span className="deals-card__pdf-label">PDF</span>
//         </div>

//         {validity && <p className="deals-card__validity">{validity}</p>}
//         {deal.description && (
//           <p className="deals-card__description">{deal.description}</p>
//         )}

//         <div className="deals-card__buttons">
//           <button
//             type="button"
//             className="deals-card__view"
//             onClick={(event) => {
//               event.stopPropagation()
//               openMagazine()
//             }}
//           >
//             Open Magazine
//           </button>

//           <a
//             href={deal.pdfFile}
//             download
//             className="deals-card__download"
//             onClick={(event) => event.stopPropagation()}
//           >
//             Download PDF
//           </a>
//         </div>
//       </div>
//     </article>
//   )
// }

// export default function Deals() {
//   const [payload, setPayload] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [openDeal, setOpenDeal] = useState(null)

//   useEffect(() => {
//     const controller = new AbortController()

//     const load = async () => {
//       try {
//         const response = await fetch(`${API_BASE}/deals`, {
//           signal: controller.signal,
//           headers: { Accept: 'application/json' },
//         })

//         if (!response.ok) throw new Error(`HTTP ${response.status}`)

//         const data = await response.json()
//         setPayload(data)
//       } catch (error) {
//         if (error?.name !== 'AbortError') {
//           console.error('Unable to load NAVSA deals:', error)
//           setPayload([])
//         }
//       } finally {
//         if (!controller.signal.aborted) setLoading(false)
//       }
//     }

//     load()
//     return () => controller.abort()
//   }, [])

//   const deals = useMemo(() => normaliseDeals(payload), [payload])

//   if (loading || !deals.length) return null

//   return (
//     <>
//       <section className="deals-section">
//         <div className="deals-shell">
//           <header className="deals-header">
//             <span>LATEST DEALS</span>
//             <h2>Download Our Latest Promotions</h2>
//             <p>
//               Browse the latest NAVSA promotion brochures. Open any catalogue
//               as an animated magazine or download the original PDF.
//             </p>
//           </header>

//           <div className={`deals-grid deals-grid--${Math.min(deals.length, 4)}`}>
//             {deals.map((deal) => (
//               <DealCard key={deal.id} deal={deal} onOpen={setOpenDeal} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {openDeal && (
//         <MagazineViewer deal={openDeal} onClose={() => setOpenDeal(null)} />
//       )}
//     </>
//   )
// }

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import HTMLFlipBook from 'react-pageflip'
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs'
import './Deals.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const API_BASE = import.meta.env.VITE_API_URL || '/api'
const PAGE_FLIP_SOUND = '/sounds/page-turn.mp3'
const pdfDocumentCache = new Map()

function getPdfDocument(url) {
  if (!pdfDocumentCache.has(url)) {
    const loadingTask = pdfjsLib.getDocument({
      url,
      withCredentials: false,
      disableAutoFetch: true,
      rangeChunkSize: 65536,
    })

    const promise = loadingTask.promise.catch((error) => {
      pdfDocumentCache.delete(url)
      throw error
    })

    pdfDocumentCache.set(url, promise)
  }

  return pdfDocumentCache.get(url)
}

function normalisePdfUrl(url) {
  if (!url) return ''

  try {
    const parsedUrl = new URL(url, window.location.origin)

    if (import.meta.env.DEV && parsedUrl.pathname.startsWith('/storage/')) {
      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
    }

    return parsedUrl.href
  } catch (error) {
    console.error('Invalid PDF URL:', url, error)
    return url
  }
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function normaliseDeals(payload) {
  const collection = Array.isArray(payload)
    ? payload
    : payload?.data ?? payload?.items ?? payload?.results ?? []

  if (!Array.isArray(collection)) return []

  return collection
    .filter((item) => item && item.file_url && item.is_active !== false)
    .map((item, index) => ({
      id: item.id ?? `deal-${index}`,
      title: item.title ?? `NAVSA Promotion ${index + 1}`,
      validFrom: item.valid_from ?? '',
      validTo: item.valid_to ?? '',
      validityText: item.validity_text ?? '',
      description: item.description ?? '',
      pdfFile: normalisePdfUrl(item.file_url),
      badge: item.badge || 'PROMOTION',
      sortOrder: Number(item.sort_order ?? index + 1),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder || Number(a.id) - Number(b.id))
    .slice(0, 4)
}

async function renderPageToCanvas(page, canvas, cssWidth, qualityMultiplier = 2.2) {
  const baseViewport = page.getViewport({ scale: 1 })
  const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2.5)
  const desiredPixels = Math.max(cssWidth * dpr * qualityMultiplier, 900)
  const scale = desiredPixels / baseViewport.width
  const viewport = page.getViewport({ scale })
  const context = canvas.getContext('2d', { alpha: false })

  canvas.width = Math.ceil(viewport.width)
  canvas.height = Math.ceil(viewport.height)
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  const renderTask = page.render({
    canvasContext: context,
    viewport,
    background: '#ffffff',
  })

  await renderTask.promise
  return renderTask
}

function PdfCover({ pdfUrl, title }) {
  const canvasRef = useRef(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    let renderTask = null
    const cacheKey = `navsa-cover:${pdfUrl}`

    const drawCachedCover = async () => {
      try {
        const cached = window.sessionStorage.getItem(cacheKey)
        if (!cached || !canvasRef.current) return false

        const image = new Image()
        image.src = cached
        await image.decode()

        if (cancelled || !canvasRef.current) return true

        const canvas = canvasRef.current
        const context = canvas.getContext('2d', { alpha: false })
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        context.drawImage(image, 0, 0)
        setStatus('ready')
        return true
      } catch {
        return false
      }
    }

    const load = async () => {
      setStatus('loading')

      try {
        if (await drawCachedCover()) return

        const pdf = await getPdfDocument(pdfUrl)
        const page = await pdf.getPage(1)

        if (cancelled || !canvasRef.current) return

        const width = Math.max(
          360,
          canvasRef.current.parentElement?.clientWidth || 420,
        )

        renderTask = await renderPageToCanvas(page, canvasRef.current, width, 1.05)

        if (!cancelled && canvasRef.current) {
          setStatus('ready')

          try {
            const preview = canvasRef.current.toDataURL('image/webp', 0.82)
            if (preview.length < 1_800_000) {
              window.sessionStorage.setItem(cacheKey, preview)
            }
          } catch {
            // Browser storage may be disabled or full.
          }
        }
      } catch (error) {
        if (error?.name !== 'RenderingCancelledException') {
          console.error(`Unable to render first page of ${title}:`, error)
          if (!cancelled) setStatus('error')
        }
      }
    }

    load()

    return () => {
      cancelled = true
      try {
        renderTask?.cancel?.()
      } catch {
        // Rendering may already be complete.
      }
    }
  }, [pdfUrl, title])

  return (
    <div className={`deals-cover deals-cover--${status}`}>
      <div className="deals-cover__book">
        <div className="deals-cover__spine" aria-hidden="true" />
        <div className="deals-cover__pages" aria-hidden="true" />

        <canvas
          ref={canvasRef}
          className="deals-cover__canvas"
          aria-label={`${title} catalogue cover`}
        />

        {status === 'loading' && (
          <div className="deals-cover__loading" role="status" aria-label="Loading catalogue cover">
            <span className="deals-spinner" />
          </div>
        )}

        {status === 'error' && (
          <div className="deals-cover__fallback">
            <span>NAVSA</span>
            <strong>{title}</strong>
            <small>PDF Catalogue</small>
          </div>
        )}

        <div className="deals-cover__shine" aria-hidden="true" />
      </div>

      <div className="deals-cover__shadow" aria-hidden="true" />
    </div>
  )
}

const MagazinePage = forwardRef(function MagazinePage(
  { pdf, pageNumber, pageWidth, pageHeight, zoom, shouldRender },
  ref,
) {
  const canvasRef = useRef(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    let cancelled = false
    let renderTask = null

    const render = async () => {
      if (!shouldRender) return
      setStatus('loading')

      try {
        const page = await pdf.getPage(pageNumber)
        if (cancelled || !canvasRef.current) return

        renderTask = await renderPageToCanvas(
          page,
          canvasRef.current,
          pageWidth * zoom,
          1.25,
        )

        if (!cancelled) setStatus('ready')
      } catch (error) {
        if (error?.name !== 'RenderingCancelledException') {
          console.error(`Unable to render PDF page ${pageNumber}:`, error)
          if (!cancelled) setStatus('error')
        }
      }
    }

    render()

    return () => {
      cancelled = true
      try {
        renderTask?.cancel?.()
      } catch {
        // Rendering may already be complete.
      }
    }
  }, [pageHeight, pageNumber, pageWidth, pdf, shouldRender, zoom])

  return (
    <div
      ref={ref}
      className="magazine-page"
      style={{ width: pageWidth, height: pageHeight }}
    >
      <div className="magazine-page__paper">
        <canvas
          ref={canvasRef}
          className="magazine-page__canvas"
          aria-label={`Catalogue page ${pageNumber}`}
        />

        {(status === 'idle' || status === 'loading') && (
          <div className="magazine-page__status" aria-label={`Preparing catalogue page ${pageNumber}`}>
            {status === 'loading' && <span className="deals-spinner" />}
          </div>
        )}

        {status === 'error' && (
          <div className="magazine-page__status magazine-page__status--error">
            Page {pageNumber} could not be displayed.
          </div>
        )}

        <span className="magazine-page__number">{pageNumber}</span>
      </div>
    </div>
  )
})

function MagazineViewer({ deal, onClose }) {
  const [pdf, setPdf] = useState(null)
  const [loadStatus, setLoadStatus] = useState('loading')
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewport, setViewport] = useState({ width: 1200, height: 760 })
  const [pageRatio, setPageRatio] = useState(1.414)

  const shellRef = useRef(null)
  const stageRef = useRef(null)
  const flipBookRef = useRef(null)
  const soundRef = useRef(null)

  useEffect(() => {
    soundRef.current = new Audio(PAGE_FLIP_SOUND)
    soundRef.current.preload = 'auto'
    soundRef.current.volume = 0.38

    return () => {
      soundRef.current?.pause?.()
      soundRef.current = null
    }
  }, [])

  const playFlipSound = useCallback(() => {
    if (!soundEnabled || !soundRef.current) return

    try {
      soundRef.current.currentTime = 0
      const playPromise = soundRef.current.play()
      playPromise?.catch?.((error) => {
        console.warn('Page-flip sound was blocked by the browser:', error)
      })
    } catch (error) {
      console.warn('Page-flip sound could not be played:', error)
    }
  }, [soundEnabled])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoadStatus('loading')

      try {
        const loadedPdf = await getPdfDocument(deal.pdfFile)
        const firstPage = await loadedPdf.getPage(1)
        const viewport = firstPage.getViewport({ scale: 1 })

        if (!cancelled) {
          setPdf(loadedPdf)
          setPageRatio(viewport.height / viewport.width)
          setCurrentPageIndex(0)
          setLoadStatus('ready')
        }
      } catch (error) {
        console.error(`Unable to open ${deal.title}:`, error)
        if (!cancelled) setLoadStatus('error')
      }
    }

    load()
    return () => { cancelled = true }
  }, [deal])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const updateViewport = () => {
      const rect = stage.getBoundingClientRect()
      setViewport({
        width: Math.max(640, rect.width),
        height: Math.max(420, rect.height),
      })
    }

    updateViewport()
    const observer = new ResizeObserver(updateViewport)
    observer.observe(stage)
    window.addEventListener('resize', updateViewport)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateViewport)
    }
  }, [isFullscreen, loadStatus])

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const pageSize = useMemo(() => {
    const horizontalAllowance = isFullscreen ? 118 : 142
    const verticalAllowance = isFullscreen ? 18 : 30
    const availableWidth = Math.max(620, viewport.width - horizontalAllowance)
    const availableHeight = Math.max(400, viewport.height - verticalAllowance)

    const widthFromSpread = availableWidth / 2.015
    const widthFromHeight = availableHeight / pageRatio
    const maximumWidth = isFullscreen ? 1040 : 880
    const baseWidth = Math.max(
      320,
      Math.min(widthFromSpread, widthFromHeight, maximumWidth),
    )
    const width = Math.round(baseWidth * zoom)
    const height = Math.round(width * pageRatio)

    return { width, height }
  }, [isFullscreen, pageRatio, viewport, zoom])

  const pageCount = pdf?.numPages ?? 0

  const next = useCallback(() => {
    flipBookRef.current?.pageFlip?.().flipNext?.()
  }, [])

  const previous = useCallback(() => {
    flipBookRef.current?.pageFlip?.().flipPrev?.()
  }, [])

  const goToPage = useCallback((pageIndex) => {
    const safeIndex = Math.max(0, Math.min(pageCount - 1, Number(pageIndex) || 0))
    flipBookRef.current?.pageFlip?.().turnToPage?.(safeIndex)
    setCurrentPageIndex(safeIndex)
  }, [pageCount])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault()
        next()
      }

      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        previous()
      }

      if (event.key === 'Home') {
        event.preventDefault()
        goToPage(0)
      }

      if (event.key === 'End' && pageCount) {
        event.preventDefault()
        goToPage(pageCount - 1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [goToPage, next, onClose, pageCount, previous])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await shellRef.current?.requestFullscreen?.()
      } else {
        await document.exitFullscreen?.()
      }
    } catch (error) {
      console.warn('Fullscreen could not be opened:', error)
    }
  }

  const visibleLabel = useMemo(() => {
    if (!pageCount) return 'Opening catalogue…'

    const page = currentPageIndex + 1

    if (page === 1) return `Front cover · 1 of ${pageCount}`
    if (page === pageCount) return `Back cover · ${pageCount} of ${pageCount}`

    const left = page % 2 === 0 ? page : page - 1
    const right = Math.min(pageCount, left + 1)
    return `Pages ${left}–${right} of ${pageCount}`
  }, [currentPageIndex, pageCount])

  return (
    <div
      className="magazine-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${deal.title} magazine viewer`}
    >
      <div className="magazine-shell" ref={shellRef}>
        <header className="magazine-toolbar">
          <div className="magazine-toolbar__title">
            <strong>{deal.title}</strong>
            <span>{visibleLabel}</span>
          </div>

          <div className="magazine-toolbar__actions">
            <button
              type="button"
              className="magazine-back"
              onClick={onClose}
            >
              ← Back to Homepage
            </button>

            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(0.75, Number((value - 0.1).toFixed(2))))}
              title="Zoom out"
            >
              −
            </button>

            <span className="magazine-zoom-label">{Math.round(zoom * 100)}%</span>

            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(1.35, Number((value + 0.1).toFixed(2))))}
              title="Zoom in"
            >
              +
            </button>

            <button
              type="button"
              className={soundEnabled ? 'is-active' : ''}
              onClick={() => {
                setSoundEnabled((value) => !value)
                if (!soundEnabled) {
                  window.setTimeout(playFlipSound, 0)
                }
              }}
            >
              {soundEnabled ? 'Sound: On' : 'Sound: Off'}
            </button>

            <button type="button" onClick={toggleFullscreen}>
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>

            <a
              href={deal.pdfFile}
              download
              onClick={(event) => event.stopPropagation()}
            >
              Download PDF
            </a>

            <button
              type="button"
              className="magazine-close"
              onClick={onClose}
              aria-label="Close magazine"
            >
              ×
            </button>
          </div>
        </header>

        <main className="magazine-stage" ref={stageRef}>
          <button
            type="button"
            className="magazine-nav magazine-nav--previous"
            onClick={previous}
            disabled={!pdf || currentPageIndex <= 0}
            aria-label="Previous pages"
          >
            ‹
          </button>

          {loadStatus === 'loading' && (
            <div className="magazine-status">
              <span className="deals-spinner" />
            </div>
          )}

          {loadStatus === 'error' && (
            <div className="magazine-status magazine-status--error">
              The catalogue could not be opened. The original PDF can still be downloaded.
            </div>
          )}

          {loadStatus === 'ready' && pdf && (
            <div
              className={[
                'magazine-book-wrap',
                currentPageIndex === 0 ? 'magazine-book-wrap--front-cover' : '',
                pageCount > 1 && currentPageIndex === pageCount - 1
                  ? 'magazine-book-wrap--back-cover'
                  : '',
              ].filter(Boolean).join(' ')}
              style={{ '--magazine-cover-shift': `${Math.round(pageSize.width / 2)}px` }}
            >
              <HTMLFlipBook
                key={`${deal.id}-${pageSize.width}-${pageSize.height}`}
                ref={flipBookRef}
                width={pageSize.width}
                height={pageSize.height}
                size="fixed"
                minWidth={320}
                maxWidth={1200}
                minHeight={452}
                maxHeight={1800}
                showCover
                usePortrait={false}
                mobileScrollSupport
                clickEventForward
                useMouseEvents
                swipeDistance={20}
                flippingTime={950}
                drawShadow
                maxShadowOpacity={0.55}
                showPageCorners
                disableFlipByClick={false}
                className="magazine-book"
                style={{ margin: '0 auto' }}
                startPage={currentPageIndex}
                onFlip={(event) => {
                  setCurrentPageIndex(event.data)
                  playFlipSound()
                }}
              >
                {Array.from({ length: pageCount }, (_, index) => (
                  <MagazinePage
                    key={index + 1}
                    pdf={pdf}
                    pageNumber={index + 1}
                    pageWidth={pageSize.width}
                    pageHeight={pageSize.height}
                    zoom={zoom}
                    shouldRender={
                      Math.abs(index - currentPageIndex) <= 3
                      || index <= 2
                    }
                  />
                ))}
              </HTMLFlipBook>
            </div>
          )}

          <button
            type="button"
            className="magazine-nav magazine-nav--next"
            onClick={next}
            disabled={!pdf || currentPageIndex >= Math.max(0, pageCount - 1)}
            aria-label="Next pages"
          >
            ›
          </button>
        </main>

        <footer className="magazine-footer">
          <input
            type="range"
            min="0"
            max={Math.max(0, pageCount - 1)}
            step="1"
            value={Math.min(currentPageIndex, Math.max(0, pageCount - 1))}
            disabled={!pdf}
            onInput={(event) => goToPage(event.currentTarget.value)}
            onChange={(event) => goToPage(event.currentTarget.value)}
            aria-label="Catalogue page position"
          />

          <span className="magazine-page-count">
            {pageCount ? `${currentPageIndex + 1} / ${pageCount}` : '—'}
          </span>
        </footer>
      </div>
    </div>
  )
}

function DealCard({ deal, onOpen }) {
  const validity = deal.validityText
    || (deal.validFrom && deal.validTo
      ? `Valid ${formatDate(deal.validFrom)} to ${formatDate(deal.validTo)}`
      : '')

  const openMagazine = () => onOpen(deal)

  return (
    <article
      className="deals-card"
      role="button"
      tabIndex={0}
      onClick={openMagazine}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openMagazine()
        }
      }}
      aria-label={`Open ${deal.title} as a magazine`}
    >
      <span className="deals-card__badge">{deal.badge}</span>

      <div className="deals-card__preview">
        <PdfCover pdfUrl={deal.pdfFile} title={deal.title} />
        <span className="deals-card__preview-action">
          Open magazine <span aria-hidden="true">→</span>
        </span>
      </div>

      <div className="deals-card__body">
        <div className="deals-card__title-row">
          <div>
            <span className="deals-card__kicker">PROMOTION CATALOGUE</span>
            <h3>{deal.title}</h3>
          </div>
          <span className="deals-card__pdf-label">PDF</span>
        </div>

        {validity && <p className="deals-card__validity">{validity}</p>}
        {deal.description && (
          <p className="deals-card__description">{deal.description}</p>
        )}

        <div className="deals-card__buttons">
          <button
            type="button"
            className="deals-card__view"
            onClick={(event) => {
              event.stopPropagation()
              openMagazine()
            }}
          >
            Open Magazine
          </button>

          <a
            href={deal.pdfFile}
            download
            className="deals-card__download"
            onClick={(event) => event.stopPropagation()}
          >
            Download PDF
          </a>
        </div>
      </div>
    </article>
  )
}

export default function Deals() {
  const [payload, setPayload] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDeal, setOpenDeal] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/deals`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data = await response.json()
        setPayload(data)
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('Unable to load NAVSA deals:', error)
          setPayload([])
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  const deals = useMemo(() => normaliseDeals(payload), [payload])

  if (loading || !deals.length) return null

  return (
    <>
      <section className="deals-section">
        <div className="deals-shell">
          <header className="deals-header">
            <span>LATEST DEALS</span>
            <h2>Download Our Latest Promotions</h2>
            <p>
              Browse the latest NAVSA promotion brochures. Open any catalogue
              as an animated magazine or download the original PDF.
            </p>
          </header>

          <div className={`deals-grid deals-grid--${Math.min(deals.length, 4)}`}>
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} onOpen={setOpenDeal} />
            ))}
          </div>
        </div>
      </section>

      {openDeal && (
        <MagazineViewer deal={openDeal} onClose={() => setOpenDeal(null)} />
      )}
    </>
  )
}