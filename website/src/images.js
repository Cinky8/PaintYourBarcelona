// ─────────────────────────────────────────────────────────────────────────────
//  IMAGE CONFIG
//  Drop your files into  website/public/images/  with the exact names below.
//  Default format is .jpg for photos and .png for icons.
//  If you use a different format (.jpeg / .webp / .svg) just update the
//  extension next to the relevant name.
// ─────────────────────────────────────────────────────────────────────────────

const img = (name) => `/images/${name}`

const images = {

  // ── Home ──────────────────────────────────────────────────────────────────

  Landing:          img('Landing.jpg'),          // Hero photo (right side)

  WorkshopIcon1:    img('WorkshopIcon1.png'),     // Sketching  icon (blue circle)
  WorkshopIcon2:    img('WorkshopIcon2.png'),     // Painting   icon (orange circle)
  WorkshopIcon3:    img('WorkshopIcon3.png'),     // Souvenir   icon (gold circle)

  TravelersPhoto1:  img('TravelersPhoto1.jpg'),   // Testimonial card 1 — Marco
  TravelersPhoto2:  img('TravelersPhoto2.jpg'),   // Testimonial card 2 — Nicole
  TravelersPhoto3:  img('TravelersPhoto3.jpg'),   // Testimonial card 3 — Adam

  SocializePhoto1:  img('SocializePhoto1.jpg'),   // Gallery photo 1 (top-left)
  SocializePhoto2:  img('SocializePhoto2.jpg'),   // Gallery photo 2 (offset down)
  SocializePhoto3:  img('SocializePhoto3.jpg'),   // Gallery photo 3
  SocializePhoto4:  img('SocializePhoto4.jpg'),   // Gallery photo 4 (offset down)

  Venues:           img('Venues.jpg'),            // For Hostels & Venues section
  Guide:            img('Guide.jpg'),             // Meet Diana portrait

  // ── Become a Partner ──────────────────────────────────────────────────────

  PartnerLanding1:  img('PartnerLanding1.jpg'),   // Hero collage — top-right
  PartnerLanding2:  img('PartnerLanding2.jpg'),   // Hero collage — bottom-left

  OccasionsIcon1:   img('OccasionsIcon1.png'),    // Hotels & Guesthouses icon
  OccasionsIcon2:   img('OccasionsIcon2.png'),    // Cafés & Wine Bars icon
  OccasionsIcon3:   img('OccasionsIcon3.png'),    // Corporate Team Building icon

  Why1:             img('Why1.jpg'),              // Why Partner — left column top
  Why2:             img('Why2.jpg'),              // Why Partner — left column bottom

}

export default images
