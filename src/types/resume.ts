export interface ResumeSettings {
  // Spacing
  fontSize?: number; // 8-14pt
  lineHeight?: number; // 1-2
  leftRightMargin?: number; // 10-50mm
  topBottomMargin?: number; // 10-50mm
  sectionSpacing?: 'compact' | 'normal' | 'relaxed';
  entrySpacing?: number; // 0-20px
  contentScale?: number;

  // Layout
  columns?: 'one' | 'two' | 'wide';
  headerPosition?: 'top' | 'left' | 'right';
  columnWidth?: number; // 30-70% for sidebar
  sidebarPosition?: 'left' | 'right' | 'none';

  // Font
  fontFamily?: string;
  fontCategory?: 'serif' | 'sans' | 'mono';

  // Colors
  accentColor?: string;
  colorMode?: 'basic' | 'advanced' | 'border';
  showBorder?: boolean;
  borderSides?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
  applyAccentTo?: {
    name?: boolean;
    jobTitle?: boolean;
    headings?: boolean;
    dates?: boolean;
    linkIcons?: boolean;
    iconsBars?: boolean;
    headingsLine?: boolean;
    headerIcons?: boolean;
  };

  // Section Headings
  headingStyle?: 'line-below' | 'line-above' | 'line-both' | 'box' | 'none';
  headingCapitalization?: 'capitalize' | 'uppercase' | 'lowercase';
  headingSize?: 'small' | 'medium' | 'large';
  headingIcons?: 'none' | 'outline' | 'filled';
  showDividers?: boolean;

  // Personal Details
  personalDetailsAlign?: 'left' | 'center' | 'right';
  personalDetailsArrangement?: 'row' | 'wrap' | 'bullet' | 'line';
  personalDetailsIconStyle?: 'none' | 'outline' | 'filled' | 'text';

  // Name
  nameSize?: 'small' | 'medium' | 'large' | 'xlarge';
  nameBold?: boolean;
  nameFont?: 'body' | 'creative';
  nameAlign?: 'left' | 'center' | 'right';
  nameArrangement?: 'row' | 'stacked' | 'stacked-reverse';

  // Skills Display
  skillsDisplay?: 'grid' | 'level' | 'compact' | 'bubble' | 'text' | 'dots' | 'bar';

  // Languages Display
  languagesDisplay?: 'grid' | 'compact' | 'bubble' | 'text' | 'dots' | 'bar';
  languagesSubtitleStyle?: 'dash' | 'colon' | 'bracket';

  // Interests Display
  interestsDisplay?: 'grid' | 'compact' | 'bubble';
  interestsSubtitleStyle?: 'dash' | 'colon' | 'bracket';

  // Certificates Display
  certificatesDisplay?: 'grid' | 'compact' | 'bubble';

  // Profile Section
  showProfileHeading?: boolean;

  // Education Settings
  educationOrder?: 'degree-school' | 'school-degree';

  // Work Experience Settings
  experienceOrder?: 'title-employer' | 'employer-title';
  showEmploymentHistory?: boolean;
  groupPositions?: boolean;

  // Entry Layout (Experience/Education entries)
  entryLayout?: 'stacked' | 'inline' | 'timeline';
  entryColumnWidth?: 'auto' | 'manual';
  entryTitleSize?: 'small' | 'medium' | 'large';
  entrySubtitleStyle?: 'normal' | 'bold' | 'italic';
  entrySubtitlePlacement?: 'same-line' | 'next-line';
  entryDescriptionIndent?: boolean;
  entryListStyle?: 'bullet' | 'hyphen' | 'none';

  // Footer
  showPageNumbers?: boolean;
  showFooterEmail?: boolean;
  showFooterName?: boolean;

  // Advanced
  linkIcon?: 'none' | 'icon' | 'text';
  reduceDateLocationOpacity?: boolean;

  // Date Format
  dateFormat?: 'MM/YYYY' | 'YYYY' | 'MMM YYYY' | 'MMMM YYYY';
  
  // Page Format
  pageFormat?: 'A4' | 'Letter';

  // Photo Settings
  photoSize?: 'small' | 'medium' | 'large' | 'xlarge';
  photoShape?: 'circle' | 'square' | 'rounded';
  photoPosition?: 'left' | 'center' | 'right';
  photoBorder?: boolean;
  photoBorderColor?: string;
}

export interface ResumeData {
  personalInfo: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    jobTitle?: string;
    summary?: string;
    address?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    profileImage?: string;
  };
  settings?: ResumeSettings;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certificates: Certificate[];
  publications: Publication[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Language {
  id: string;
  name: string;
  level?: 'Native' | 'Fluent' | 'Conversational' | 'Basic';
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  authors?: string;
  url?: string;
  description?: string;
}

export interface Resume {
  id: string;
  title: string;
  template_id: string;
  data: ResumeData;
  updated_at: string;
}
