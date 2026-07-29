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
// const MIN_MAGAZINE_ZOOM = 0.65
// const MAX_MAGAZINE_ZOOM = 2
// const MAGAZINE_ZOOM_STEP = 0.1
// const pdfDocumentCache = new Map()

// function getPdfDocument(url) {
//   if (!pdfDocumentCache.has(url)) {
//     const loadingTask = pdfjsLib.getDocument({
//       url,
//       withCredentials: false,
//       disableAutoFetch: true,
//       rangeChunkSize: 65536,
//     })

//     const promise = loadingTask.promise.catch((error) => {
//       pdfDocumentCache.delete(url)
//       throw error
//     })

//     pdfDocumentCache.set(url, promise)
//   }

//   return pdfDocumentCache.get(url)
// }

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
//   const desiredPixels = Math.min(
//     Math.max(cssWidth * dpr * qualityMultiplier, 900),
//     4200,
//   )
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
//     let renderTask = null
//     const cacheKey = `navsa-cover:${pdfUrl}`

//     const drawCachedCover = async () => {
//       try {
//         const cached = window.sessionStorage.getItem(cacheKey)
//         if (!cached || !canvasRef.current) return false

//         const image = new Image()
//         image.src = cached
//         await image.decode()

//         if (cancelled || !canvasRef.current) return true

//         const canvas = canvasRef.current
//         const context = canvas.getContext('2d', { alpha: false })
//         canvas.width = image.naturalWidth
//         canvas.height = image.naturalHeight
//         context.drawImage(image, 0, 0)
//         setStatus('ready')
//         return true
//       } catch {
//         return false
//       }
//     }

//     const load = async () => {
//       setStatus('loading')

//       try {
//         if (await drawCachedCover()) return

//         const pdf = await getPdfDocument(pdfUrl)
//         const page = await pdf.getPage(1)

//         if (cancelled || !canvasRef.current) return

//         const width = Math.max(
//           360,
//           canvasRef.current.parentElement?.clientWidth || 420,
//         )

//         renderTask = await renderPageToCanvas(page, canvasRef.current, width, 1.05)

//         if (!cancelled && canvasRef.current) {
//           setStatus('ready')

//           try {
//             const preview = canvasRef.current.toDataURL('image/webp', 0.82)
//             if (preview.length < 1_800_000) {
//               window.sessionStorage.setItem(cacheKey, preview)
//             }
//           } catch {
//             // Browser storage may be disabled or full.
//           }
//         }
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
//           <div className="deals-cover__loading" role="status" aria-label="Loading catalogue cover">
//             <span className="deals-spinner" />
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
//   { pdf, pageNumber, pageWidth, pageHeight, shouldRender },
//   ref,
// ) {
//   const canvasRef = useRef(null)
//   const [status, setStatus] = useState('idle')

//   useEffect(() => {
//     let cancelled = false
//     let renderTask = null

//     const render = async () => {
//       if (!shouldRender) return
//       setStatus('loading')

//       try {
//         const page = await pdf.getPage(pageNumber)
//         if (cancelled || !canvasRef.current) return

//         renderTask = await renderPageToCanvas(
//           page,
//           canvasRef.current,
//           pageWidth,
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
//   }, [pageHeight, pageNumber, pageWidth, pdf, shouldRender])

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

//         {(status === 'idle' || status === 'loading') && (
//           <div className="magazine-page__status" aria-label={`Preparing catalogue page ${pageNumber}`}>
//             {status === 'loading' && <span className="deals-spinner" />}
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
//   const [isFallbackFullscreen, setIsFallbackFullscreen] = useState(false)
//   const [viewport, setViewport] = useState({ width: 1200, height: 760 })
//   const [pageRatio, setPageRatio] = useState(1.414)

//   const shellRef = useRef(null)
//   const stageRef = useRef(null)
//   const flipBookRef = useRef(null)
//   const soundRef = useRef(null)

//   useEffect(() => {
//     soundRef.current = new Audio(PAGE_FLIP_SOUND)
//     soundRef.current.preload = 'auto'
//     soundRef.current.volume = 0.38

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

//     const load = async () => {
//       setLoadStatus('loading')

//       try {
//         const loadedPdf = await getPdfDocument(deal.pdfFile)
//         const firstPage = await loadedPdf.getPage(1)
//         const viewport = firstPage.getViewport({ scale: 1 })

//         if (!cancelled) {
//           setPdf(loadedPdf)
//           setPageRatio(viewport.height / viewport.width)
//           setCurrentPageIndex(0)
//           setLoadStatus('ready')
//         }
//       } catch (error) {
//         console.error(`Unable to open ${deal.title}:`, error)
//         if (!cancelled) setLoadStatus('error')
//       }
//     }

//     load()
//     return () => { cancelled = true }
//   }, [deal])

//   useEffect(() => {
//     const stage = stageRef.current
//     if (!stage) return undefined

//     const updateViewport = () => {
//       const rect = stage.getBoundingClientRect()
//       setViewport({
//         width: Math.max(1, Math.round(rect.width)),
//         height: Math.max(1, Math.round(rect.height)),
//       })
//     }

//     updateViewport()

//     const observer = typeof ResizeObserver !== 'undefined'
//       ? new ResizeObserver(updateViewport)
//       : null

//     observer?.observe(stage)
//     window.addEventListener('resize', updateViewport)
//     window.visualViewport?.addEventListener('resize', updateViewport)

//     return () => {
//       observer?.disconnect()
//       window.removeEventListener('resize', updateViewport)
//       window.visualViewport?.removeEventListener('resize', updateViewport)
//     }
//   }, [isFullscreen, isFallbackFullscreen, loadStatus])

//   useEffect(() => {
//     const onFullscreenChange = () => {
//       const fullscreenElement = document.fullscreenElement
//         || document.webkitFullscreenElement
//       setIsFullscreen(fullscreenElement === shellRef.current)
//     }

//     document.addEventListener('fullscreenchange', onFullscreenChange)
//     document.addEventListener('webkitfullscreenchange', onFullscreenChange)

//     return () => {
//       document.removeEventListener('fullscreenchange', onFullscreenChange)
//       document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
//     }
//   }, [])

//   const fullscreenMode = isFullscreen || isFallbackFullscreen
//   const singlePageMode = viewport.width <= 760 || viewport.height <= 560

//   const pageSize = useMemo(() => {
//     const horizontalAllowance = singlePageMode
//       ? 92
//       : fullscreenMode
//         ? 128
//         : 146
//     const verticalAllowance = singlePageMode ? 20 : fullscreenMode ? 12 : 24
//     const availableWidth = Math.max(140, viewport.width - horizontalAllowance)
//     const availableHeight = Math.max(180, viewport.height - verticalAllowance)

//     const widthFromLayout = singlePageMode
//       ? availableWidth
//       : availableWidth / 2.015
//     const widthFromHeight = availableHeight / pageRatio
//     const maximumWidth = fullscreenMode ? 1100 : 900
//     const fittedWidth = Math.max(
//       140,
//       Math.min(widthFromLayout, widthFromHeight, maximumWidth),
//     )
//     const width = Math.round(fittedWidth * zoom)
//     const height = Math.round(width * pageRatio)

//     return { width, height }
//   }, [fullscreenMode, pageRatio, singlePageMode, viewport, zoom])

//   const pageCount = pdf?.numPages ?? 0

//   const changeZoom = useCallback((nextZoom) => {
//     setZoom((currentZoom) => {
//       const resolvedZoom = typeof nextZoom === 'function'
//         ? nextZoom(currentZoom)
//         : nextZoom

//       return Math.min(
//         MAX_MAGAZINE_ZOOM,
//         Math.max(MIN_MAGAZINE_ZOOM, Number(resolvedZoom.toFixed(2))),
//       )
//     })
//   }, [])

//   const zoomOut = useCallback(() => {
//     changeZoom((value) => value - MAGAZINE_ZOOM_STEP)
//   }, [changeZoom])

//   const zoomIn = useCallback(() => {
//     changeZoom((value) => value + MAGAZINE_ZOOM_STEP)
//   }, [changeZoom])

//   const resetZoom = useCallback(() => {
//     changeZoom(1)
//   }, [changeZoom])

//   useEffect(() => {
//     const frame = window.requestAnimationFrame(() => {
//       const stage = stageRef.current
//       if (!stage) return

//       stage.scrollTo({
//         left: Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2),
//         top: Math.max(0, (stage.scrollHeight - stage.clientHeight) / 2),
//         behavior: 'auto',
//       })
//     })

//     return () => window.cancelAnimationFrame(frame)
//   }, [fullscreenMode, pageSize.height, pageSize.width, singlePageMode, zoom])

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

//   const closeViewer = useCallback(async () => {
//     try {
//       const fullscreenElement = document.fullscreenElement
//         || document.webkitFullscreenElement
//       const exitFullscreen = document.exitFullscreen
//         || document.webkitExitFullscreen

//       if (fullscreenElement === shellRef.current && exitFullscreen) {
//         await exitFullscreen.call(document)
//       }
//     } catch (error) {
//       console.warn('Fullscreen could not be closed cleanly:', error)
//     } finally {
//       setIsFallbackFullscreen(false)
//       onClose()
//     }
//   }, [onClose])

//   useEffect(() => {
//     const onKeyDown = (event) => {
//       if (event.key === 'Escape') {
//         // Let the browser leave fullscreen first. A second Escape closes the viewer.
//         if (isFullscreen) return
//         if (isFallbackFullscreen) {
//           setIsFallbackFullscreen(false)
//           return
//         }
//         closeViewer()
//         return
//       }

//       if (event.key === '+' || event.key === '=') {
//         event.preventDefault()
//         zoomIn()
//       }

//       if (event.key === '-') {
//         event.preventDefault()
//         zoomOut()
//       }

//       if (event.key === '0') {
//         event.preventDefault()
//         resetZoom()
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

//     const previousOverflow = document.body.style.overflow
//     window.addEventListener('keydown', onKeyDown)
//     document.body.style.overflow = 'hidden'

//     return () => {
//       window.removeEventListener('keydown', onKeyDown)
//       document.body.style.overflow = previousOverflow
//     }
//   }, [closeViewer, goToPage, isFallbackFullscreen, isFullscreen, next, pageCount, previous, resetZoom, zoomIn, zoomOut])

//   const toggleFullscreen = useCallback(async () => {
//     try {
//       const shell = shellRef.current
//       if (!shell) return

//       const fullscreenElement = document.fullscreenElement
//         || document.webkitFullscreenElement
//       const requestFullscreen = shell.requestFullscreen
//         || shell.webkitRequestFullscreen
//       const exitFullscreen = document.exitFullscreen
//         || document.webkitExitFullscreen

//       if (fullscreenElement === shell) {
//         await exitFullscreen?.call(document)
//       } else if (isFallbackFullscreen) {
//         setIsFallbackFullscreen(false)
//       } else if (requestFullscreen) {
//         await requestFullscreen.call(shell)
//       } else {
//         // iPhone Safari and some in-app browsers do not expose the element fullscreen API.
//         setIsFallbackFullscreen(true)
//       }
//     } catch (error) {
//       console.warn('Fullscreen could not be opened:', error)
//     }
//   }, [isFallbackFullscreen])

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
//       <div
//         className={isFallbackFullscreen
//           ? 'magazine-shell magazine-shell--fallback-fullscreen'
//           : 'magazine-shell'}
//         ref={shellRef}
//       >
//         <header className="magazine-toolbar">
//           <div className="magazine-toolbar__title">
//             <strong>{deal.title}</strong>
//             <span>{visibleLabel}</span>
//           </div>

//           <div className="magazine-toolbar__actions">
//             <button
//               type="button"
//               className="magazine-back"
//               onClick={closeViewer}
//               aria-label="Back to homepage"
//             >
//               <span className="magazine-control__desktop">← Back to Homepage</span>
//               <span className="magazine-control__mobile">← Back</span>
//             </button>

//             <div className="magazine-zoom-controls" role="group" aria-label="Magazine zoom controls">
//               <button
//                 type="button"
//                 onClick={zoomOut}
//                 title="Zoom out"
//                 aria-label="Zoom out"
//                 disabled={zoom <= MIN_MAGAZINE_ZOOM}
//               >
//                 −
//               </button>

//               <button
//                 type="button"
//                 className="magazine-zoom-label"
//                 onClick={resetZoom}
//                 title="Reset zoom to fit"
//                 aria-label={`Reset zoom. Current zoom ${Math.round(zoom * 100)} percent`}
//               >
//                 {Math.round(zoom * 100)}%
//               </button>

//               <button
//                 type="button"
//                 onClick={zoomIn}
//                 title="Zoom in"
//                 aria-label="Zoom in"
//                 disabled={zoom >= MAX_MAGAZINE_ZOOM}
//               >
//                 +
//               </button>
//             </div>

//             <button
//               type="button"
//               className={soundEnabled ? 'is-active magazine-sound' : 'magazine-sound'}
//               onClick={() => {
//                 setSoundEnabled((value) => !value)
//                 if (!soundEnabled) {
//                   window.setTimeout(playFlipSound, 0)
//                 }
//               }}
//               aria-label={soundEnabled ? 'Turn page sound off' : 'Turn page sound on'}
//             >
//               <span className="magazine-control__desktop">{soundEnabled ? 'Sound: On' : 'Sound: Off'}</span>
//               <span className="magazine-control__mobile">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
//             </button>

//             <button
//               type="button"
//               className="magazine-fullscreen"
//               onClick={toggleFullscreen}
//               aria-label={fullscreenMode ? 'Exit fullscreen' : 'Open fullscreen'}
//             >
//               <span className="magazine-control__desktop">{fullscreenMode ? 'Exit Fullscreen' : 'Fullscreen'}</span>
//               <span className="magazine-control__mobile">{fullscreenMode ? 'Exit Full' : 'Full'}</span>
//             </button>

//             <a
//               href={deal.pdfFile}
//               download
//               className="magazine-download"
//               onClick={(event) => event.stopPropagation()}
//               aria-label="Download catalogue PDF"
//             >
//               <span className="magazine-control__desktop">Download PDF</span>
//               <span className="magazine-control__mobile">PDF</span>
//             </a>

//             <button
//               type="button"
//               className="magazine-close"
//               onClick={closeViewer}
//               aria-label="Close magazine"
//             >
//               ×
//             </button>
//           </div>
//         </header>

//         <main className="magazine-stage" ref={stageRef}>
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
//                 !singlePageMode && currentPageIndex === 0
//                   ? 'magazine-book-wrap--front-cover'
//                   : '',
//                 !singlePageMode && pageCount > 1 && currentPageIndex === pageCount - 1
//                   ? 'magazine-book-wrap--back-cover'
//                   : '',
//               ].filter(Boolean).join(' ')}
//               style={{ '--magazine-cover-shift': `${Math.round(pageSize.width / 2)}px` }}
//             >
//               <HTMLFlipBook
//                 key={`${deal.id}-${pageSize.width}-${pageSize.height}-${singlePageMode ? 'single' : 'spread'}`}
//                 ref={flipBookRef}
//                 width={pageSize.width}
//                 height={pageSize.height}
//                 size="fixed"
//                 minWidth={140}
//                 maxWidth={2200}
//                 minHeight={198}
//                 maxHeight={3300}
//                 showCover
//                 usePortrait={singlePageMode}
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
//                     shouldRender={
//                       Math.abs(index - currentPageIndex) <= 3
//                       || index <= 2
//                     }
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

//           <span className="magazine-page-count">
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
const MIN_MAGAZINE_ZOOM = 0.65
const MAX_MAGAZINE_ZOOM = 2
const MAGAZINE_ZOOM_STEP = 0.1
const MIN_FULLSCREEN_TOUCHPAD_ZOOM = 1
const MAX_FULLSCREEN_TOUCHPAD_ZOOM = 3
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
  const desiredPixels = Math.min(
    Math.max(cssWidth * dpr * qualityMultiplier, 900),
    4200,
  )
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
  { pdf, pageNumber, pageWidth, pageHeight, shouldRender },
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
          pageWidth,
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
  }, [pageHeight, pageNumber, pageWidth, pdf, shouldRender])

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
  // Used only for touchpad pinch while fullscreen is active. Normal-mode
  // browser zoom remains untouched and continues working exactly as before.
  const [fullscreenTouchpadZoom, setFullscreenTouchpadZoom] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFallbackFullscreen, setIsFallbackFullscreen] = useState(false)
  const [viewport, setViewport] = useState({ width: 1200, height: 760 })
  const [pageRatio, setPageRatio] = useState(1.414)

  const shellRef = useRef(null)
  const stageRef = useRef(null)
  const flipBookRef = useRef(null)
  const soundRef = useRef(null)
  const fullscreenTouchpadZoomRef = useRef(1)
  const fullscreenZoomAnchorRef = useRef(null)

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
        width: Math.max(1, Math.round(rect.width)),
        height: Math.max(1, Math.round(rect.height)),
      })
    }

    updateViewport()

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateViewport)
      : null

    observer?.observe(stage)
    window.addEventListener('resize', updateViewport)
    window.visualViewport?.addEventListener('resize', updateViewport)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', updateViewport)
      window.visualViewport?.removeEventListener('resize', updateViewport)
    }
  }, [isFullscreen, isFallbackFullscreen, loadStatus])

  useEffect(() => {
    const onFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement
        || document.webkitFullscreenElement
      setIsFullscreen(fullscreenElement === shellRef.current)
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    }
  }, [])

  const fullscreenMode = isFullscreen || isFallbackFullscreen
  const singlePageMode = viewport.width <= 760 || viewport.height <= 560

  const pageSize = useMemo(() => {
    const horizontalAllowance = singlePageMode
      ? 92
      : fullscreenMode
        ? 128
        : 146
    const verticalAllowance = singlePageMode ? 20 : fullscreenMode ? 12 : 24
    const availableWidth = Math.max(140, viewport.width - horizontalAllowance)
    const availableHeight = Math.max(180, viewport.height - verticalAllowance)

    const widthFromLayout = singlePageMode
      ? availableWidth
      : availableWidth / 2.015
    const widthFromHeight = availableHeight / pageRatio
    const maximumWidth = fullscreenMode ? 1100 : 900
    const fittedWidth = Math.max(
      140,
      Math.min(widthFromLayout, widthFromHeight, maximumWidth),
    )
    const width = Math.round(fittedWidth * zoom)
    const height = Math.round(width * pageRatio)

    return { width, height }
  }, [fullscreenMode, pageRatio, singlePageMode, viewport, zoom])

  const pageCount = pdf?.numPages ?? 0

  const changeZoom = useCallback((nextZoom) => {
    setZoom((currentZoom) => {
      const resolvedZoom = typeof nextZoom === 'function'
        ? nextZoom(currentZoom)
        : nextZoom

      return Math.min(
        MAX_MAGAZINE_ZOOM,
        Math.max(MIN_MAGAZINE_ZOOM, Number(resolvedZoom.toFixed(2))),
      )
    })
  }, [])

  const zoomOut = useCallback(() => {
    changeZoom((value) => value - MAGAZINE_ZOOM_STEP)
  }, [changeZoom])

  const zoomIn = useCallback(() => {
    changeZoom((value) => value + MAGAZINE_ZOOM_STEP)
  }, [changeZoom])

  const resetZoom = useCallback(() => {
    changeZoom(1)
  }, [changeZoom])

  useEffect(() => {
    fullscreenTouchpadZoomRef.current = fullscreenTouchpadZoom
  }, [fullscreenTouchpadZoom])

  // Outside fullscreen, the browser's original touchpad zoom behaviour is not
  // intercepted. Inside fullscreen only, Chrome/Edge expose pinch as Ctrl+wheel
  // (Safari may use Meta+wheel), so capture that gesture before page-flip sees it.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !fullscreenMode) return undefined

    let accumulatedDelta = 0
    let zoomFrame = null
    let latestPointer = null

    const onFullscreenPinchWheel = (event) => {
      if (!event.ctrlKey && !event.metaKey) return

      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation?.()

      const rect = stage.getBoundingClientRect()
      latestPointer = {
        localX: Math.min(stage.clientWidth, Math.max(0, event.clientX - rect.left)),
        localY: Math.min(stage.clientHeight, Math.max(0, event.clientY - rect.top)),
      }
      accumulatedDelta += event.deltaY

      if (zoomFrame !== null) return

      zoomFrame = window.requestAnimationFrame(() => {
        zoomFrame = null

        const delta = Math.max(-180, Math.min(180, accumulatedDelta))
        accumulatedDelta = 0
        if (Math.abs(delta) < 0.01) return

        const currentScale = fullscreenTouchpadZoomRef.current
        const nextScale = Math.max(
          MIN_FULLSCREEN_TOUCHPAD_ZOOM,
          Math.min(
            MAX_FULLSCREEN_TOUCHPAD_ZOOM,
            Number((currentScale * Math.exp(-delta * 0.003)).toFixed(3)),
          ),
        )

        if (Math.abs(nextScale - currentScale) < 0.001) return

        const pointer = latestPointer || {
          localX: stage.clientWidth / 2,
          localY: stage.clientHeight / 2,
        }

        // Preserve the content point beneath the pointer while the fullscreen
        // book is enlarged, matching the feel of normal browser pinch zoom.
        fullscreenZoomAnchorRef.current = {
          contentX: (stage.scrollLeft + pointer.localX) / currentScale,
          contentY: (stage.scrollTop + pointer.localY) / currentScale,
          localX: pointer.localX,
          localY: pointer.localY,
        }

        fullscreenTouchpadZoomRef.current = nextScale
        setFullscreenTouchpadZoom(nextScale)
      })
    }

    stage.addEventListener('wheel', onFullscreenPinchWheel, {
      passive: false,
      capture: true,
    })

    return () => {
      stage.removeEventListener('wheel', onFullscreenPinchWheel, true)
      if (zoomFrame !== null) window.cancelAnimationFrame(zoomFrame)
    }
  }, [fullscreenMode])

  useEffect(() => {
    if (!fullscreenMode) return undefined

    const anchor = fullscreenZoomAnchorRef.current
    if (!anchor) return undefined

    let innerFrame = null
    const outerFrame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(() => {
        const stage = stageRef.current
        if (!stage) return

        const maximumLeft = Math.max(0, stage.scrollWidth - stage.clientWidth)
        const maximumTop = Math.max(0, stage.scrollHeight - stage.clientHeight)

        stage.scrollTo({
          left: Math.min(
            maximumLeft,
            Math.max(0, anchor.contentX * fullscreenTouchpadZoom - anchor.localX),
          ),
          top: Math.min(
            maximumTop,
            Math.max(0, anchor.contentY * fullscreenTouchpadZoom - anchor.localY),
          ),
          behavior: 'auto',
        })

        fullscreenZoomAnchorRef.current = null
      })
    })

    return () => {
      window.cancelAnimationFrame(outerFrame)
      if (innerFrame !== null) window.cancelAnimationFrame(innerFrame)
    }
  }, [fullscreenMode, fullscreenTouchpadZoom])

  // Reset only the temporary fullscreen scale after exiting fullscreen.
  useEffect(() => {
    if (fullscreenMode) return

    fullscreenZoomAnchorRef.current = null
    fullscreenTouchpadZoomRef.current = 1
    setFullscreenTouchpadZoom(1)
  }, [fullscreenMode])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stage = stageRef.current
      if (!stage) return

      stage.scrollTo({
        left: Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2),
        top: Math.max(0, (stage.scrollHeight - stage.clientHeight) / 2),
        behavior: 'auto',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [fullscreenMode, pageSize.height, pageSize.width, singlePageMode, zoom])

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

  const closeViewer = useCallback(async () => {
    try {
      const fullscreenElement = document.fullscreenElement
        || document.webkitFullscreenElement
      const exitFullscreen = document.exitFullscreen
        || document.webkitExitFullscreen

      if (fullscreenElement === shellRef.current && exitFullscreen) {
        await exitFullscreen.call(document)
      }
    } catch (error) {
      console.warn('Fullscreen could not be closed cleanly:', error)
    } finally {
      setIsFallbackFullscreen(false)
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        // Let the browser leave fullscreen first. A second Escape closes the viewer.
        if (isFullscreen) return
        if (isFallbackFullscreen) {
          setIsFallbackFullscreen(false)
          return
        }
        closeViewer()
        return
      }

      if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        zoomIn()
      }

      if (event.key === '-') {
        event.preventDefault()
        zoomOut()
      }

      if (event.key === '0') {
        event.preventDefault()
        resetZoom()
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

    const previousOverflow = document.body.style.overflow
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [closeViewer, goToPage, isFallbackFullscreen, isFullscreen, next, pageCount, previous, resetZoom, zoomIn, zoomOut])

  const toggleFullscreen = useCallback(async () => {
    try {
      const shell = shellRef.current
      if (!shell) return

      const fullscreenElement = document.fullscreenElement
        || document.webkitFullscreenElement
      const requestFullscreen = shell.requestFullscreen
        || shell.webkitRequestFullscreen
      const exitFullscreen = document.exitFullscreen
        || document.webkitExitFullscreen

      if (fullscreenElement === shell) {
        await exitFullscreen?.call(document)
      } else if (isFallbackFullscreen) {
        setIsFallbackFullscreen(false)
      } else if (requestFullscreen) {
        await requestFullscreen.call(shell)
      } else {
        // iPhone Safari and some in-app browsers do not expose the element fullscreen API.
        setIsFallbackFullscreen(true)
      }
    } catch (error) {
      console.warn('Fullscreen could not be opened:', error)
    }
  }, [isFallbackFullscreen])

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
      <div
        className={isFallbackFullscreen
          ? 'magazine-shell magazine-shell--fallback-fullscreen'
          : 'magazine-shell'}
        ref={shellRef}
      >
        <header className="magazine-toolbar">
          <div className="magazine-toolbar__title">
            <strong>{deal.title}</strong>
            <span>{visibleLabel}</span>
          </div>

          <div className="magazine-toolbar__actions">
            <button
              type="button"
              className="magazine-back"
              onClick={closeViewer}
              aria-label="Back to homepage"
            >
              <span className="magazine-control__desktop">← Back to Homepage</span>
              <span className="magazine-control__mobile">← Back</span>
            </button>

            <div className="magazine-zoom-controls" role="group" aria-label="Magazine zoom controls">
              <button
                type="button"
                onClick={zoomOut}
                title="Zoom out"
                aria-label="Zoom out"
                disabled={zoom <= MIN_MAGAZINE_ZOOM}
              >
                −
              </button>

              <button
                type="button"
                className="magazine-zoom-label"
                onClick={resetZoom}
                title="Reset zoom to fit"
                aria-label={`Reset zoom. Current zoom ${Math.round(zoom * 100)} percent`}
              >
                {Math.round(zoom * 100)}%
              </button>

              <button
                type="button"
                onClick={zoomIn}
                title="Zoom in"
                aria-label="Zoom in"
                disabled={zoom >= MAX_MAGAZINE_ZOOM}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={soundEnabled ? 'is-active magazine-sound' : 'magazine-sound'}
              onClick={() => {
                setSoundEnabled((value) => !value)
                if (!soundEnabled) {
                  window.setTimeout(playFlipSound, 0)
                }
              }}
              aria-label={soundEnabled ? 'Turn page sound off' : 'Turn page sound on'}
            >
              <span className="magazine-control__desktop">{soundEnabled ? 'Sound: On' : 'Sound: Off'}</span>
              <span className="magazine-control__mobile">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
            </button>

            <button
              type="button"
              className="magazine-fullscreen"
              onClick={toggleFullscreen}
              aria-label={fullscreenMode ? 'Exit fullscreen' : 'Open fullscreen'}
            >
              <span className="magazine-control__desktop">{fullscreenMode ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              <span className="magazine-control__mobile">{fullscreenMode ? 'Exit Full' : 'Full'}</span>
            </button>

            <a
              href={deal.pdfFile}
              download
              className="magazine-download"
              onClick={(event) => event.stopPropagation()}
              aria-label="Download catalogue PDF"
            >
              <span className="magazine-control__desktop">Download PDF</span>
              <span className="magazine-control__mobile">PDF</span>
            </a>

            <button
              type="button"
              className="magazine-close"
              onClick={closeViewer}
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
                !singlePageMode && currentPageIndex === 0
                  ? 'magazine-book-wrap--front-cover'
                  : '',
                !singlePageMode && pageCount > 1 && currentPageIndex === pageCount - 1
                  ? 'magazine-book-wrap--back-cover'
                  : '',
              ].filter(Boolean).join(' ')}
              style={{
                '--magazine-cover-shift': `${Math.round(pageSize.width / 2)}px`,
                // CSS zoom changes the fullscreen scrollable layout without
                // rebuilding HTMLFlipBook, so the open pages cannot change.
                zoom: fullscreenMode ? fullscreenTouchpadZoom : 1,
              }}
            >
              <HTMLFlipBook
                key={`${deal.id}-${pageSize.width}-${pageSize.height}-${singlePageMode ? 'single' : 'spread'}`}
                ref={flipBookRef}
                width={pageSize.width}
                height={pageSize.height}
                size="fixed"
                minWidth={140}
                maxWidth={2200}
                minHeight={198}
                maxHeight={3300}
                showCover
                usePortrait={singlePageMode}
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