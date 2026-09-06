import { Link } from 'react-router-dom'
import { Phone, MapPin, Globe, ArrowUpRight } from 'lucide-react'
import Container from '../ui/Container'
import { site } from '../../data/site'

export default function TopBar() {
  return (
    <div className="hidden bg-pine-900 text-pine-100/80 lg:block">
      <Container size="wide">
        <div className="flex h-10 items-center justify-between text-[0.75rem]">
          <div className="flex items-center gap-7">
            <a
              href={`tel:${site.emergencyPhone}`}
              className="group flex items-center gap-2 transition-colors hover:text-ivory"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-2 animate-pulse-ring rounded-full bg-clay-400" />
                <span className="relative inline-flex size-2 rounded-full bg-clay-500" />
              </span>
              <span className="font-medium tracking-wide">
                Emergency <span className="text-ivory">{site.emergencyPhone}</span>
              </span>
            </a>
            <span aria-hidden="true" className="h-3 w-px bg-pine-100/20" />
            <a href={`tel:${site.phone}`} className="flex items-center gap-2 transition-colors hover:text-ivory">
              <Phone className="size-3.5" />
              {site.phone}
            </a>
            <span aria-hidden="true" className="h-3 w-px bg-pine-100/20" />
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5" />
              {site.address.city}, {site.address.country}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/careers" className="link-underline transition-colors hover:text-ivory">
              Careers
            </Link>
            <Link to="/contact" className="link-underline transition-colors hover:text-ivory">
              Refer a patient
            </Link>
            <span aria-hidden="true" className="h-3 w-px bg-pine-100/20" />
            <span className="flex items-center gap-1.5">
              <Globe className="size-3.5" />
              <span className="tracking-wide">EN</span>
              <span className="text-pine-100/35">/ FR / DE</span>
            </span>
            <a
              href="#patient-portal"
              className="flex items-center gap-1 border border-pine-100/25 px-3 py-1 tracking-wide transition-colors hover:border-brass-400 hover:text-brass-300"
            >
              Patient portal
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </Container>
    </div>
  )
}
