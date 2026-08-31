'use client';

import React, { useCallback, useState } from 'react'
import Axios from 'axios'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import api from '../../../services/api'
import { Container } from '../../../components'

type DataRefresh = {
  errors: any[]
  videosAdded: any[]
  videosFounded: any[]
}

const Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
`

const ButtonRow = styled.section`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  padding: 8px 16px;
  cursor: pointer;
`

const ScreenshotRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
`

const ScreenshotItem = styled.div`
  flex: 0 0 auto;
  max-width: 320px;

  img {
    width: 100%;
    display: block;
  }
  p {
    font-size: 12px;
    word-break: break-all;
  }
`

const PreContainer = styled.div`
  pre {
    overflow: auto;
    max-height: 400px;
  }
  textarea {
    width: 100%;
    min-height: 200px;
  }
  p {
    font-size: 12px;
    color: gray;
    margin-top: 4px;
  }
`

export default function Refresh() {
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
      <Page>
        <ButtonRow>
          <ActionButton
            onClick={() => {
              wakeFinder()
              wakeAuto()
            }}
          >
            WAKE
          </ActionButton>
          <ActionButton onClick={handleGetFeedSubs}>FEED SUBS</ActionButton>
          <ActionButton onClick={handleGetFeedAsJson}>
            FEED AS JSON
          </ActionButton>
          <ActionButton onClick={handleRefreshFinder}>REFRESH</ActionButton>
          <ActionButton onClick={handleGenerateContent}>CONTENT</ActionButton>
          <ActionButton onClick={handleDownloadScreenshots}>
            DOWN
          </ActionButton>
        </ButtonRow>

        <div>
          {screenshots.length > 0 && (
            <ScreenshotRow>
              {screenshots.map((source) => (
                <ScreenshotItem key={source}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- host dinâmico via NEXT_PUBLIC_API_AUTO, não dá para whitelisting em next.config.js */}
                  <img src={source} alt="screenshot" />
                  <p>{source}</p>
                </ScreenshotItem>
              ))}
            </ScreenshotRow>
          )}

          {description && (
            <PreContainer>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p>/v1/description/feed</p>
            </PreContainer>
          )}
        </div>

        {(dataRefresh.errors ||
          dataRefresh.videosAdded ||
          dataRefresh.videosFounded) && (
          <PreContainer>
            <pre style={{ textAlign: 'left' }}>
              {JSON.stringify(dataRefresh, null, 2)}
            </pre>
            <p>/v1/video/refresh</p>
          </PreContainer>
        )}

        {dataFeed.length > 0 && (
          <PreContainer>
            <pre style={{ textAlign: 'left' }}>
              {JSON.stringify(dataFeed, null, 2)}
            </pre>
            <p>
              {'https://api.jsonbin.io/v3/b/' +
                process.env.NEXT_PUBLIC_JSONBIN_ID_CHANNEL}
            </p>
          </PreContainer>
        )}
      </Page>
    </Container>
  )
}
