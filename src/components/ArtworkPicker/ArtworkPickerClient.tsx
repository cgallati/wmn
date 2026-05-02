'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useConfig, useField } from '@payloadcms/ui'
import type { RelationshipFieldClientComponent } from 'payload'

type SelectedEntry = {
  relationTo: 'artwork' | 'products'
  value: string | Record<string, unknown>
}

type DocItem = {
  id: string
  title: string
  imageUrl: string | undefined
  collection: 'artwork' | 'products'
}

function extractId(value: string | Record<string, unknown>): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) return value.id as string
  return ''
}

function makeKey(rel: string, id: string): string {
  return `${rel}:${id}`
}

function getEntryDisplayData(
  entry: SelectedEntry,
  fetchedItems: DocItem[],
  preloadedItems: DocItem[],
): { id: string; title: string; imageUrl: string | undefined } {
  const id = extractId(entry.value)

  if (typeof entry.value === 'object' && entry.value) {
    const obj = entry.value as any
    const title: string = obj.title || id
    let imageUrl: string | undefined
    if (entry.relationTo === 'artwork') {
      imageUrl = typeof obj.image === 'object' && obj.image ? (obj.image.url as string) : undefined
    } else {
      const firstImg = obj.gallery?.[0]?.image
      imageUrl = firstImg && typeof firstImg === 'object' ? (firstImg.url as string) : undefined
    }
    return { id, title, imageUrl }
  }

  const pool = [...fetchedItems, ...preloadedItems]
  const fetched = pool.find((it) => it.id === id && it.collection === entry.relationTo)
  return { id, title: fetched?.title ?? id, imageUrl: fetched?.imageUrl }
}

export const ArtworkPicker: RelationshipFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<SelectedEntry[]>({ path })
  const {
    config: { serverURL },
  } = useConfig()

  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'artwork' | 'products'>('artwork')
  const [items, setItems] = useState<DocItem[]>([])
  const [preloadedItems, setPreloadedItems] = useState<DocItem[]>([])
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState<Set<string>>(new Set())
  const dragIndex = React.useRef<number | null>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [insertAt, setInsertAt] = useState<number | null>(null)

  const selected: SelectedEntry[] = Array.isArray(value) ? value : []

  // Eagerly fetch all artwork and products on mount so the selected items strip
  // can show thumbnails and titles without waiting for the picker to be opened.
  // serverURL may be '' (empty string) when not set in Payload config — that's fine,
  // '' + '/api/...' produces a valid relative URL that the browser resolves correctly.
  useEffect(() => {
    const base = serverURL ?? ''

    const fetchAll = async (collection: 'artwork' | 'products'): Promise<DocItem[]> => {
      const url =
        collection === 'artwork'
          ? `${base}/api/artwork?limit=200&depth=1&where[_status][equals]=published&sort=-publishedAt`
          : `${base}/api/products?limit=200&depth=1`
      const res = await fetch(url, { credentials: 'include' })
      const data = await res.json()
      return (data.docs ?? []).map((doc: any) => {
        let imageUrl: string | undefined
        if (collection === 'artwork') {
          imageUrl = typeof doc.image === 'object' && doc.image ? (doc.image.url as string) : undefined
        } else {
          const firstImg = doc.gallery?.[0]?.image
          imageUrl = firstImg && typeof firstImg === 'object' ? (firstImg.url as string) : undefined
        }
        return { id: doc.id as string, title: (doc.title as string) ?? doc.id, imageUrl, collection }
      })
    }

    Promise.all([fetchAll('artwork'), fetchAll('products')]).then(([artworkDocs, productDocs]) => {
      setPreloadedItems([...artworkDocs, ...productDocs])
    })
  }, [serverURL])

  const fetchItems = useCallback(
    async (collection: 'artwork' | 'products') => {
      setLoading(true)
      try {
        const url =
          collection === 'artwork'
            ? `${serverURL}/api/artwork?limit=200&depth=1&where[_status][equals]=published&sort=-publishedAt`
            : `${serverURL}/api/products?limit=200&depth=1`
        const res = await fetch(url, { credentials: 'include' })
        const data = await res.json()
        const docs: DocItem[] = (data.docs ?? []).map((doc: any) => {
          let imageUrl: string | undefined
          if (collection === 'artwork') {
            imageUrl =
              typeof doc.image === 'object' && doc.image ? (doc.image.url as string) : undefined
          } else {
            const firstImg = doc.gallery?.[0]?.image
            imageUrl = firstImg && typeof firstImg === 'object' ? (firstImg.url as string) : undefined
          }
          return { id: doc.id as string, title: (doc.title as string) ?? doc.id, imageUrl, collection }
        })
        setItems(docs)
      } finally {
        setLoading(false)
      }
    },
    [serverURL],
  )

  const openPicker = useCallback(() => {
    const initialPending = new Set(
      selected
        .map((e) => makeKey(e.relationTo, extractId(e.value)))
        .filter((k) => !k.endsWith(':')),
    )
    setPending(initialPending)
    setOpen(true)
    fetchItems(tab)
  }, [selected, tab, fetchItems])

  const handleTabChange = (newTab: 'artwork' | 'products') => {
    setTab(newTab)
    fetchItems(newTab)
  }

  const toggleItem = (item: DocItem) => {
    const key = makeKey(item.collection, item.id)
    setPending((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const applySelection = () => {
    const newValue: SelectedEntry[] = Array.from(pending).map((key) => {
      const colonIdx = key.indexOf(':')
      const rel = key.slice(0, colonIdx) as 'artwork' | 'products'
      const id = key.slice(colonIdx + 1)
      return { relationTo: rel, value: id }
    })
    setValue(newValue)
    setOpen(false)
  }

  const handleDragStart = (i: number) => {
    dragIndex.current = i
    setDraggingIndex(i)
  }

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = e.clientX < rect.left + rect.width / 2 ? i : i + 1
    setInsertAt(pos)
  }

  const handleDrop = () => {
    const from = dragIndex.current
    if (from === null || insertAt === null || insertAt === from || insertAt === from + 1) {
      dragIndex.current = null
      setDraggingIndex(null)
      setInsertAt(null)
      return
    }
    const reordered = [...selected]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(insertAt > from ? insertAt - 1 : insertAt, 0, moved)
    setValue(reordered)
    dragIndex.current = null
    setDraggingIndex(null)
    setInsertAt(null)
  }

  const handleDragEnd = () => {
    dragIndex.current = null
    setDraggingIndex(null)
    setInsertAt(null)
  }

  const removeItem = (entry: SelectedEntry) => {
    const id = extractId(entry.value)
    setValue(
      selected.filter(
        (e) => !(e.relationTo === entry.relationTo && extractId(e.value) === id),
      ),
    )
  }

  const labelText =
    field && 'label' in field
      ? typeof field.label === 'string'
        ? field.label
        : 'Selection'
      : 'Selection'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* Label */}
      <label
        style={{
          display: 'block',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--theme-text)',
          opacity: 0.7,
        }}
      >
        {labelText}
      </label>

      {/* Selected items strip */}
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {selected.map((entry, i) => {
          const { id, title, imageUrl } = getEntryDisplayData(entry, items, preloadedItems)
          const showBar = insertAt === i && insertAt !== draggingIndex && insertAt !== (draggingIndex ?? -1) + 1
          return (
            <React.Fragment key={`${entry.relationTo}:${id}:${i}`}>
              {showBar && (
                <div style={{ width: 2, alignSelf: 'stretch', background: '#1a1a1a', borderRadius: 1, flexShrink: 0 }} />
              )}
              <div
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.25rem 0.375rem 0.25rem 0.25rem',
                  background: 'var(--theme-elevation-100)',
                  borderRadius: '4px',
                  fontSize: '0.8125rem',
                  color: 'var(--theme-text)',
                  cursor: 'grab',
                  opacity: draggingIndex === i ? 0.4 : 1,
                }}
              >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }}
                />
              ) : (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: 'var(--theme-elevation-200)',
                    borderRadius: '2px',
                    flexShrink: 0,
                  }}
                />
              )}
              <span
                style={{
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </span>
              <button
                type="button"
                onClick={() => removeItem(entry)}
                aria-label={`Remove ${title}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--theme-text)',
                  fontSize: '1.125rem',
                  lineHeight: 1,
                  padding: '0 2px',
                  opacity: 0.5,
                  flexShrink: 0,
                }}
              >
                &times;
              </button>
            </div>
          </React.Fragment>
          )
        })}

        {/* Bar when dropping after the last item */}
        {insertAt === selected.length && insertAt !== (draggingIndex ?? -1) + 1 && (
          <div style={{ width: 2, alignSelf: 'stretch', background: '#1a1a1a', borderRadius: 1, flexShrink: 0 }} />
        )}

        <button
          type="button"
          onClick={openPicker}
          style={{
            padding: '0.375rem 0.75rem',
            background: 'var(--theme-elevation-100)',
            border: '1px solid var(--theme-elevation-300)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: 'var(--theme-text)',
          }}
        >
          {selected.length === 0 ? '+ Add Items' : 'Change Items'}
        </button>
      </div>

      {/* Picker panel */}
      {open && (
        <div
          style={{
            border: '1px solid var(--theme-elevation-300)',
            borderRadius: '6px',
            background: 'var(--theme-bg)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 0.75rem',
              borderBottom: '1px solid var(--theme-elevation-200)',
              background: 'var(--theme-elevation-50)',
            }}
          >
            {(['artwork', 'products'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTabChange(t)}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: tab === t ? 600 : 400,
                  background: tab === t ? 'var(--theme-elevation-250)' : 'transparent',
                  color: 'var(--theme-text)',
                  textTransform: 'capitalize',
                }}
              >
                {t}
              </button>
            ))}

            <div style={{ flex: 1 }} />

            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                padding: '0.25rem 0.75rem',
                background: 'none',
                border: '1px solid var(--theme-elevation-300)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: 'var(--theme-text)',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applySelection}
              style={{
                padding: '0.25rem 0.75rem',
                background: '#1a1a1a',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#ffffff',
                fontWeight: 600,
              }}
            >
              Apply ({pending.size})
            </button>
          </div>

          {/* Grid */}
          <div style={{ padding: '0.75rem', maxHeight: '55vh', overflowY: 'auto' }}>
            {loading ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: 'var(--theme-text)',
                  opacity: 0.5,
                  fontSize: '0.875rem',
                }}
              >
                Loading&hellip;
              </div>
            ) : items.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: 'var(--theme-text)',
                  opacity: 0.5,
                  fontSize: '0.875rem',
                }}
              >
                No items found
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '0.625rem',
                }}
              >
                {items.map((item) => {
                  const key = makeKey(item.collection, item.id)
                  const checked = pending.has(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleItem(item)}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        gap: '0.375rem',
                        padding: '0.375rem',
                        background: checked
                          ? 'var(--theme-elevation-150)'
                          : 'var(--theme-elevation-50)',
                        border: checked
                          ? '2px solid #1a1a1a'
                          : '2px solid var(--theme-elevation-200)',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {/* Checkbox indicator */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          width: 16,
                          height: 16,
                          borderRadius: '3px',
                          border: checked
                            ? 'none'
                            : '2px solid var(--theme-elevation-400)',
                          background: checked ? '#1a1a1a' : 'var(--theme-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: '#ffffff',
                          flexShrink: 0,
                          zIndex: 1,
                        }}
                      >
                        {checked ? '✓' : ''}
                      </div>

                      {/* Thumbnail */}
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            objectFit: 'cover',
                            borderRadius: '3px',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            background: 'var(--theme-elevation-200)',
                            borderRadius: '3px',
                          }}
                        />
                      )}

                      {/* Title */}
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: 'var(--theme-text)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '100%',
                          textAlign: 'center',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
