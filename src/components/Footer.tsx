'use client'
import { PortfolioMeta } from '@/lib/types'
import { use } from 'react'

interface Props {
  meta: PortfolioMeta
}

export default function Footer({ meta }: Props) {
  const { social } = meta

  return (
    <footer className="px-6 max-w-5xl mx-auto pb-12">
      <div className="gold-line mb-8" />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

        <div>
          <p className="font-display text-white font-bold text-lg">The 20K Promise</p>
          <p className="text-[#9A9088] text-sm mt-1">Transparency in every peso.</p>

          {/* Social links */}
          {social && (
            <div className="flex items-center gap-4 mt-3">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs transition-colors"
                  style={{ color: 'rgba(201,168,76,0.7)' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseOut={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.7)')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  Facebook
                </a>
              )}
              {social.threads && (
                <a href={social.threads} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs transition-colors"
                  style={{ color: 'rgba(201,168,76,0.7)' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseOut={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.7)')}>
                  <svg width="14" height="14" viewBox="0 0 192 192" fill="currentColor">
                    <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.195 47.292 9.643 32.788 28.08 19.882 44.485 13.224 67.315 13.001 96c.223 28.685 6.882 51.515 19.788 67.92 14.504 18.436 36.094 27.884 64.119 28.08h.112c24.96-.173 42.554-6.708 57.048-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.945-24.673-24.553zM98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.113 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.802 29.274z"/>
                  </svg>
                  Threads
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs transition-colors"
                  style={{ color: 'rgba(201,168,76,0.7)' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#C9A84C')}
                  onMouseOut={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.7)')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          )}
        </div>

        <div className="text-right">
          <p className="text-[#9A9088] text-xs leading-relaxed max-w-sm">
            This is not financial advice. This is one person's public commitment to build wealth — documented honestly, wins and losses included.
          </p>
        </div>

      </div>
    </footer>
  )
}
