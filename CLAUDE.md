# CLAUDE.md

# claude.md - Collaborative Developments LLC Website

## Project Overview

**Project Name:** Collaborative Developments LLC Website  
**Technology Stack:** Next.js 14, TypeScript, Tailwind CSS, Firebase (Firestore, Authentication, Storage)  
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
- Deep Forest Green (#417658) - Primary color representing growth and sustainability
- Warm Earthy Brown/Terracotta (#8b6f47) - Secondary color for groundedness
- Soft Gold/Ochre (#d4af37) - Accent color for warmth and wisdom
- Sky Blue (#87ceeb) - Secondary accent for openness
- Cream/Off-White (#fefcf9) - Background color
- Charcoal Grey (#374151) - Text color

**Typography:**
- Headers: Modern sans-serif (Inter)
- Body text: Classic serif (Merriweather)

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
Firebase
├── Firestore (Database)
├── Authentication (Email/Password)
├── Storage (File uploads)
└── Hosting (Optional)
```

### Project Structure
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
│   ├── firebase.ts
│   └── db.ts
└── public/
```

## Database Schema

### Firestore Collections

**news**
```typescript
{
  id: string;
  title: string;
  content: string;
  published: boolean;
  date: Timestamp;
  featuredImage?: string;
  author?: string;
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
   - News updates slideshow
   - Call-to-action buttons

2. **About Us Page**
   - Company mission and values
   - Key personnel profiles
   - History and founding story

3. **News/Updates Section**
   - Chronological news display
   - Featured articles

4. **Resources Page**
   - Categorized resources
   - Search and filter functionality
   - Document downloads and external links

5. **Collaborators Page**
   - Partner organization profiles
   - Logos and website links

6. **Contact Page**
   - Contact information
   - Address: 5847 Sage River Court SW, Wyoming, MI 49418
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

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Security Considerations

### Firebase Security Rules
- Public read access for published content only
- Write access restricted to authenticated users
- File upload permissions for authenticated users only

### Authentication
- Admin-only access to CMS features
- Secure password requirements
- Session management through Firebase Auth

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
2. Configure Firebase project and services
3. Set up authentication context
4. Implement core components and layout
5. Build database service layer
6. Create admin CMS functionality
7. Implement public pages
8. Test and deploy

### Key Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "firebase": "^10.0.0",
  "framer-motion": "^10.0.0",
  "react-hook-form": "^7.0.0",
  "react-icons": "^4.0.0"
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
**Website:** collaborative-developments.com  
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