'use client';

import React, { useCallback, useState } from 'react'
import Axios from 'axios'
import { toast } from 'react-toastify'

import api from '../../../../services/api'
import { Container } from '../../../../components'

type DataRefresh = {
  errors: any[]
  videosAdded: any[]
  videosFounded: any[]
}

export default function RefreshClient() {
  const [dataFeed, setDataFeed] = useState<any[]>([])
  const [dataRefresh, setDataRefresh] = useState({} as DataRefresh)
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [description, setDescription] = useState('')

  const wakeFinder = () => {
    const message = 'wakeup: finder'
    toast.promise(api.get('/'), {
      pending: `Request ${message}`,
      success: `Success ${message}`,
      error: `Error ${message}`,
    })
  }

  const wakeAuto = () => {
    const message = 'wakeup: automed browser'
    toast.promise(Axios.get(process.env.NEXT_PUBLIC_API_AUTO + '/'), {
      pending: `Request ${message}`,
      success: `Success ${message}`,
      error: `Error ${message}`,
    })
  }

  const handleGetFeedSubs = () => {
    const message = 'refresh: feed-subs'
    const params = {
      auth_method: 'stored',
      width: 3840,
      height: 2160,
      iteration: 50,
      user: 'marcelovilela',
    }

    toast.promise(
      Axios.get(process.env.NEXT_PUBLIC_API_AUTO + '/feed/subscriptions', {
        params,
      }).then(() => {
        handleGetFeedAsJson()
      }),
      {
        pending: `Request ${message}`,
        success: `Success ${message}`,
        error: `Error ${message}`,
      },
    )
  }

  const handleGetFeedAsJson = useCallback(() => {
    const message = 'refresh: finder-jsonbin-creator'
    toast.promise(
      Axios.get('/api/jsonbin').then(({ data }) => setDataFeed(data)),
      {
        pending: `Request ${message}`,
        success: `Success ${message}`,
        error: `Error ${message}`,
      },
    )
  }, [])

  const handleRefreshFinder = useCallback(() => {
    const message = 'refresh: finder-create'
    toast.promise(
      api
        .post('/video/refresh', { record: dataFeed })
        .then(({ data }) => setDataRefresh(data)),
      {
        pending: `Request ${message}`,
        success: `Success ${message}`,
        error: `Error ${message}`,
      },
    )
  }, [dataFeed])

  const generateScreenshot = () => {
    const message = 'generate: screenshot'
    const params = {
      url: 'https://devfinder.vercel.app',
      y: [80, 900, 1700].join(','),
      user: 'marcelovilela',
    }
    toast.promise(
      Axios.get(process.env.NEXT_PUBLIC_API_AUTO + '/page/screenshot', {
        params,
      }).then(({ data }) => {
        setScreenshots(data)
      }),
      {
        pending: `Request ${message}`,
        success: `Success ${message}`,
        error: `Error ${message}`,
      },
    )
  }

  const handleDownloadScreenshots = () => {
    const download = (url: string, filename: string) => {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const objectUrl = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = objectUrl
          a.download = filename
          document.body.appendChild(a)
          a.click()
          a.remove()
          window.URL.revokeObjectURL(objectUrl)
        })
    }

    if (screenshots.length > 0) {
      toast.success('download screenshots', { autoClose: 2000 })
      screenshots.forEach((url, index) =>
        download(
          url,
          `screenshot-${index}-${url.split('/').pop() ?? 'screenshot'}`,
        ),
      )
    }
  }

  const generateDescription = () => {
    const message = 'generate: description'
    toast.promise(
      api
        .get('/description/feed')
        .then(({ data }) =>
          setDescription(String(data).replace(/<br \/>/g, '\n')),
        ),
      {
        pending: `Request ${message}`,
        success: `Success ${message}`,
        error: `Error ${message}`,
      },
    )
  }

  const handleGenerateContent = () => {
    generateScreenshot()
    generateDescription()
  }

  return (
    <Container loading={false}>
      <main className="flex flex-col gap-4 py-4">
        <section className="flex gap-2 flex-wrap">
          <button
            className="py-2 px-4 cursor-pointer"
            onClick={() => {
              wakeFinder()
              wakeAuto()
            }}
          >
            WAKE
          </button>
          <button className="py-2 px-4 cursor-pointer" onClick={handleGetFeedSubs}>FEED SUBS</button>
          <button className="py-2 px-4 cursor-pointer" onClick={handleGetFeedAsJson}>
            FEED AS JSON
          </button>
          <button className="py-2 px-4 cursor-pointer" onClick={handleRefreshFinder}>REFRESH</button>
          <button className="py-2 px-4 cursor-pointer" onClick={handleGenerateContent}>CONTENT</button>
          <button className="py-2 px-4 cursor-pointer" onClick={handleDownloadScreenshots}>
            DOWN
          </button>
        </section>

        <div>
          {screenshots.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {screenshots.map((source) => (
                <div key={source} className="flex-none max-w-[320px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- host dinâmico via NEXT_PUBLIC_API_AUTO, não dá para whitelisting em next.config.js */}
                  <img className="w-full block" src={source} alt="screenshot" />
                  <p className="text-xs break-all">{source}</p>
                </div>
              ))}
            </div>
          )}

          {description && (
            <div>
              <textarea
                className="w-full min-h-[200px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-[gray] mt-1">/v1/description/feed</p>
            </div>
          )}
        </div>

        {(dataRefresh.errors ||
          dataRefresh.videosAdded ||
          dataRefresh.videosFounded) && (
          <div>
            <pre className="overflow-auto max-h-[400px]" style={{ textAlign: 'left' }}>
              {JSON.stringify(dataRefresh, null, 2)}
            </pre>
            <p className="text-xs text-[gray] mt-1">/v1/video/refresh</p>
          </div>
        )}

        {dataFeed.length > 0 && (
          <div>
            <pre className="overflow-auto max-h-[400px]" style={{ textAlign: 'left' }}>
              {JSON.stringify(dataFeed, null, 2)}
            </pre>
            <p className="text-xs text-[gray] mt-1">
              {'https://api.jsonbin.io/v3/b/' +
                process.env.NEXT_PUBLIC_JSONBIN_ID_CHANNEL}
            </p>
          </div>
        )}
      </main>
    </Container>
  )
}
