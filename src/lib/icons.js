/**
 * Explicit icon registry. Importing the whole lucide namespace to resolve a
 * name from data would ship every icon in the library, so only the icons the
 * department data references are enumerated here.
 */
import { createElement } from 'react'
import {
  HeartPulse,
  Brain,
  Ribbon,
  Bone,
  Baby,
  Ambulance,
  Stethoscope,
  Scan,
  Activity,
  Droplets,
  Ear,
  SmilePlus,
  Wind,
} from 'lucide-react'

const registry = {
  HeartPulse,
  Brain,
  Ribbon,
  Bone,
  Baby,
  Ambulance,
  Stethoscope,
  Scan,
  Activity,
  Droplets,
  Ear,
  SmilePlus,
  Wind,
}

/** Renders the icon named in the data, falling back to a stethoscope. */
export function DeptIcon({ name, ...props }) {
  return createElement(registry[name] ?? Stethoscope, props)
}
