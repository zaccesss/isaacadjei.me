"use client"

import Image from "next/image"
import { Suspense, useState, useCallback, useEffect, useRef } from "react"
import { Canvas, useThree, type RootState } from "@react-three/fiber"
import { OrbitControls, useGLTF, Center } from "@react-three/drei"
import { X, CircuitBoard } from "lucide-react"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import * as THREE from "three"
import styles from "./PCBViewer.module.css"

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
        aria-label="Close"
      >
        <X className="h-7 w-7" />
      </button>
      <div
        className="relative max-h-[90vh] max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-contain max-h-[90vh] w-full rounded-md"
          priority
        />
      </div>
    </div>
  )
}

function PCBModel({ wireframe }: { wireframe: boolean }) {
  const { scene } = useGLTF("/models/pcb-board.glb")
  const invalidate = useThree((state: RootState) => state.invalidate)

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((m) => { ;(m as THREE.MeshStandardMaterial).wireframe = wireframe })
      }
    })
    invalidate()
  }, [scene, wireframe, invalidate])

  return <Center><primitive object={scene} /></Center>
}

type CamPos = [number, number, number]

function CameraView({ pos, trigger }: { pos: CamPos; trigger: number }) {
  const { camera, controls, invalidate } = useThree()
  useEffect(() => {
    if (trigger === 0) return
    camera.position.set(...pos)
    camera.lookAt(0, 0, 0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = controls as any
    if (c?.target) { c.target.set(0, 0, 0); c?.update?.() }
    invalidate()
  }, [trigger, pos, camera, controls, invalidate])
  return null
}

const VIEW_PRESETS: { label: string; pos: CamPos }[] = [
  { label: "front",  pos: [0,   0.5,  6] },
  { label: "back",   pos: [0,   0.5, -6] },
  { label: "top",    pos: [0,   8,    0.01] },
  { label: "bottom", pos: [0,  -8,    0.01] },
  { label: "left",   pos: [-6,  0.5,  0] },
  { label: "right",  pos: [6,   0.5,  0] },
]

function PCB3DCard() {
  const [wireframe,  setWireframe]  = useState(false)
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)")
  const [rotateChoice, setAutoRotate] = useState<boolean | null>(null)
  const autoRotate = rotateChoice ?? !reduce
  const [showGrid,   setShowGrid]   = useState(false)
  const [camView,    setCamView]    = useState<{ pos: CamPos; trigger: number }>({ pos: [0, 8, 0.01], trigger: 0 })

  const goTo = (pos: CamPos) => setCamView(v => ({ pos, trigger: v.trigger + 1 }))

  const frameRef = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)
  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry?.isIntersecting ?? false))
    io.observe(el)
    const onVisibility = () => setTabVisible(!document.hidden)
    onVisibility()
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])
  const frameloop = autoRotate && onScreen && tabVisible ? "always" : "demand"

  const toggleBtn = (active: boolean) =>
    `text-xs font-mono px-2 py-1 rounded border transition-colors ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50"
    }`

  const presetBtn = "text-xs font-mono px-2 py-1 rounded border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-3 space-y-2 select-none">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">3D model</p>
        <span className="text-xs text-muted-foreground">drag · scroll to zoom</span>
      </div>

      <div ref={frameRef} className="relative w-full aspect-video rounded-lg bg-black/20 overflow-hidden cursor-grab active:cursor-grabbing">
        <Canvas frameloop={frameloop} camera={{ position: [0, 8, 0.01], fov: 45 }} gl={{ antialias: true }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[8, 8, 4]}   intensity={1.4} castShadow />
          <directionalLight position={[-4, -4, -4]} intensity={0.3} />
          <pointLight        position={[0, 6, 0]}   intensity={0.6} />
          {showGrid && <gridHelper args={[20, 20, "#444", "#222"]} />}
          <Suspense fallback={null}>
            <PCBModel wireframe={wireframe} />
          </Suspense>
          <OrbitControls makeDefault enablePan={false} minDistance={0.5} maxDistance={30} autoRotate={autoRotate} autoRotateSpeed={0.6} />
          <CameraView pos={camView.pos} trigger={camView.trigger} />
        </Canvas>
      </div>

      <div className="flex gap-1 flex-wrap items-center">
        {VIEW_PRESETS.map(({ label, pos }) => (
          <button key={label} type="button" className={presetBtn} onClick={() => goTo(pos)}>{label}</button>
        ))}
        <button type="button" className={`${presetBtn} ml-auto`} onClick={() => goTo([0, 8, 0.01])}>reset</button>
      </div>

      <div className="flex gap-1 flex-wrap items-center border-t border-border/30 pt-2">
        <button type="button" className={toggleBtn(wireframe)}  onClick={() => setWireframe(v => !v)}>wireframe</button>
        <button type="button" className={toggleBtn(autoRotate)} onClick={() => setAutoRotate(!autoRotate)}>auto-rotate</button>
        <button type="button" className={toggleBtn(showGrid)}   onClick={() => setShowGrid(v => !v)}>grid</button>
      </div>
    </div>
  )
}

interface Preset { label: string; rx: number; ry: number }
interface CardProps {
  title: string; front: string; back: string; frontLabel: string; backLabel: string
  presets: Preset[]; defaultRx?: number; defaultRy?: number
}

function PCBCard({ title, front, back, frontLabel, backLabel, presets, defaultRx = 0, defaultRy = 0 }: CardProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const groupRef    = useRef<HTMLDivElement>(null)
  const sideRef     = useRef<HTMLSpanElement>(null)
  const cur   = useRef({ rx: defaultRx, ry: defaultRy, zoom: 1 })
  const tgt   = useRef({ rx: defaultRx, ry: defaultRy, zoom: 1 })
  const down  = useRef(false)
  const last  = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)

  const commit = useCallback(() => {
    const el = groupRef.current
    if (!el) return
    const { rx, ry, zoom } = cur.current
    el.style.transform = `scale(${zoom.toFixed(3)}) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    if (sideRef.current) {
      const normY = ((ry % 360) + 360) % 360
      sideRef.current.textContent = (normY > 90 && normY < 270) ? backLabel : frontLabel
    }
  }, [frontLabel, backLabel])

  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)")
  const reduceRef = useRef(reduce)
  useEffect(() => { reduceRef.current = reduce }, [reduce])

  const wakeRef = useRef<() => void>(() => {})
  useEffect(() => {
    function step() {
      const c = cur.current
      const t = tgt.current
      const settled = Math.abs(t.rx - c.rx) < 0.05 && Math.abs(t.ry - c.ry) < 0.05 && Math.abs(t.zoom - c.zoom) < 0.001
      if (settled || reduceRef.current) {
        c.rx = t.rx; c.ry = t.ry; c.zoom = t.zoom
        commit()
        rafId.current = 0
        return
      }
      c.rx   += (t.rx   - c.rx)   * 0.1
      c.ry   += (t.ry   - c.ry)   * 0.1
      c.zoom += (t.zoom - c.zoom) * 0.1
      commit()
      rafId.current = requestAnimationFrame(step)
    }
    wakeRef.current = () => {
      if (!rafId.current) rafId.current = requestAnimationFrame(step)
    }
    commit()
    return () => {
      cancelAnimationFrame(rafId.current)
      rafId.current = 0
    }
  }, [commit])
  const wake = useCallback(() => wakeRef.current(), [])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      const step = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 50) * 0.004
      tgt.current.zoom = Math.max(0.5, Math.min(3, tgt.current.zoom - step))
      wake()
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [wake])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    down.current = true; last.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!down.current) return
    const dx = e.clientX - last.current.x; const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    tgt.current.rx = Math.max(-90, Math.min(90, tgt.current.rx - dy * 0.55))
    tgt.current.ry += dx * 0.75
    cur.current.rx = tgt.current.rx; cur.current.ry = tgt.current.ry
    wake()
  }, [wake])

  const onPointerUp = useCallback(() => { down.current = false }, [])

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-3 space-y-2 select-none">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        <span ref={sideRef} className="text-xs text-muted-foreground">{frontLabel}</span>
      </div>
      <div
        ref={viewportRef}
        className={`relative w-full aspect-3/2 cursor-grab active:cursor-grabbing rounded-lg bg-black/15 overflow-hidden ${styles.viewport}`}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
      >
        <div ref={groupRef} className="absolute inset-0 transform-3d">
          <div className="absolute inset-0 backface-hidden">
            <Image src={front} alt={frontLabel} fill className="object-contain p-2 pointer-events-none" sizes="(max-width: 640px) 100vw, 50vw" draggable={false} />
          </div>
          <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)]">
            <Image src={back} alt={backLabel} fill className="object-contain p-2 pointer-events-none" sizes="(max-width: 640px) 100vw, 50vw" draggable={false} />
          </div>
        </div>
      </div>
      <div className="flex gap-1 flex-wrap items-center">
        {presets.map((p) => (
          <button key={p.label} type="button" onClick={() => { tgt.current.rx = p.rx; tgt.current.ry = p.ry; wake() }}
            className="text-xs font-mono px-2 py-1 rounded border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
            {p.label}
          </button>
        ))}
        <button type="button" onClick={() => { tgt.current.zoom = 1; wake() }}
          className="text-xs font-mono px-2 py-1 rounded border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors ml-auto">
          1:1
        </button>
      </div>
    </div>
  )
}

function PCBFlipPhotoCard({ title, front, back, frontLabel, backLabel }: {
  title: string; front: string; back: string; frontLabel: string; backLabel: string
}) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-3 space-y-2 select-none">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        <span className="text-xs text-muted-foreground">{flipped ? backLabel : frontLabel}</span>
      </div>
      <div className="relative w-full aspect-3/2 rounded-lg bg-black/15 overflow-hidden">
        <Image src={flipped ? back : front} alt={flipped ? backLabel : frontLabel} fill className="object-cover transition-opacity duration-200" sizes="(max-width: 640px) 100vw, 50vw" />
      </div>
      <div className="flex gap-1">
        {[{ label: frontLabel, state: false }, { label: backLabel, state: true }].map(({ label, state }) => (
          <button key={label} type="button" onClick={() => setFlipped(state)}
            className={`text-xs font-mono px-2 py-1 rounded border transition-colors ${
              flipped === state
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function PCBPhotoCard({ title, src, alt }: { title: string; src: string; alt: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="rounded-xl border border-border/50 bg-card/30 p-3 space-y-2 select-none">
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        <button
          type="button"
          className="relative w-full aspect-3/2 rounded-lg bg-black/15 overflow-hidden group block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => setOpen(true)}
          aria-label={`View ${title} fullscreen`}
        >
          <Image src={src} alt={alt} fill className="object-cover motion-safe:sm:transition-transform motion-safe:sm:duration-300 motion-safe:sm:group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-end justify-end p-2">
            <span className="text-xs font-mono text-white/0 group-hover:text-white/80 transition-colors">click to expand</span>
          </div>
        </button>
      </div>

      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  )
}

export default function PCBViewer() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-1.5">
        <CircuitBoard className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
        <p className="text-sm font-semibold text-muted-foreground">
          Audio amplifier PCB
        </p>
      </div>

      <PCB3DCard />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PCBCard
          title="Copper layers"
          front="/images/lab/pcb-top.webp"
          back="/images/lab/pcb-bottom-layer.webp"
          frontLabel="top layer"
          backLabel="bottom layer"
          defaultRx={0} defaultRy={0}
          presets={[
            { label: "top layer",    rx: 0,   ry:   0 },
            { label: "bottom layer", rx: 0,   ry: 180 },
            { label: "tilt",         rx: -25, ry:  15 },
          ]}
        />
        <PCBFlipPhotoCard
          title="Real board"
          front="/images/lab/pcb-real-1.webp"
          back="/images/lab/pcb-real-3.webp"
          frontLabel="front"
          backLabel="back"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PCBPhotoCard
          title="Assembled board"
          src="/images/lab/pcb-real-2.webp"
          alt="assembled audio amplifier PCB"
        />
        <PCBPhotoCard
          title="Full schematic"
          src="/images/projects/audio-amplifier/schematic.webp"
          alt="audio amplifier full circuit schematic"
        />
      </div>
    </div>
  )
}
