import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router"
import {
  AlarmClock,
  Battery,
  Bell,
  Camera,
  Check,
  ChevronLeft,
  Cloud,
  Home,
  Info,
  LockKeyhole,
  LockKeyholeOpen,
  Maximize,
  Menu,
  Mic,
  Package,
  PhoneOutgoing,
  Play,
  RotateCw,
  Settings,
  Share2,
  ShoppingCart,
  Signal,
  Siren,
  Smartphone,
  Truck,
  Pause,
  UserPlus,
  Video,
  Volume2,
  VolumeX,
  Wifi,
  X,
  PersonStanding,
  ExternalLink,
} from "lucide-react"

import {
  PROTOTYPE_CONFIG,
  resolveVideoUrl,
  isDriveVideoUrl,
} from "./prototypeConfig"

const CONFIG = {
  battery: 50,
  wifi: 54,
  notifications: {
    unlock: "GO NONOK box unlocked!",
    alarmOn: "Your GO NOKNOK Alarm is ON.",
    alarmOff: "Your GO NOKNOK Alarm is OFF.",
    humanOn: "Human Detection is ON",
    humanOff: "Human detection OFF",
    snapshot: "Snapshot saved in media.",
    recording: "Recording saved to media.",
    schedule: "GO NOKNOK has set for Auto-Unlock.",
    share: "Device Shared.",
  },
  destinations: {
    Cloud: "/media",
    "AI Track": "/tracking",
    Send: "/send",
    Media: "/media?source=device",
    "Schedule Unlock": "/schedule",
    "Share Device": "/share",
  },
}
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
type Asset = {
  id: number
  kind: "snapshot" | "recording"
  url: string
  time: string
  simulated?: boolean
}
type Parcel = {
  name: string
  carrier: string
  status: string
  date: string
  tracking: string
  timeline?: string
}
const parcels: Parcel[] = [
  {
    name: "Amazon",
    carrier: "evri",
    status: "Order Confirmed",
    date: "Wed 23 Sep 17:47",
    tracking: "T00WLA4733242505",
  },
  {
    name: "Amazon.co.uk",
    carrier: "amazon",
    status: "Delivered",
    date: "Tue 22 Sep 15:47",
    tracking: "TNI3NHcHy",
    timeline: "amazon",
  },
  {
    name: "Amazon.co.uk",
    carrier: "amazon",
    status: "Delivered",
    date: "Tue 22 Sep 11:34",
    tracking: "T1gVYcc1y",
    timeline: "amazon",
  },
  {
    name: "Amazon.co.uk",
    carrier: "amazon",
    status: "Delivered",
    date: "Fri 18 Sep 15:06",
    tracking: "TV3WLfs0y",
    timeline: "amazon",
  },
  {
    name: "PROFORMA PEPTIDES UK",
    carrier: "royal-mail",
    status: "Delivered",
    date: "Tue 15 Sep 11:40",
    tracking: "DO788364347GB",
    timeline: "royal",
  },
  {
    name: "Amazon.co.uk",
    carrier: "amazon",
    status: "Delivered",
    date: "Sat 12 Sep 14:10",
    tracking: "TG2TPzN5w",
    timeline: "amazon",
  },
]
const returns: Parcel[] = [
  {
    name: "Amazon.co.uk",
    carrier: "royal-mail",
    status: "Refund Processed",
    date: "Wed 26 Aug 16:04",
    tracking: "TV1R9DMR9",
  },
  ...["YR700716554GB", "YR700717736GB", "YR700717121GB", "YR69974327GB"].map(
    (tracking, index) => ({
      name: "",
      carrier: "royal-mail",
      status: "Collection Successful",
      date: index === 3 ? "Mon 27 Jul 11:30" : "Wed 26 Aug 10:52",
      tracking,
    }),
  ),
  {
    name: "Amazon",
    carrier: "amazon",
    status: "Refund Processed",
    date: "Mon 27 Jul 11:30",
    tracking: "TV1R9DMR9",
  },
]

function StatusBar({
  time = "11.45",
  dark = false,
}: {
  time?: string
  dark?: boolean
}) {
  return (
    <div
      className={`flex h-[calc(clamp(28px,5cqh,48px)+env(safe-area-inset-top))] shrink-0 items-center justify-between px-6 pt-[env(safe-area-inset-top)] text-[clamp(14px,2.5cqh,18px)] font-light ${
        dark ? "text-black" : "text-white"
      }`}
    >
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={18} fill="currentColor" />
        <Wifi size={20} />
        <Battery size={23} />
      </div>
    </div>
  )
}
function Header({
  title,
  back,
  right,
  simple = false,
}: {
  title: string
  back: () => void
  right?: ReactNode
  simple?: boolean
}) {
  return (
    <header className="shrink-0 bg-primary text-white">
      <StatusBar
        time={title.includes("Parcel") ? "10:06" : "09.05"}
        dark={title.includes("Tracking") || title === "Parcel Timeline"}
      />
      <div
        className={`flex items-center justify-between px-4 ${
          simple ? "h-[48px]" : "h-[clamp(48px,8cqh,72px)]"
        }`}
      >
        <button
          aria-label="Back"
          onClick={back}
          className={simple ? "p-2" : "rounded-lg bg-white p-2.5 text-primary"}
        >
          <ChevronLeft size={27} />
        </button>
        <h1
          className={`${
            simple
              ? "text-[clamp(18px,5cqw,22px)]"
              : "text-[clamp(20px,6cqw,27px)]"
          } min-w-0 whitespace-nowrap font-semibold`}
        >
          {title}
        </h1>
        <div className="flex w-11 justify-end">{right}</div>
      </div>
    </header>
  )
}
function Carrier({ name }: { name: string }) {
  if (name === "amazon")
    return (
      <span className="relative inline-block font-serif text-[45px] font-bold leading-none text-black">
        a
        <span className="absolute -bottom-0.5 left-0 h-2.5 w-8 rounded-b-[100%] border-b-[3px] border-orange-400" />
      </span>
    )
  return (
    <img
      src={`/assets/${name}.png`}
      alt={name}
      className="h-9 w-14 object-contain"
    />
  )
}
function Action({
  label,
  icon: Icon,
  onClick,
  active = false,
  color,
  badge = false,
  small = false,
}: {
  label: string
  icon: typeof Camera
  onClick: () => void
  active?: boolean
  color?: string
  badge?: boolean
  small?: boolean
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex min-h-0 min-w-0 flex-col items-center justify-center gap-[clamp(4px,1cqh,8px)] px-0.5 transition-colors hover:bg-secondary/60 active:bg-secondary ${
        small
          ? "text-[clamp(10px,2.8cqw,13px)]"
          : "text-[clamp(11px,3.6cqw,15px)]"
      }`}
    >
      <span
        className={`relative ${color || (active ? "text-green-600" : "text-primary")}`}
      >
        <Icon
          size={small ? 28 : 34}
          className={
            small
              ? "h-[clamp(22px,3.5cqh,28px)] w-[clamp(22px,3.5cqh,28px)]"
              : "h-[clamp(24px,4.5cqh,34px)] w-[clamp(24px,4.5cqh,34px)]"
          }
          strokeWidth={2.5}
        />
        {badge && (
          <span className="absolute -right-3 -top-1 h-3 w-3 rounded-full bg-red-500" />
        )}
      </span>
      <span
        className={`max-w-full whitespace-nowrap ${
          label === "Schedule Unlock" ? "text-[clamp(8px,2.2cqw,10px)]" : ""
        } ${color === "text-red-500" ? "text-red-500" : "text-foreground"}`}
      >
        {label}
      </span>
    </button>
  )
}

type SharedUser = {
  id: string
  name: string
  email: string
  avatar: number
  active: boolean
}
type NotificationMessage = {
  text: string
  id: number
}

function SharedUserCard({
  user,
  toggle,
}: {
  user: SharedUser
  toggle: () => void
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-[18px] bg-secondary p-[clamp(12px,2.2cqh,20px)]">
      <img
        src={`/assets/avatar-${user.avatar}.png`}
        alt={`${user.name}'s avatar`}
        className="h-[clamp(44px,7cqh,60px)] w-[clamp(44px,7cqh,60px)] shrink-0 rounded-full border-2 border-white object-cover"
      />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-[clamp(21px,3.5cqh,31px)] font-semibold text-black">
          {user.name}
        </h2>
        {user.email && (
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        )}
      </div>
      <button
        aria-label={`${user.active ? "Remove" : "Restore"} ${user.name} access`}
        aria-pressed={user.active}
        onClick={toggle}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white"
      >
        {user.active ? (
          <Check size={31} className="text-emerald-500" strokeWidth={3} />
        ) : (
          <X size={28} className="text-gray-400" />
        )}
      </button>
    </div>
  )
}

function Prototype() {
  const navigate = useNavigate()
  const location = useLocation()
  const page = location.pathname
  const [notice, setNotice] = useState<NotificationMessage | null>(null)
  const [dialog, setDialog] = useState<string | null>(null)
  const [alarm, setAlarm] = useState(false)
  const [human, setHuman] = useState(false)
  const [speaker, setSpeaker] = useState(false)
  const [talk, setTalk] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [recording, setRecording] = useState(false)
  const [flash, setFlash] = useState(false)
  const [wide, setWide] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [rotationHint, setRotationHint] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [playBlocked, setPlayBlocked] = useState(false)
  const [paused, setPaused] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [mediaTab, setMediaTab] = useState("cloud")
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [trackingTab, setTrackingTab] = useState("All")
  const [email, setEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(0)
  const [shared, setShared] = useState(false)
  const [users, setUsers] = useState<SharedUser[]>(() =>
    ["David", "Jamie", "Claire", "Sam"].map((name, avatar) => ({
      id: name,
      name,
      email: "",
      avatar,
      active: true,
    })),
  )
  const videoRef = useRef<HTMLVideoElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const positions = useRef<Record<string, number>>({})
  const objectUrls = useRef<string[]>([])
  const homeVideoUrl = resolveVideoUrl(PROTOTYPE_CONFIG.video.homeVideoUrl)
  const landscapeVideoUrl =
    resolveVideoUrl(PROTOTYPE_CONFIG.video.landscapeVideoUrl) || homeVideoUrl
  const videoUrl = wide && isLandscape ? landscapeVideoUrl : homeVideoUrl
  const driveVideo = isDriveVideoUrl(videoUrl)
  const scheduled = PROTOTYPE_CONFIG.schedule
  const time = `${String(scheduled.hour).padStart(2, "0")}:${String(scheduled.minute).padStart(2, "0")}`
  const preview =
    scheduled.repeat === "NEVER"
      ? `Unlock once at ${time}`
      : scheduled.repeat === "DAILY"
        ? `Unlock every day at ${time}`
        : scheduled.repeat === "WEEKDAYS"
          ? `Unlock every weekday at ${time}`
          : scheduled.repeat === "WEEKENDS"
            ? `Unlock every Sat, Sun at ${time}`
            : `Unlock every ${scheduled.days
                .slice()
                .sort()
                .map((index) => days[index])
                .join(", ")} at ${time}`
  const notify = (text: string) => setNotice({ text, id: Date.now() })
  const go = (destination: string) => {
    if (recording) stopRecording()
    setDialog(null)
    setWide(false)
    navigate(destination)
  }
  const back = () =>
    go(
      page === "/share/add"
        ? "/share"
        : page.startsWith("/timeline")
          ? "/tracking"
          : "/",
    )

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 4000)
    return () => clearTimeout(timer)
  }, [notice])
  useEffect(() => {
    setDialog(null)
    setSelectedMedia(null)
    if (page === "/media")
      setMediaTab(location.search.includes("device") ? "device" : "cloud")
  }, [page, location.search])
  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    let previousLandscape: boolean | null = null
    const update = () => {
      const { width, height } = viewport.getBoundingClientRect()
      const landscape = width > height
      setIsLandscape(landscape)
      if (previousLandscape !== null && landscape !== previousLandscape) {
        setWide(landscape && page === "/")
        setRotationHint(false)
      } else if (
        previousLandscape === null &&
        landscape &&
        height <= 600 &&
        page === "/"
      ) {
        setWide(true)
      }
      previousLandscape = landscape
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [page])
  useEffect(() => {
    setVideoReady(false)
    setVideoFailed(false)
    setPlayBlocked(false)
    setPaused(false)
  }, [videoUrl])
  useEffect(() => {
    if (!rotationHint) return
    const timer = setTimeout(() => setRotationHint(false), 2000)
    return () => clearTimeout(timer)
  }, [rotationHint])
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDialog(null)
        setSelectedMedia(null)
        setWide(false)
      }
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [])
  useEffect(
    () => () => {
      if (unlockTimer.current) clearTimeout(unlockTimer.current)
      if (recorderRef.current?.state === "recording") recorderRef.current.stop()
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url))
    },
    [],
  )
  useEffect(() => {
    if (!scheduled.enabled) return
    let lastRun = ""
    const timer = setInterval(() => {
      const now = new Date()
      const dateKey = now.toDateString()
      const matchesDay =
        scheduled.repeat === "DAILY" ||
        scheduled.repeat === "NEVER" ||
        (scheduled.repeat === "WEEKDAYS"
          ? now.getDay() > 0 && now.getDay() < 6
          : scheduled.repeat === "WEEKENDS"
            ? [0, 6].includes(now.getDay())
            : scheduled.days.includes(now.getDay()))
      if (
        matchesDay &&
        now.getHours() === scheduled.hour &&
        now.getMinutes() === scheduled.minute &&
        dateKey !== lastRun
      ) {
        lastRun = dateKey
        unlock("Device auto-unlocked for delivery")
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [scheduled])

  function unlock(message = CONFIG.notifications.unlock) {
    setUnlocked(true)
    notify(message)
    if (unlockTimer.current) clearTimeout(unlockTimer.current)
    unlockTimer.current = setTimeout(() => setUnlocked(false), 5000)
  }
  async function startVideo() {
    const video = videoRef.current
    if (!video || !videoUrl) return
    try {
      await video.play()
      setPlayBlocked(false)
      setPaused(false)
    } catch {
      setPlayBlocked(true)
    }
  }
  async function capturePoster() {
    const image = new Image()
    image.src = PROTOTYPE_CONFIG.video.posterUrl
    await image.decode()
    const canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height
    canvas.getContext("2d")?.drawImage(image, 0, 0)
    return canvas.toDataURL("image/png")
  }
  async function snapshot() {
    setFlash(true)
    setTimeout(() => setFlash(false), 180)
    let url = ""
    let simulated = false
    try {
      const current = videoRef.current
      if (!current || current.readyState < 2)
        throw new Error("No decoded frame")
      const canvas = document.createElement("canvas")
      canvas.width = current.videoWidth
      canvas.height = current.videoHeight
      canvas.getContext("2d")?.drawImage(current, 0, 0)
      url = canvas.toDataURL("image/png")
    } catch {
      simulated = true
      try {
        url = await capturePoster()
      } catch {
        url = PROTOTYPE_CONFIG.video.posterUrl
      }
    }
    setAssets((previous) => [
      {
        id: Date.now(),
        kind: "snapshot",
        url,
        time: new Date().toLocaleTimeString(),
        simulated,
      },
      ...previous,
    ])
    notify(CONFIG.notifications.snapshot)
  }
  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive")
      recorderRef.current.stop()
    else
      setAssets((previous) => [
        {
          id: Date.now(),
          kind: "recording",
          url: videoUrl || PROTOTYPE_CONFIG.video.posterUrl,
          time: new Date().toLocaleTimeString(),
          simulated: true,
        },
        ...previous,
      ])
    setRecording(false)
    notify(CONFIG.notifications.recording)
  }
  function record() {
    if (recording) {
      stopRecording()
      return
    }
    setRecording(true)
    const video = videoRef.current as HTMLVideoElement & {
      captureStream?: () => MediaStream
    } | null
    if (
      video?.captureStream &&
      typeof MediaRecorder !== "undefined" &&
      video.readyState >= 2
    ) {
      try {
        const recorder = new MediaRecorder(video.captureStream())
        const chunks: Blob[] = []
        recorder.ondataavailable = (event) => {
          if (event.data.size) chunks.push(event.data)
        }
        recorder.onstop = () => {
          const url = URL.createObjectURL(
            new Blob(chunks, { type: recorder.mimeType }),
          )
          objectUrls.current.push(url)
          setAssets((previous) => [
            {
              id: Date.now(),
              kind: "recording",
              url,
              time: new Date().toLocaleTimeString(),
            },
            ...previous,
          ])
        }
        recorder.start()
        recorderRef.current = recorder
      } catch {
        recorderRef.current = null
      }
    } else recorderRef.current = null
  }
  function action(name: string) {
    const destination =
      CONFIG.destinations[(name as keyof typeof CONFIG.destinations)]
    if (destination) {
      go(destination)
      return
    }
    switch (name) {
      case "Unlock":
        unlock()
        break
      case "Snapshot":
        void snapshot()
        break
      case "Alarm":
        setAlarm(!alarm)
        notify(
          alarm ? CONFIG.notifications.alarmOff : CONFIG.notifications.alarmOn,
        )
        break
      case "Human Alert":
        setHuman(!human)
        notify(
          human ? CONFIG.notifications.humanOff : CONFIG.notifications.humanOn,
        )
        break
      case "Talk":
        setTalk(!talk)
        notify(talk ? "Talk is OFF" : "Talk is ON — prototype audio mode")
        break
      case "Record":
        record()
        break
      case "Emergency":
        setDialog("Emergency")
        break
      case "Alerts":
        setDialog("Alerts")
        break
    }
  }
  function invite() {
    const name = userName.trim()
    const address = email.trim().toLowerCase()
    if (!name) {
      notify("Please enter the user's name.")
      return
    }
    setUsers((previous) => {
      const existing = previous.find((user) => user.email === address)
      return existing
        ? previous.map((user) =>
            user.id === existing.id
              ? { ...user, name, avatar: selectedAvatar, active: true }
              : user,
          )
        : [
            ...previous,
            {
              id: `invite-${Date.now()}`,
              name,
              email: address,
              avatar: selectedAvatar,
              active: true,
            },
          ]
    })
    setShared(true)
    notify(CONFIG.notifications.share)
  }

  return (
    <div
      ref={viewportRef}
      className="fixed inset-0 h-full w-full overflow-hidden bg-background text-foreground [container-type:size]"
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
        {notice && (
          <div
            key={notice.id}
            role="status"
            className="animate-notification absolute inset-x-3 top-[max(8px,env(safe-area-inset-top))] z-[100] flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-[14px] shadow-xl"
          >
            <Package className="shrink-0 text-primary" size={23} />
            <span className="min-w-0 flex-1">{notice.text}</span>
            <button
              aria-label="Dismiss notification"
              onClick={() => setNotice(null)}
              className="shrink-0"
            >
              <X size={19} />
            </button>
          </div>
        )}
        {page === "/" && (
          <div
            data-testid="home-screen"
            className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)_minmax(132px,22%)_minmax(58px,9%)] overflow-hidden"
          >
            <header className="bg-primary text-white">
              <StatusBar />
              <div className="flex h-[clamp(44px,7cqh,64px)] items-center justify-between gap-2 px-3">
                <button
                  aria-label="Home"
                  onClick={() => {
                    setDialog(null)
                    setWide(false)
                  }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/15"
                >
                  <Home size={27} strokeWidth={2.4} />
                </button>
                <h1 className="min-w-0 whitespace-nowrap text-center text-[clamp(18px,5.4cqw,27px)] font-bold">
                  Smart Parcel Box
                </h1>
                <button
                  aria-label="Settings"
                  onClick={() => setDialog("Settings")}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary"
                >
                  <Settings size={25} />
                </button>
              </div>
            </header>
            <div
              data-testid="camera-container"
              className={
                wide
                  ? "fixed inset-0 z-50 grid h-full grid-rows-[48px_minmax(0,1fr)_48px] overflow-hidden bg-black pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] text-white"
                  : "relative grid min-h-0 grid-rows-[minmax(52px,1fr)_minmax(0,2.25fr)_minmax(40px,1fr)] overflow-hidden bg-black text-white"
              }
            >
              <div
                className={`flex min-h-0 items-start justify-between px-4 ${
                  wide ? "pt-2" : "pt-[clamp(8px,2cqh,24px)]"
                }`}
              >
                <button
                  aria-label={wide ? "Exit landscape" : "Landscape video"}
                  className="flex h-9 w-9 items-center justify-center"
                  onClick={() => {
                    if (wide) {
                      setWide(false)
                      return
                    }
                    setRotationHint(true)
                    if (isLandscape) setWide(true)
                  }}
                >
                  <Maximize size={22} />
                </button>
                <div
                  className={
                    wide
                      ? "flex items-center gap-5"
                      : "flex flex-col items-end gap-[clamp(8px,2cqh,24px)]"
                  }
                >
                  <button
                    aria-label="Wi-Fi information"
                    onClick={() => setDialog("Wi-Fi")}
                    className="flex items-center gap-2 whitespace-nowrap text-[clamp(12px,3.7cqw,16px)]"
                  >
                    <Wifi size={25} className="text-green-500" />
                    Great - {CONFIG.wifi}%
                  </button>
                  <button
                    aria-label="Battery information"
                    onClick={() => setDialog("Battery")}
                    className="flex items-center gap-2 whitespace-nowrap text-[clamp(12px,3.7cqw,16px)]"
                  >
                    <Battery size={25} className="text-green-500" />
                    Battery {CONFIG.battery}%
                  </button>
                </div>
              </div>
              <div
                data-testid="video-frame"
                className="relative min-h-0 w-full overflow-hidden bg-black"
              >
                <video
                  ref={videoRef}
                  src={!driveVideo && videoUrl ? videoUrl : undefined}
                  poster={PROTOTYPE_CONFIG.video.posterUrl}
                  preload="auto"
                  autoPlay
                  loop
                  playsInline
                  muted={!speaker}
                  disablePictureInPicture
                  onLoadedMetadata={(event) => {
                    const video = event.currentTarget
                    const previous = positions.current[videoUrl] || 0
                    if (previous > 0 && previous < video.duration)
                      video.currentTime = previous
                  }}
                  onCanPlay={() => {
                    setVideoReady(true)
                    if (!paused) void startVideo()
                  }}
                  onPlaying={() => {
                    setVideoReady(true)
                    setPlayBlocked(false)
                    setPaused(false)
                  }}
                  onTimeUpdate={(event) => {
                    positions.current[videoUrl] =
                      event.currentTarget.currentTime
                  }}
                  onError={() => {
                    if (videoUrl) {
                      setVideoFailed(true)
                      setVideoReady(false)
                    }
                  }}
                  className={`absolute inset-0 h-full w-full object-contain ${
                    videoReady && !videoFailed ? "opacity-100" : "opacity-0"
                  }`}
                />
                {driveVideo && (
                  <iframe
                    title="Camera video — Google Drive"
                    src={videoUrl}
                    allow="autoplay; fullscreen; encrypted-media"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                )}
                {!driveVideo && (!videoReady || videoFailed) && (
                  <img
                    src={PROTOTYPE_CONFIG.video.posterUrl}
                    alt="Delivery camera preview"
                    className={`absolute inset-0 h-full w-full ${
                      wide ? "object-contain" : "object-cover"
                    }`}
                  />
                )}
                {(videoReady || recording) && (
                  <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded bg-black/60 px-1.5 py-0.5 text-xs font-bold text-white">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        recording ? "animate-pulse bg-red-500" : "bg-green-500"
                      }`}
                    />
                    {recording ? "Recording" : "LIVE"}
                  </div>
                )}
                {flash && (
                  <div className="pointer-events-none absolute inset-0 bg-white" />
                )}
                {playBlocked && !videoFailed && (
                  <button
                    onClick={() => void startVideo()}
                    className="absolute inset-0 flex items-center justify-center gap-2 bg-black/25 text-white"
                  >
                    <Play size={30} fill="currentColor" />
                    Play camera
                  </button>
                )}
                {videoFailed && (
                  <div className="absolute bottom-2 left-2 right-2 rounded bg-black/75 px-3 py-2 text-center text-xs text-white">
                    Video unavailable. Check the owner-configured URL.
                  </div>
                )}
              </div>
              <div className="flex min-h-0 items-center justify-between gap-2 px-3">
                <button
                  className="flex min-w-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[clamp(12px,3.5cqw,15px)] font-bold text-black"
                  onClick={() => setDialog("Device")}
                >
                  <Package size={20} className="shrink-0 text-primary" />
                  <span className="truncate">9C6WXFJ6+JWC</span>
                </button>
                <div className="flex items-center gap-3">
                  {videoUrl && !driveVideo && !videoFailed && (
                    <button
                      aria-label={paused ? "Play video" : "Pause video"}
                      onClick={() => {
                        if (paused) void startVideo()
                        else {
                          videoRef.current?.pause()
                          setPaused(true)
                        }
                      }}
                      className="text-white"
                    >
                      {paused ? <Play size={22} /> : <Pause size={22} />}
                    </button>
                  )}
                  <button
                    aria-label={speaker ? "Mute speaker" : "Unmute speaker"}
                    aria-pressed={speaker}
                    onClick={() => setSpeaker(!speaker)}
                    className={speaker ? "text-green-500" : "text-red-500"}
                  >
                    {speaker ? <Volume2 size={28} /> : <VolumeX size={28} />}
                  </button>
                  {wide && (
                    <button
                      aria-label="Close landscape"
                      className="rounded-full bg-white/15 p-1 text-white"
                      onClick={() => setWide(false)}
                    >
                      <X size={24} />
                    </button>
                  )}
                </div>
              </div>
              {rotationHint && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/85 px-5 text-center text-lg text-white">
                  <RotateCw size={42} />
                  Turn your mobile to landscape
                </div>
              )}
            </div>
            <div className="grid min-h-0 grid-cols-4 grid-rows-2 border border-border px-1">
              <Action
                label="Emergency"
                icon={PhoneOutgoing}
                color="text-red-500"
                onClick={() => action("Emergency")}
              />
              <Action
                label="Talk"
                icon={Mic}
                active={talk}
                onClick={() => action("Talk")}
              />
              <Action
                label={unlocked ? "Unlocked" : "Unlock"}
                icon={unlocked ? LockKeyholeOpen : LockKeyhole}
                active={unlocked}
                onClick={() => action("Unlock")}
              />
              <Action
                label="Snapshot"
                icon={Camera}
                onClick={() => action("Snapshot")}
              />
              <Action
                label="Alarm"
                icon={Siren}
                active={alarm}
                color={alarm ? "text-red-500" : undefined}
                onClick={() => action("Alarm")}
              />
              <Action
                label="Human Alert"
                icon={PersonStanding}
                active={human}
                badge={!human}
                onClick={() => action("Human Alert")}
              />
              <Action
                label="Share Device"
                icon={Share2}
                badge
                onClick={() => action("Share Device")}
              />
              <Action
                label={recording ? "Stop Record" : "Record"}
                icon={Video}
                active={recording}
                color={recording ? "text-red-500" : undefined}
                onClick={() => action("Record")}
              />
            </div>
            <nav
              aria-label="Main navigation"
              className="grid min-h-0 grid-cols-5 px-1"
            >
              <Action
                small
                label="Cloud"
                icon={Cloud}
                badge
                onClick={() => action("Cloud")}
              />
              <Action
                small
                label="AI Track"
                icon={Package}
                onClick={() => action("AI Track")}
              />
              <Action
                small
                label="Send"
                icon={Package}
                onClick={() => action("Send")}
              />
              <Action
                small
                label="Schedule Unlock"
                icon={AlarmClock}
                active={scheduled.enabled}
                onClick={() => action("Schedule Unlock")}
              />
              <Action
                small
                label="Alerts"
                icon={Bell}
                onClick={() => action("Alerts")}
              />
            </nav>
          </div>
        )}
        {landscapeVideoUrl &&
          landscapeVideoUrl !== homeVideoUrl &&
          page === "/" &&
          !isDriveVideoUrl(landscapeVideoUrl) &&
          !wide && (
            <video
              src={landscapeVideoUrl}
              preload="auto"
              muted
              playsInline
              aria-hidden="true"
              className="hidden"
            />
          )}

        {page === "/tracking" && (
          <>
            <Header
              title="AI Parcel Tracking"
              back={back}
              simple
              right={
                <button
                  aria-label="Tracking menu"
                  onClick={() => setDialog("Tracking menu")}
                >
                  <Menu size={27} />
                </button>
              }
            />
            <div
              role="tablist"
              aria-label="Tracking filters"
              className="flex shrink-0 justify-between border-b-2 border-border px-3 text-[clamp(12px,3.7cqw,16px)]"
            >
              {["All", "In Transit", "Delivered", "Issues", "Returns"].map(
                (tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={trackingTab === tab}
                    onClick={() => setTrackingTab(tab)}
                    className={`py-3 ${
                      trackingTab === tab
                        ? "border-b-2 border-primary font-semibold text-primary"
                        : "border-b-2 border-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>
            <main className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">
              {(trackingTab === "Returns"
                ? returns
                : trackingTab === "Delivered"
                  ? parcels.filter((parcel) => parcel.status === "Delivered")
                  : trackingTab === "All"
                    ? parcels
                    : []
              ).map((parcel, index) => (
                <button
                  key={parcel.tracking}
                  onClick={() =>
                    parcel.timeline
                      ? go(
                          `/timeline/${parcel.timeline}?tracking=${parcel.tracking}`,
                        )
                      : setDialog(`Tracking: ${parcel.tracking}`)
                  }
                  className={`flex w-full gap-4 rounded-[15px] border-l-[4px] bg-white px-4 py-5 text-left shadow-[0_3px_12px_#00000012] ${
                    parcel.status === "Order Confirmed"
                      ? "border-amber-400"
                      : parcel.status === "Refund Processed"
                        ? "border-cyan-500"
                        : "border-green-600"
                  }`}
                >
                  <div className="flex w-[55px] shrink-0 flex-col items-center justify-between">
                    <Carrier name={parcel.carrier} />
                    {parcel.carrier !== "amazon" &&
                      (index > 0 || trackingTab !== "Returns") && (
                        <span className="flex items-center gap-1 text-[14px] font-semibold text-primary underline">
                          Track
                          <ExternalLink size={12} />
                        </span>
                      )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    {parcel.name && (
                      <h2 className="text-[17px] font-bold">{parcel.name}</h2>
                    )}
                    <div
                      className={`flex items-center gap-2 text-[15px] font-semibold ${
                        parcel.status === "Order Confirmed"
                          ? "text-amber-500"
                          : parcel.status === "Refund Processed"
                            ? "text-cyan-600"
                            : "text-green-600"
                      }`}
                    >
                      {parcel.status === "Order Confirmed" ? (
                        <ShoppingCart size={23} />
                      ) : (
                        <Package size={23} className="text-primary" />
                      )}
                      {parcel.status}
                    </div>
                    <p className="text-[14px] text-[#777]">On: {parcel.date}</p>
                    <p className="break-all text-[13px] text-[#999]">
                      Tracking#: {parcel.tracking}
                    </p>
                  </div>
                </button>
              ))}
              {["In Transit", "Issues"].includes(trackingTab) && (
                <p className="py-12 text-center text-muted-foreground">
                  No{" "}
                  {trackingTab === "Issues" ? "issues" : "parcels in transit"}{" "}
                  in the supplied sample.
                </p>
              )}
            </main>
          </>
        )}
        {page.startsWith("/timeline/") && (
          <>
            <Header title="Parcel Timeline" simple back={back} />
            <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="flex items-center gap-5 px-6 py-6 shadow-[0_5px_15px_#00000008]">
                <Carrier
                  name={page.endsWith("royal") ? "royal-mail" : "amazon"}
                />
                <div className="min-w-0">
                  <h2 className="text-[19px] font-bold">
                    {page.endsWith("royal")
                      ? "PROFORMA PEPTIDES UK"
                      : "Amazon.co.uk"}
                  </h2>
                  <p className="text-[13px] text-[#999]">
                    Order#{" "}
                    {page.endsWith("royal") ? "27554" : "206-0323634-4706773"}
                  </p>
                  <p className="break-all text-[13px] text-[#999]">
                    Tracking#{" "}
                    {new URLSearchParams(location.search).get("tracking") ||
                      (page.endsWith("royal") ? "DO788364347GB" : "T1gVYcc1y")}
                  </p>
                </div>
              </div>
              <section className="px-5 pb-10 pt-7">
                <h2 className="mb-5 text-xl font-bold">Tracking History</h2>
                {(page.endsWith("royal")
                  ? [
                      ["Delivered", "15 Sep 2026 at 11:40"],
                      ["Out For Delivery", "15 Sep 2026 at 09:33"],
                      ["Shipped", "14 Sep 2026 at 20:07"],
                      ["Shipped", "14 Sep 2026 at 12:56"],
                      ["Order Confirmed", "14 Sep 2026 at 12:56"],
                      ["Order Confirmed", "12 Sep 2026 at 19:46"],
                    ]
                  : [
                      ["Delivered", "22 Sep 2026 at 11:34"],
                      ["Out For Delivery", "22 Sep 2026 at 11:09"],
                      ["Order Confirmed", "21 Sep 2026 at 14:49"],
                    ]
                ).map(([status, date], index) => (
                  <div key={index} className="flex items-center gap-3 py-3">
                    <span>
                      {status === "Delivered" ? (
                        <Package className="text-primary" size={23} />
                      ) : status === "Order Confirmed" ? (
                        <ShoppingCart size={23} />
                      ) : (
                        <Truck size={23} />
                      )}
                    </span>
                    <div className="flex flex-1 flex-wrap items-center justify-between gap-1 border-b border-border pb-3">
                      <span className="text-[14px]">{status}</span>
                      <span className="text-[11px] text-[#777]">{date}</span>
                    </div>
                  </div>
                ))}
              </section>
            </main>
          </>
        )}

        {page === "/share" && (
          <>
            <Header
              title="Share Device"
              back={back}
              right={
                <button
                  aria-label="Sharing information"
                  onClick={() => setDialog("Sharing information")}
                  className="rounded-lg bg-white p-2 text-primary"
                >
                  <Info size={26} />
                </button>
              }
            />
            <main className="flex min-h-0 flex-1 flex-col rounded-t-[26px] bg-white px-4 pb-3 pt-4">
              <div
                aria-label="Shared users"
                className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pb-4"
              >
                {users.map((user) => (
                  <SharedUserCard
                    key={user.id}
                    user={user}
                    toggle={() => {
                      setUsers((previous) =>
                        previous.map((person) =>
                          person.id === user.id
                            ? { ...person, active: !person.active }
                            : person,
                        ),
                      )
                      notify(
                        `${user.name}'s access ${
                          user.active ? "removed" : "restored"
                        }`,
                      )
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setShared(false)
                  setUserName("")
                  setEmail("")
                  setSelectedAvatar(0)
                  go("/share/add")
                }}
                className="shrink-0 rounded-md bg-primary py-3 text-xl font-bold text-white"
              >
                Share Device
              </button>
            </main>
          </>
        )}
        {page === "/share/add" && (
          <>
            <Header
              title=""
              back={back}
              right={
                <button
                  aria-label="Sharing information"
                  onClick={() => setDialog("Sharing information")}
                  className="rounded-lg bg-white p-2 text-primary"
                >
                  <Info size={26} />
                </button>
              }
            />
            <main className="flex min-h-0 flex-1 flex-col rounded-t-[26px] bg-white px-4 pb-3 pt-2">
              <div className="mx-auto flex h-[clamp(42px,7cqh,62px)] w-[clamp(42px,7cqh,62px)] shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <UserPlus size={34} />
              </div>
              <h1 className="mt-2 text-center text-xl font-bold">Add User</h1>
              <p className="mx-auto mb-3 mt-1 max-w-[340px] text-center text-[13px] leading-snug text-[#888]">
                Share this device with other users to gain access to the
                benefits of go noknok.
              </p>
              <form
                className="flex min-h-0 flex-1 flex-col gap-[clamp(8px,1.5cqh,14px)] overflow-y-auto overscroll-contain"
                onSubmit={(event) => {
                  event.preventDefault()
                  invite()
                }}
              >
                <label className="block text-sm font-semibold">
                  Name <span className="text-red-500">*</span>
                  <input
                    type="text"
                    required
                    maxLength={48}
                    autoComplete="name"
                    aria-label="User name"
                    placeholder="Enter name"
                    value={userName}
                    onChange={(event) => {
                      setUserName(event.target.value)
                      setShared(false)
                    }}
                    className="mt-1 block h-11 w-full rounded-md border border-border px-3 text-[16px] font-normal"
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Email Address <span className="text-red-500">*</span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    aria-label="Email Address"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setShared(false)
                    }}
                    className="mt-1 block h-11 w-full rounded-md border border-border px-3 text-[16px] font-normal"
                  />
                </label>
                <fieldset className="shrink-0">
                  <legend className="mb-2 text-sm font-semibold">
                    Choose avatar
                  </legend>
                  <div className="flex justify-center gap-4">
                    {[0, 1, 2, 3].map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        aria-label={`Select avatar ${avatar + 1}`}
                        aria-pressed={selectedAvatar === avatar}
                        onClick={() => {
                          setSelectedAvatar(avatar)
                          setShared(false)
                        }}
                        className={`relative h-[clamp(40px,6cqh,52px)] w-[clamp(40px,6cqh,52px)] rounded-full border-[3px] ${
                          selectedAvatar === avatar
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={`/assets/avatar-${avatar}.png`}
                          alt={`Avatar option ${avatar + 1}`}
                          className="h-full w-full rounded-full object-cover"
                        />
                        {selectedAvatar === avatar && (
                          <span className="absolute -bottom-1 -right-1 rounded-full bg-primary p-0.5 text-white">
                            <Check size={12} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {shared && (
                  <div
                    role="status"
                    className="shrink-0 rounded-lg bg-[#ddfce8] px-3 py-2 text-green-700"
                  >
                    <p className="text-sm font-semibold">Device Shared</p>
                  </div>
                )}
                <button
                  type="submit"
                  className="mt-auto shrink-0 rounded-md bg-primary py-3 text-xl font-bold text-white"
                >
                  Send Invite
                </button>
              </form>
            </main>
          </>
        )}

        {page === "/send" && (
          <>
            <Header
              title="Send Parcel"
              back={back}
              right={
                <button
                  aria-label="Courier information"
                  onClick={() => setDialog("Courier information")}
                  className="rounded-lg bg-white p-2 text-primary"
                >
                  <Info size={26} />
                </button>
              }
            />
            <main className="flex min-h-0 flex-1 flex-col rounded-t-[26px] bg-white px-4 py-5 text-center">
              <span className="mx-auto shrink-0 rounded-full bg-secondary px-3 py-1.5 text-[15px] font-bold">
                Step 1
              </span>
              <h2 className="mt-5 text-[22px] font-bold">
                Select Courier from below partners
              </h2>
              <p className="mt-4 text-[15px] leading-tight text-[#888]">
                Use the Go noknok app to start the buying service process you
                need
              </p>
              <div className="flex min-h-5 flex-1 items-center justify-center gap-2">
                <span className="h-1 w-12 rounded-full bg-primary" />
                <span className="h-1 w-12 rounded-full bg-secondary" />
                <span className="h-1 w-12 rounded-full bg-secondary" />
              </div>
              <div className="grid shrink-0 grid-cols-2 gap-4 pb-[clamp(10px,8cqh,80px)]">
                {["royal-mail", "evri", "yodel", "dpd"].map((carrier) =>
                  carrier === "royal-mail" ? (
                    <a
                      key={carrier}
                      href="https://send.royalmail.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Royal Mail — open courier service"
                    >
                      <img
                        src={`/assets/${carrier}.png`}
                        alt="Royal Mail"
                        className="w-full rounded-md"
                      />
                    </a>
                  ) : (
                    <button
                      key={carrier}
                      onClick={() =>
                        notify("Only Royal Mail is linked in this prototype.")
                      }
                      aria-label={carrier}
                    >
                      <img
                        src={`/assets/${carrier}.png`}
                        alt={carrier}
                        className="w-full rounded-md"
                      />
                    </button>
                  ),
                )}
              </div>
            </main>
          </>
        )}
        {page === "/schedule" && (
          <>
            <StatusBar time="10.15" dark />
            <main className="flex min-h-0 flex-1 flex-col gap-[clamp(10px,2cqh,20px)] px-4 pb-4">
              <div className="flex shrink-0 items-center justify-between">
                <h1 className="text-[19px] font-bold">Time</h1>
                <button aria-label="Back" className="p-2" onClick={back}>
                  <ChevronLeft size={22} />
                </button>
              </div>
              <div className="shrink-0 rounded-xl bg-[#f2f2f2] py-[clamp(12px,2.5cqh,24px)] text-center text-[clamp(30px,4.5cqh,40px)] font-bold text-black">
                {time}
              </div>
              <div
                aria-label="Configured time"
                className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-x-2 top-1/2 h-10 -translate-y-1/2 rounded-full bg-[#f4f4f4]" />
                <div className="relative flex gap-12">
                  {[scheduled.hour, scheduled.minute].map((value, column) => (
                    <div
                      key={column}
                      className="flex flex-col items-center text-[clamp(18px,3cqh,25px)]"
                    >
                      {[-3, -2, -1, 0, 1, 2, 3].map((offset) => (
                        <span
                          key={offset}
                          className={`flex h-[clamp(22px,4cqh,32px)] items-center ${
                            offset === 0
                              ? "text-black"
                              : Math.abs(offset) > 1
                                ? "text-[#ddd]"
                                : "text-[#aaa]"
                          }`}
                        >
                          {String(
                            (value + offset + (column === 0 ? 24 : 60)) %
                              (column === 0 ? 24 : 60),
                          ).padStart(2, "0")}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <section className="shrink-0">
                <h2 className="mb-3 text-[19px] font-bold">Repeat</h2>
                <div className="flex flex-wrap gap-2">
                  {["NEVER", "DAILY", "WEEKDAYS", "WEEKENDS", "CUSTOM"].map(
                    (value) => (
                      <span
                        key={value}
                        className={`rounded-full px-3 py-2 text-[12px] ${
                          scheduled.repeat === value
                            ? "bg-primary text-white"
                            : "bg-[#eee]"
                        }`}
                      >
                        {value}
                      </span>
                    ),
                  )}
                </div>
                <div className="mt-4 flex justify-between">
                  {days.map((day, index) => (
                    <span
                      key={day}
                      aria-label={`${day}${
                        scheduled.days.includes(index) ? ", scheduled" : ""
                      }`}
                      className={`flex h-[clamp(34px,10cqw,44px)] w-[clamp(34px,10cqw,44px)] items-center justify-center rounded-full text-[16px] font-semibold ${
                        scheduled.repeat === "CUSTOM" &&
                        scheduled.days.includes(index)
                          ? "bg-primary text-white"
                          : "bg-[#eee]"
                      }`}
                    >
                      {day[0]}
                    </span>
                  ))}
                </div>
              </section>
              <div className="shrink-0 rounded-xl bg-[#f6f6f6] p-4">
                <h2 className="font-semibold">Preview</h2>
                <p className="mt-2 text-[17px]">{preview}</p>
              </div>
              <div className="shrink-0 rounded-xl bg-secondary px-4 py-3 text-center text-sm text-primary">
                <p className="font-semibold">
                  {scheduled.enabled
                    ? "Auto-Unlock enabled"
                    : "Auto-Unlock disabled"}
                </p>
                <p className="mt-1 text-xs">
                  Managed by the device owner. This schedule cannot be changed
                  here.
                </p>
              </div>
            </main>
          </>
        )}

        {page === "/media" && (
          <>
            <div className="shrink-0 bg-[#808080]">
              <StatusBar time="16.41" />
            </div>
            <header className="shrink-0 border-b border-[#aaa] px-4 pb-4 pt-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Device Media</h1>
                <button
                  aria-label="Close media"
                  onClick={back}
                  className="text-primary"
                >
                  <X size={25} />
                </button>
              </div>
              <div className="mt-3 flex gap-3">
                {["cloud", "device"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMediaTab(tab)}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-full py-2 text-[17px] ${
                      mediaTab === tab
                        ? "bg-secondary text-primary"
                        : "text-[#aaa]"
                    }`}
                  >
                    {tab === "cloud" ? (
                      <Cloud size={21} />
                    ) : (
                      <Smartphone size={21} />
                    )}
                    {tab === "cloud" ? "Cloud" : "Device"}
                  </button>
                ))}
              </div>
            </header>
            <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {mediaTab === "cloud" ? (
                [1, 2, 3].map((number, index) => (
                  <section
                    key={number}
                    className="border-b border-[#aaa] px-7 py-5"
                  >
                    <button
                      aria-label={`Play cloud video ${number}`}
                      onClick={() => {
                        if (homeVideoUrl) setSelectedMedia(homeVideoUrl)
                        else
                          notify(
                            "The owner has not configured a demo video yet.",
                          )
                      }}
                      className="group relative block w-full overflow-hidden rounded-[15px]"
                    >
                      <img
                        src={`/assets/media-${number}.png`}
                        alt={
                          index === 0
                            ? "Parcel delivery"
                            : index === 1
                              ? "Delivery driver"
                              : "Front door"
                        }
                        className="aspect-video w-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
                        <Play size={35} fill="white" className="text-white" />
                      </span>
                    </button>
                    <div className="mt-3 flex items-start gap-3 text-primary">
                      <Video size={28} />
                      <div>
                        <div className="flex flex-wrap items-center gap-x-3">
                          <h2 className="text-[18px] font-semibold">
                            Video - 30 seconds
                          </h2>
                          <span className="text-[13px]">
                            {index === 0
                              ? "12/02/2026 14.20"
                              : "05/02/2026 10.58"}
                          </span>
                        </div>
                        <p className="mt-1 text-[16px] text-[#888]">
                          {index === 0 ? "Activity detected" : "Human detected"}
                        </p>
                      </div>
                    </div>
                  </section>
                ))
              ) : (
                <div className="space-y-5 px-6 py-5">
                  {assets.length === 0 && (
                    <p className="py-10 text-center text-muted-foreground">
                      Snapshots and recordings will appear here.
                    </p>
                  )}
                  {assets.map((asset) => (
                    <section key={asset.id}>
                      <button
                        aria-label={`Open ${asset.kind}`}
                        onClick={() => setSelectedMedia(asset.url)}
                        className="block w-full overflow-hidden rounded-xl"
                      >
                        {asset.kind === "snapshot" || asset.simulated ? (
                          <img
                            src={
                              asset.kind === "snapshot"
                                ? asset.url
                                : PROTOTYPE_CONFIG.video.posterUrl
                            }
                            alt={asset.kind}
                            className="aspect-video w-full object-cover"
                          />
                        ) : (
                          <video
                            src={asset.url}
                            className="aspect-video w-full object-cover"
                          />
                        )}
                      </button>
                      <div className="mt-2 flex justify-between text-primary">
                        <span>
                          {asset.kind === "snapshot" ? "Snapshot" : "Recording"}
                        </span>
                        <span className="text-sm">{asset.time}</span>
                      </div>
                      {asset.simulated && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Prototype {asset.kind} · live capture unavailable
                        </p>
                      )}
                      <a
                        href={asset.url}
                        download={`gonoknok-${asset.id}.${
                          asset.kind === "snapshot" ? "png" : "webm"
                        }`}
                        className="mt-2 inline-block text-sm text-primary underline"
                      >
                        Download
                      </a>
                    </section>
                  ))}
                </div>
              )}
            </main>
          </>
        )}

        <div
          aria-hidden="true"
          className={`flex h-[max(12px,env(safe-area-inset-bottom))] shrink-0 items-center justify-center ${
            page === "/" || page === "/schedule" ? "bg-white" : "bg-black"
          }`}
        >
          <span
            className={`h-1 w-28 rounded-full ${
              page === "/" || page === "/schedule" ? "bg-black" : "bg-white"
            }`}
          />
        </div>
        {dialog && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-5"
            onClick={() => setDialog(null)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-label={dialog}
              className="max-h-[85cqh] w-full max-w-[370px] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="min-w-0 break-words text-xl font-bold">
                  {dialog}
                </h2>
                <button
                  aria-label="Close dialog"
                  autoFocus
                  className="shrink-0"
                  onClick={() => setDialog(null)}
                >
                  <X size={23} />
                </button>
              </div>
              {(dialog === "Battery" || dialog === "Wi-Fi") && (
                <div className="py-6 text-center">
                  {dialog === "Battery" ? (
                    <Battery size={50} className="mx-auto text-primary" />
                  ) : (
                    <Wifi size={50} className="mx-auto text-primary" />
                  )}
                  <p className="mt-4 text-3xl font-bold">
                    {dialog === "Battery" ? CONFIG.battery : CONFIG.wifi}%
                  </p>
                  <p className="mt-2 text-green-600">
                    {(dialog === "Battery" ? CONFIG.battery : CONFIG.wifi) >= 90
                      ? "Excellent"
                      : "Good"}
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {dialog === "Battery"
                      ? "Device battery level"
                      : "Wi-Fi signal strength"}
                  </p>
                </div>
              )}
              {dialog === "Settings" && (
                <div className="mt-5 space-y-3">
                  <button
                    onClick={() => go("/schedule")}
                    className="flex w-full items-center gap-3 rounded-lg bg-secondary p-3"
                  >
                    <AlarmClock />
                    Schedule Unlock
                  </button>
                  <button
                    onClick={() => go("/share")}
                    className="flex w-full items-center gap-3 rounded-lg bg-secondary p-3"
                  >
                    <Share2 />
                    Share Device
                  </button>
                </div>
              )}
              {dialog === "Device" && (
                <div className="space-y-3 py-5">
                  <p>Smart Parcel Box · 9C6WXFJ6+JWC</p>
                  <p className={unlocked ? "text-green-600" : "text-primary"}>
                    {unlocked ? "Unlocked" : "Locked"}
                  </p>
                </div>
              )}
              {dialog === "Emergency" && (
                <p className="py-5 text-muted-foreground">
                  Emergency calling is not configured in the supplied mappings.
                  No call will be placed by this prototype.
                </p>
              )}
              {dialog === "Alerts" && (
                <div className="space-y-3 py-5">
                  <p>Alarm: {alarm ? "ON" : "OFF"}</p>
                  <p>Human Detection: {human ? "ON" : "OFF"}</p>
                  <p>Device: {unlocked ? "Unlocked" : "Locked"}</p>
                  <p>
                    Auto-Unlock:{" "}
                    {scheduled.enabled ? `Enabled at ${time}` : "Not set"}
                  </p>
                </div>
              )}
              {dialog === "Tracking menu" && (
                <div className="mt-4 flex flex-col gap-2">
                  {["All", "Delivered", "Returns"].map((tab) => (
                    <button
                      key={tab}
                      className="rounded-lg bg-secondary p-3 text-left"
                      onClick={() => {
                        setTrackingTab(tab)
                        setDialog(null)
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}
              {dialog.startsWith("Tracking:") && (
                <p className="mt-5 text-muted-foreground">
                  No destination timeline is provided for this parcel.
                </p>
              )}
              {dialog === "Sharing information" && (
                <p className="mt-5 text-muted-foreground">
                  Add a name, email address and avatar to share access.
                  Invitations are simulated locally in this prototype.
                </p>
              )}
              {dialog === "Courier information" && (
                <p className="mt-5 text-muted-foreground">
                  Choose Royal Mail to open send.royalmail.com. Other courier
                  destinations have not been provided.
                </p>
              )}
            </section>
          </div>
        )}
        {selectedMedia && (
          <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/90 p-5">
            <button
              aria-label="Close preview"
              className="absolute right-5 top-5 rounded-full bg-white/20 p-2 text-white"
              onClick={() => setSelectedMedia(null)}
            >
              <X />
            </button>
            {selectedMedia.startsWith("data:image") ||
            selectedMedia.endsWith(".png") ? (
              <img
                src={selectedMedia}
                alt="Captured snapshot"
                className="max-h-[80cqh] max-w-full"
              />
            ) : isDriveVideoUrl(selectedMedia) ? (
              <iframe
                title="Saved video — Google Drive"
                src={selectedMedia}
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
                className="aspect-video max-h-[80cqh] w-full max-w-[900px] border-0"
              />
            ) : (
              <video
                src={selectedMedia}
                autoPlay
                controls
                playsInline
                preload="auto"
                className="max-h-[80cqh] w-full max-w-[900px] object-contain"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const router = createBrowserRouter([{ path: "*", Component: Prototype }])
export default function App() {
  return <RouterProvider router={router} />
}
