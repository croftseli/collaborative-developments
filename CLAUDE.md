# CLAUDE.md

# claude.md - Collaborative Developments LLC Website

## Project Overview

**Project Name:** Collaborative Developments LLC Website  
**Technology Stack:** Next.js 15.5.1, TypeScript, Tailwind CSS, Supabase (Database, Authentication, Storage)  
**Purpose:** Create a professional website for Collaborative Developments LLC that reflects Baha'i Faith society-building principles and supports community development initiatives.

## Business Context

**Company:** Collaborative Developments LLC  
**Mission:** Apply society-building principles to community development, food security, and job creation  
**Key Personnel:**
- Roi Qualls - Financial Officer
- John Everett - Managing Member

**Target Audience:**
- Immigrant families
- City officials
- Sustainable agriculture aficionados
- General contractors
- Real estate investors

**Business Goals:**
- Increase investment capital from $1M to $2M
- Support Grand River Gardens
- Start agricultural initiative (Adasiyyih model)
- Achieve 5% return on investment
- Provide youth training in agriculture and construction

## Design Philosophy

**Visual Identity:**
- Deep Forest Green (#0F4C2C) - Primary color representing growth and sustainability
- Warm Earthy Brown/Terracotta (#965C3B) - Secondary color for groundedness
- Soft Gold/Ochre (#C9AA5E) - Accent color for warmth and wisdom
- Sky Blue (#84B0CE) - Secondary accent for openness
- Cream/Off-White (#F5F1E5) - Background color
- Charcoal Grey (#333333) - Text color

**Typography:**
- All text: Jost font (modern, clean sans-serif)

**Imagery Style:**
- Nature and agricultural landscapes
- Diverse groups collaborating
- Community growth and flourishing
- Sustainable practices

## Technical Architecture

### Frontend Stack
```
Next.js 14 (App Router)
├── TypeScript for type safety
├── Tailwind CSS for styling
├── Framer Motion for animations
├── React Hook Form for forms
└── React Icons for iconography
```

### Backend Services
```
Supabase
├── Supabase (Database)
├── Authentication (Email/Password)
└── Storage (File uploads)
```

### Basic Project Structure 
```
collaborative-developments/
├── app/
│   ├── (pages)/
│   │   ├── about/
│   │   ├── collaborators/
│   │   ├── resources/
│   │   ├── contact/
│   │   ├── admin/
│   │   └── login/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   │   ├── NewsManager.tsx
│   │   ├── ResourcesManager.tsx
│   │   └── CollaboratorsManager.tsx
│   ├── Layout.tsx
│   ├── HeroSection.tsx
│   └── NewsSection.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── supabase.ts
│   ├── db.ts
│   └── storage.ts
└── public/
```

## Database Schema

### Supabase Tables

**news**
```typescript
{
  id: string;
  title: string;
  content: string;
  published: boolean;
  date: Timestamp;
  featuredImage?: string;
  author: string;
  createdBy: string;
}
```

**resources**
```typescript
{
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl?: string;
  externalUrl?: string;
  date: Timestamp;
}
```

**collaborators**
```typescript
{
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  featured: boolean;
}
```

## Key Features

### Public Features
1. **Home Page**
   - Hero section with mission statement
   - News updates slideshow (with featured image) get from database
   - Call-to-action buttons

2. **About Us Page**
   - Company mission and values
   - Key personnel profiles
   - History and founding story

3. **News/Updates Section**
   - Chronological news display
   - Featured articles

4. **Resources Page**
   - A list of links and downloadable resources like documents, pdfs, and videos
   - controllable by the admin

5. **Collaborators Page**
   - Partner organization profiles
   - Logos and website links
   - controllable by the admin

6. **Contact Page**
   - Contact information with email: rqualls@corinne-true-endeavors.com and phone number: +1 (123) 456-7890
   - Contact form

### Administrative Features
1. **Authentication System**
   - Email/password login
   - Protected admin routes

2. **Content Management System**
   - News article creation and editing
   - Resource management
   - Collaborator management
   - Draft/publish workflow

3. **File Upload System**
   - Image uploads for news and resources
   - Document storage and management

4. **News Updates workflow**
   - Admin dashboard adds Title, Content, Published, Author, and featured image(optional)
   - Featured image is uploaded to Supabase Storage
   - Featured image url is added to News database and uploaded to database
   - News Item list allows admin to edit and delete items
   - Admin can publish or unpublish items

5.
   - 

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security Considerations

### Supabase Security Rules
- Public read access for published content only
- Write access restricted to authenticated users
- File upload permissions for authenticated users only

### Authentication
- Admin-only access to CMS features
- Secure password requirements
- Session management through Supabase Auth

## Content Guidelines

### Tone and Voice
- Inspiring and collaborative
- Grounded and forward-looking
- Professional yet approachable
- Aligned with Baha'i principles of unity and service

### Content Categories
1. **Agricultural Initiatives**
   - Organic farming practices
   - Community gardens
   - Food security programs

2. **Community Sustainability**
   - Capacity building programs
   - Youth training initiatives
   - Collaborative development projects

3. **Framework for Action**
   - Society-building principles
   - Community engagement strategies
   - Spiritual foundation documents

## Development Workflow

### Setup Process
1. Initialize Next.js project with TypeScript and Tailwind
2. Configure Supabase project and services
3. Set up authentication context
4. Implement core components and layout
5. Build database service layer
6. Create admin CMS functionality
7. Implement public pages
8. Test and deploy

### Key Dependencies
```json
{
  "next": "^15.5.1",
  "react": "^19.1.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^4.1.12",
  "@supabase/supabase-js": "^2.57.4",
  "framer-motion": "^12.23.12",
  "react-hook-form": "^7.62.0",
  "react-icons": "^5.5.0"
}
```

## Deployment

### Recommended Platforms
1. **Vercel** 
   - Seamless Next.js integration
   - Automatic deployments
   - Environment variable management

### Build Configuration
```bash
npm run build
npm run start
```

## Maintenance and Updates

### Regular Tasks
1. Content updates through admin CMS
2. News article publication
3. Resource library maintenance
4. Collaborator profile updates

### Technical Maintenance
1. Dependency updates
2. Security patches
3. Performance monitoring
4. Backup procedures

## Future Enhancements

### Phase 2 Features
1. Newsletter subscription system
2. Event calendar integration
3. Donation/investment portal
4. Multi-language support
5. Advanced analytics
6. SEO optimization
7. Social media integration

### Potential Integrations
1. Email marketing (Mailchimp/ConvertKit)
2. Google Analytics
3. CRM system integration
4. Payment processing (Stripe)

## Contact Information

**Address:** 5847 Sage River Court SW, Wyoming, MI 49418  
**Website:** https://collaborative-developments-bftj.vercel.app  
**Project Repository:** https://github.com/motlaghi1/collaborative-developments.git

## Notes for AI Assistants

When working on this project:
1. Always maintain the spiritual and community-focused tone
2. Prioritize accessibility and user experience
3. Follow the established color palette and typography
4. Ensure mobile responsiveness for all components
5. Implement proper error handling and loading states
6. Use TypeScript strictly for type safety
7. Follow Next.js 14 best practices with App Router
8. Maintain clean, commented code
9. Test all CMS functionality thoroughly
10. Consider the diverse audience when making design decisions

This project reflects the values of collaboration, community building, and spiritual principles while maintaining professional web development standards.