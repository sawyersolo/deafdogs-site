import React, { useEffect, useState } from 'react'
import { useTheme } from '../theme/ThemeContext'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const navigate = useNavigate()
  const { theme } = useTheme()

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const parallaxY = scrollY * -0.08
  const chromaShift = scrollY * 0.04

  return (
    <>
      <section className="hero">
        <div>
          <div
            style={{
              transform: `translateY(${parallaxY}px)`,
              transition: 'transform 0.1s linear',
            }}
          >
            <div className="hero-main-title">deaf dogs</div>
            <p className="hero-tagline">
              A rock band from Vancouver, BC, building songs out of interlocking guitars,
              heavy melodies and slow-burning tension. Music for late buses, wet streets
              and the moment you realise you&apos;re not going back.
            </p>
            <div className="hero-cta-row">
              <button className="btn-bright" onClick={() => navigate('/music')}>
                {theme === 'colossus' ? '▶ Listen to Colossus' : '▶ Listen to Stringbreaker'}
              </button>
              <button className="btn-soft" onClick={() => navigate('/tour')}>
                Live shows &amp; sessions
              </button>
            </div>
            <div className="hero-meta">
              <div>
                <div>Latest releases</div>
                <div>Colossus · Stringbreaker · Live from the Pound</div>
              </div>
              <div>
                <div>City</div>
                <div>Vancouver, BC · guitar-heavy alt rock</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="hero-orbit">
            <div
              className="hero-orbit-img"
              style={{
                transform: `translateY(${parallaxY * -0.4}px) scale(1.03)`,
              }}
            />
            <div
              className="hero-orbit-chroma"
              style={{
                transform: `translate(${chromaShift}px, ${chromaShift * -0.6}px)`,
              }}
            />
            <div className="hero-orbit-inner">
              <div className="hero-orbit-label">Now playing</div>
              <div className="hero-orbit-track">{theme === "colossus" ? "Colossus" : "Stringbreaker"}</div>
              <div className="hero-orbit-meta">
                {theme === "colossus"
                  ? "The title track from their 2025 single — massive riffs, towering walls of sound, and a darker evolution of the Deaf Dogs sonic palette."
                  : "The title track from their 2024 single, leaning into big chorus hooks and widescreen guitar drama."}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="home-bottom-grid">
          <div className="surface">
            <div className="section-heading">Live from the Pound</div>
            <p className="section-sub">
              A live EP that sounds like the floor is sticky, the room is too small,
              and every part of the crowd is singing the last chorus louder than the band.
            </p>
            <button className="btn-soft" onClick={() => navigate('/music')}>
              Explore releases
            </button>
          </div>
          <div className="surface">
            <div className="section-heading">Sessions &amp; shows</div>
            <p className="section-sub">
              From studio sessions to club stages around Vancouver, Deaf Dogs keep the
              guitars tangled and the vocals right on the edge.
            </p>
            <button className="btn-soft" onClick={() => navigate('/tour')}>
              View tour map
            </button>
          </div>
          <div className="surface">
            <div className="section-heading">Merch as artifact</div>
            <p className="section-sub">
              Hoodies, shirts and prints built around the Stringbreaker visual world.
              Limited runs, meant to feel like you grabbed them off the stage.
            </p>
            <button className="btn-soft" onClick={() => navigate('/merch')}>
              Open merch store
            </button>
          </div>
        </div>
      </section>
    </>
  )
}