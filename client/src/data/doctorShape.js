import { doctors as staticDoctors } from './doctors'
import { departments } from './departments'

/**
 * One shape for a consultant, whether the record came from the API or from the
 * bundled content file. Components never need to know which.
 */
export function fromStatic(doc) {
  const dept = departments.find((d) => d.slug === doc.department)
  return {
    slug: doc.slug,
    fullName: doc.name,
    title: doc.title,
    departmentSlug: doc.department,
    departmentName: dept?.name ?? doc.departmentName,
    focus: doc.focus,
    languages: doc.languages,
    qualifications: doc.education,
    memberships: doc.memberships,
    bio: doc.bio,
    experienceYears: doc.experience,
    // The content file predates per-consultant pricing; the API is authoritative.
    consultationFeePaise: null,
    slotMinutes: 15,
    isAccepting: doc.accepting,
    portraitSeed: doc.seed,
    initials: doc.initials,
    rating: doc.rating,
    reviewCount: doc.reviews,
    availability: null,
  }
}

export const staticDirectory = staticDoctors.map(fromStatic)

export const staticDoctor = (slug) => staticDirectory.find((d) => d.slug === slug) ?? null
