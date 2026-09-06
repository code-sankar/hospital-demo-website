import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'

/* The landing page ships in the main bundle; everything else is fetched on
   demand, which keeps the first paint small on hospital Wi-Fi and mobile data. */
const About = lazy(() => import('./pages/About'))
const Centres = lazy(() => import('./pages/Centres'))
const CentreDetail = lazy(() => import('./pages/CentreDetail'))
const Doctors = lazy(() => import('./pages/Doctors'))
const DoctorDetail = lazy(() => import('./pages/DoctorDetail'))
const Patients = lazy(() => import('./pages/Patients'))
const Appointment = lazy(() => import('./pages/Appointment'))
const Insights = lazy(() => import('./pages/Insights'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const Careers = lazy(() => import('./pages/Careers'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="flex items-center gap-3 text-[0.8125rem] tracking-[0.2em] text-pine-900/40 uppercase">
        <span className="size-1.5 animate-pulse rounded-full bg-brass-500" aria-hidden="true" />
        Loading
      </span>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <Suspense fallback={<RouteFallback />}>
            <Layout />
          </Suspense>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/centres" element={<Centres />} />
        <Route path="/centres/:slug" element={<CentreDetail />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:slug" element={<DoctorDetail />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/insights/:slug" element={<ArticleDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
