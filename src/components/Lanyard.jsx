import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'

import cardGLB from '../assets/lanyard/card.glb' // 3D card model (badge body + clip + clamp)
import lanyardPNG from '../assets/lanyard/lanyard.png' // lanyard strap band texture
import UICpng from '../assets/school-logo/UIC.png' // University of the Immaculate Conception school logo

extend({ MeshLineGeometry, MeshLineMaterial })

useGLTF.preload(cardGLB)
useTexture.preload(lanyardPNG)
useTexture.preload(UICpng)

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      style={{ position: 'relative', zIndex: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      aria-label="3D lanyard ID card with University of the Immaculate Conception logo"
    >
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <color attach="background" args={['black']} />
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
  const band = useRef(null)
  const fixed = useRef(null)
  const j1 = useRef(null)
  const j2 = useRef(null)
  const j3 = useRef(null)
  const card = useRef(null)

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  }

  const { nodes, materials } = useGLTF(cardGLB)
  const texture = useTexture(lanyardPNG)

  const canvasRef = useRef(null)
  const texRef = useRef(null)

  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  const { canvas, tex } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 1600

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace

    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    const R = 48

    ctx.save()
    roundRect(ctx, 0, 0, W, H, R)
    ctx.clip()

    const grad = ctx.createLinearGradient(0, 0, W * 0.2, H)
    grad.addColorStop(0, '#111122')
    grad.addColorStop(0.5, '#0e1420')
    grad.addColorStop(1, '#0a0f1a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    const glass = ctx.createRadialGradient(W * 0.35, H * 0.1, 0, W * 0.35, H * 0.1, W)
    glass.addColorStop(0, 'rgba(255,255,255,0.08)')
    glass.addColorStop(0.3, 'rgba(255,255,255,0.03)')
    glass.addColorStop(1, 'transparent')
    ctx.fillStyle = glass
    ctx.fillRect(0, 0, W, H)

    ctx.restore()

    roundRect(ctx, 12, 12, W - 24, H - 24, R - 6)
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    roundRect(ctx, 26, 26, W - 52, H - 52, R - 12)
    ctx.strokeStyle = 'rgba(233,69,96,0.15)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.textAlign = 'center'

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 96px sans-serif'
    ctx.fillText('Ken Andrei Usa', W / 2, 680)

    ctx.fillStyle = '#00d2ff'
    ctx.font = '600 108px sans-serif'
    ctx.fillText('BSIT Student', W / 2, 810)

    ctx.fillStyle = '#e94560'
    ctx.font = '600 84px sans-serif'
    ctx.fillText('University of the', W / 2, 940)
    ctx.fillText('Immaculate Conception', W / 2, 1035)

    ctx.fillStyle = '#b0b0b0'
    ctx.font = '400 68px sans-serif'
    ctx.fillText('Passionate about building', W / 2, 1180)
    ctx.fillText('modern web experiences', W / 2, 1265)

    return { canvas, tex }
  }, [])

  // Assign refs after mount to avoid render-phase side effects
  useEffect(() => {
    canvasRef.current = canvas
    texRef.current = tex
  }, [canvas, tex])

  useEffect(() => {
    if (!canvas) return
    const img = new Image()
    img.onload = () => {
      const ctx = canvas.getContext('2d')
      const W = canvas.width
      const H = canvas.height

      const R = 48

      ctx.save()
      roundRect(ctx, 0, 0, W, H, R)
      ctx.clip()

      const grad = ctx.createLinearGradient(0, 0, W * 0.2, H)
      grad.addColorStop(0, '#111122')
      grad.addColorStop(0.5, '#0e1420')
      grad.addColorStop(1, '#0a0f1a')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      const glass = ctx.createRadialGradient(W * 0.35, H * 0.1, 0, W * 0.35, H * 0.1, W)
      glass.addColorStop(0, 'rgba(255,255,255,0.08)')
      glass.addColorStop(0.3, 'rgba(255,255,255,0.03)')
      glass.addColorStop(1, 'transparent')
      ctx.fillStyle = glass
      ctx.fillRect(0, 0, W, H)

      ctx.restore()

      roundRect(ctx, 12, 12, W - 24, H - 24, R - 6)
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      roundRect(ctx, 26, 26, W - 52, H - 52, R - 12)
      ctx.strokeStyle = 'rgba(233,69,96,0.15)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.textAlign = 'center'

      const logoSize = 500
      ctx.drawImage(img, (W - logoSize) / 2, 50, logoSize, logoSize)

      const divGrad = ctx.createLinearGradient(W * 0.15, 0, W * 0.85, 0)
      divGrad.addColorStop(0, 'transparent')
      divGrad.addColorStop(0.5, 'rgba(233,69,96,0.35)')
      divGrad.addColorStop(1, 'transparent')
      ctx.strokeStyle = divGrad
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(W * 0.15, 575)
      ctx.lineTo(W * 0.85, 575)
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 96px sans-serif'
      ctx.fillText('Ken Andrei Usa', W / 2, 680)

      ctx.fillStyle = '#00d2ff'
      ctx.font = '600 108px sans-serif'
      ctx.fillText('BSIT Student', W / 2, 810)

      ctx.fillStyle = '#e94560'
      ctx.font = '600 84px sans-serif'
      ctx.fillText('University of the', W / 2, 940)
      ctx.fillText('Immaculate Conception', W / 2, 1035)

      ctx.fillStyle = '#b0b0b0'
      ctx.font = '400 68px sans-serif'
      ctx.fillText('Passionate about building', W / 2, 1180)
      ctx.fillText('modern web experiences', W / 2, 1265)

      tex.needsUpdate = true
    }
    img.src = UICpng
  }, [canvas, tex])

  const [curve] = useState(
    () => new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(), new THREE.Vector3(),
        new THREE.Vector3(), new THREE.Vector3(),
      ],
      'chordal'
    )
  )
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => { document.body.style.cursor = 'auto' }
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      })
    }
    if (fixed.current) {
      ;[j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32))
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  const wrappedTexture = useMemo(() => {
    const clone = texture.clone()
    clone.wrapS = THREE.RepeatWrapping
    clone.wrapT = THREE.RepeatWrapping
    return clone
  }, [texture])

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.5}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => { e.target.releasePointerCapture(e.pointerId); drag(false) }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            {/* Card base shape */}
            <mesh geometry={nodes.card.geometry} aria-label="ID card badge body">
              <meshStandardMaterial color="#111111" roughness={0.5} />
            </mesh>
            {/* Photo plane with UIC logo and name */}
            <mesh position={[0, 0.5, 0.01]} aria-label="Ken Andrei Usa ID photo and school logo">
              <planeGeometry args={[0.75, 1.0]} />
              <meshBasicMaterial map={tex} toneMapped={false} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} aria-label="Card metal clip" />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} aria-label="Card metal clamp" />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} aria-label="Lanyard strap band">
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={wrappedTexture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  )
}
