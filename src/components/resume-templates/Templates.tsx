import React from 'react';
import { ResumeData, ResumeSettings } from '@/types/resume';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

// Personal Details Component to handle all styling options
function PersonalDetails({ data, className, iconColor, itemClassName }: { data: ResumeData, className?: string, iconColor?: string, itemClassName?: string }) {
  const {
    personalDetailsAlign = 'left',
    personalDetailsArrangement = 'row',
    personalDetailsIconStyle = 'none'
  } = data.settings || {};

  const items = [
    { type: 'email', value: data.personalInfo.email, icon: Mail, label: 'Email' },
    { type: 'phone', value: data.personalInfo.phone, icon: Phone, label: 'Phone' },
    { type: 'address', value: data.personalInfo.address, icon: MapPin, label: 'Address' },
    { type: 'linkedin', value: data.personalInfo.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { type: 'github', value: data.personalInfo.github, icon: Github, label: 'GitHub' },
    { type: 'website', value: data.personalInfo.website, icon: Globe, label: 'Website' },
  ].filter(item => item.value);

  const containerClasses = cn(
    "flex flex-wrap items-center",
    personalDetailsAlign === 'center' ? "justify-center" : 
    personalDetailsAlign === 'right' ? "justify-end" : "justify-start",
    personalDetailsArrangement === 'row' ? "gap-x-4" : 
    personalDetailsArrangement === 'wrap' ? "gap-x-4 gap-y-1" : 
    "gap-x-2 gap-y-1",
    className
  );

  const separator = personalDetailsArrangement === 'bullet' ? '•' : 
                    personalDetailsArrangement === 'line' ? '|' : null;

  return (
    <div className={containerClasses}>
      {items.map((item, index) => (
        <React.Fragment key={item.type}>
          <div className={cn("flex items-center gap-1.5", itemClassName)}>
            {personalDetailsIconStyle !== 'none' && personalDetailsIconStyle !== 'text' && (
               <item.icon 
                 size={12} 
                 className={cn(
                   "shrink-0",
                   personalDetailsIconStyle === 'filled' && "fill-current"
                 )}
                 style={{ color: iconColor || 'inherit' }}
               />
            )}
            {personalDetailsIconStyle === 'text' && (
              <span className="font-bold opacity-70 shrink-0">{item.label}:</span>
            )}
            <span className="break-all">{item.value}</span>
          </div>
          {separator && index < items.length - 1 && (
            <span className="mx-1 opacity-40">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function ProfilePhoto({ data, className, defaultBorderColor }: { data: ResumeData; className?: string; defaultBorderColor?: string }) {
  if (!data.personalInfo.profileImage) return null;
  
  const photoStyle = getPhotoStyle(data);
  const borderStyle = photoStyle.borderStyle || (defaultBorderColor ? { border: `4px solid ${defaultBorderColor}` } : undefined);
  
  return (
    <div className={cn(photoStyle.size, photoStyle.shape, photoStyle.position, "overflow-hidden", className)} style={borderStyle}>
      <img
        src={data.personalInfo.profileImage}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

// Helper functions to get styling values from settings
function getAccentColor(data: ResumeData): string {
  return data.settings?.accentColor || '#7c3aed';
}

function getSectionSpacing(data: ResumeData): string {
  const spacing = data.settings?.sectionSpacing || 'normal';
  switch (spacing) {
    case 'compact': return 'space-y-3';
    case 'relaxed': return 'space-y-10';
    default: return 'space-y-6';
  }
}

function getEntrySpacing(data: ResumeData): string {
  const spacing = data.settings?.entrySpacing || 8;
  return `${spacing}px`;
}

function getFontFamily(data: ResumeData): string {
  return data.settings?.fontFamily || '"Inter", sans-serif';
}

function getFontSize(data: ResumeData): number {
  return data.settings?.fontSize || 10;
}

function getLineHeight(data: ResumeData): number {
  return data.settings?.lineHeight || 1.25;
}

function getMargins(data: ResumeData): { lr: number; tb: number } {
  return {
    lr: data.settings?.leftRightMargin || 20,
    tb: data.settings?.topBottomMargin || 15
  };
}

function getPhotoStyle(data: ResumeData): { size: string; shape: string; position: string; borderStyle?: React.CSSProperties } {
  const settings = data.settings || {};
  const accentColor = getAccentColor(data);
  
  const sizeMap: Record<string, string> = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
    xlarge: 'w-40 h-40'
  };
  
  const shapeMap: Record<string, string> = {
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-none'
  };
  
  const positionMap: Record<string, string> = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto'
  };
  
  const borderStyle = settings.photoBorder ? {
    border: `4px solid ${settings.photoBorderColor || accentColor}`,
  } : undefined;
  
  return {
    size: sizeMap[settings.photoSize || 'medium'],
    shape: shapeMap[settings.photoShape || 'circle'],
    position: positionMap[settings.photoPosition || 'center'],
    borderStyle
  };
}

function getContainerStyle(data: ResumeData): React.CSSProperties {
  const margins = getMargins(data);
  const style: React.CSSProperties = {
    padding: `${margins.tb}mm ${margins.lr}mm`,
    fontFamily: getFontFamily(data),
    fontSize: `${getFontSize(data)}pt`,
    lineHeight: getLineHeight(data),
    backgroundColor: 'white',
    color: '#1f2937',
    position: 'relative',
    boxSizing: 'border-box',
    fontVariantNumeric: 'tabular-nums',
    minHeight: 'var(--resume-page-height, 11in)',
    height: '100%',
  };

  if (data.settings?.showBorder) {
    const color = getAccentColor(data);
    const sides = data.settings.borderSides || { top: true, bottom: true, left: true, right: true };
    if (sides.top) style.borderTop = `4px solid ${color}`;
    if (sides.bottom) style.borderBottom = `4px solid ${color}`;
    if (sides.left) style.borderLeft = `4px solid ${color}`;
    if (sides.right) style.borderRight = `4px solid ${color}`;
  }

  return style;
}

function getSidebarContainerStyle(data: ResumeData, sidebarColor?: string, sidebarWidth?: number, mainBgColor?: string, position: 'left' | 'right' = 'left'): React.CSSProperties {
  const style: React.CSSProperties = {
    fontFamily: getFontFamily(data),
    fontSize: `${getFontSize(data)}pt`,
    lineHeight: getLineHeight(data),
    backgroundColor: 'white',
    color: '#1f2937',
    position: 'relative',
    boxSizing: 'border-box',
    fontVariantNumeric: 'tabular-nums',
    minHeight: 'var(--resume-page-height, 11in)',
    height: '100%',
    padding: 0,
  };

    if (sidebarColor && sidebarWidth !== undefined) {
      const mainBg = mainBgColor || 'white';
      const direction = position === 'left' ? 'to right' : 'to left';
      style.background = `linear-gradient(${direction}, ${sidebarColor} ${sidebarWidth}%, ${mainBg} ${sidebarWidth}%)`;
      style.backgroundSize = '100% var(--resume-page-height, 11in)';
      style.backgroundRepeat = 'repeat-y';
    }

  return style;
}

function getJobTitleStyle(data: ResumeData, accentColor: string): React.CSSProperties {
  const style: React.CSSProperties = {
    fontSize: '1.2em',
    fontWeight: 600,
    lineHeight: '1.2',
  };
  if (data.settings?.applyAccentTo?.jobTitle) {
    style.color = accentColor;
  }
  return style;
}

function getSummaryStyle(data: ResumeData): React.CSSProperties {
  return getBodyStyle(data);
}

function getBodyStyle(data: ResumeData): React.CSSProperties {
  return {
    fontSize: '0.85em',
    lineHeight: 'inherit',
    whiteSpace: 'pre-line',
  };
}

function getNameSize(data: ResumeData): string {
  const size = data.settings?.nameSize || 'large';
  switch (size) {
    case 'small': return '1.5em';
    case 'medium': return '2em';
    case 'large': return '2.5em';
    case 'xlarge': return '3.5em';
    default: return '2.5em';
  }
}

function getNameStyle(data: ResumeData): React.CSSProperties {
  const style: React.CSSProperties = {
    fontSize: getNameSize(data),
  };
  if (data.settings?.nameBold !== false) {
    style.fontWeight = 800;
  }
  if (data.settings?.applyAccentTo?.name) {
    style.color = getAccentColor(data);
  }
  if (data.settings?.nameFont === 'creative') {
    style.fontFamily = '"Playfair Display", serif';
  }
  return style;
}

function getNameAlign(data: ResumeData): string {
  const align = data.settings?.nameAlign || 'left';
  switch (align) {
    case 'left': return 'text-left';
    case 'center': return 'text-center';
    case 'right': return 'text-right';
    default: return 'text-left';
  }
}

function NameDisplay({ data, className, style }: { data: ResumeData; className?: string; style?: React.CSSProperties }) {
  const nameStyle = getNameStyle(data);
  const alignment = getNameAlign(data);
  const arrangement = data.settings?.nameArrangement || 'row';
  const firstName = data.personalInfo.firstName || '';
  const lastName = data.personalInfo.lastName || '';
  
  const combinedStyle = { ...nameStyle, ...style };
  
  if (arrangement === 'row') {
    return (
      <h1 className={cn("font-bold leading-tight", alignment, className)} style={combinedStyle}>
        {firstName} {lastName}
      </h1>
    );
  } else if (arrangement === 'stacked') {
    return (
      <h1 className={cn("font-bold leading-tight", alignment, className)} style={combinedStyle}>
        {firstName}<br />{lastName}
      </h1>
    );
  } else {
    return (
      <h1 className={cn("font-bold leading-tight", alignment, className)} style={combinedStyle}>
        {lastName}<br />{firstName}
      </h1>
    );
  }
}

function getHeadingSize(data: ResumeData): string {
  const size = data.settings?.headingSize || 'medium';
  switch (size) {
    case 'small': return '1.1em';
    case 'medium': return '1.3em';
    case 'large': return '1.6em';
    default: return '1.3em';
  }
}

function getHeadingCapitalization(data: ResumeData): string {
  const cap = data.settings?.headingCapitalization || 'uppercase';
  return cap === 'uppercase' ? 'uppercase' : 'capitalize';
}

function getHeadingStyle(data: ResumeData, accentColor: string): React.CSSProperties {
  const style: React.CSSProperties = {
    fontSize: getHeadingSize(data),
  };
  const headingStyle = data.settings?.headingStyle || 'line-below';
  
  if (data.settings?.applyAccentTo?.headings) {
    style.color = accentColor;
  }
  
  if (headingStyle === 'line-below') {
    style.borderBottom = data.settings?.applyAccentTo?.headingsLine 
      ? `2px solid ${accentColor}` 
      : '2px solid currentColor';
    style.paddingBottom = '4px';
  } else if (headingStyle === 'line-above') {
    style.borderTop = data.settings?.applyAccentTo?.headingsLine 
      ? `2px solid ${accentColor}` 
      : '2px solid currentColor';
    style.paddingTop = '4px';
  } else if (headingStyle === 'line-both') {
    const border = data.settings?.applyAccentTo?.headingsLine 
      ? `2px solid ${accentColor}` 
      : '2px solid currentColor';
    style.borderTop = border;
    style.borderBottom = border;
    style.paddingTop = '4px';
    style.paddingBottom = '4px';
  } else if (headingStyle === 'box') {
    style.backgroundColor = data.settings?.applyAccentTo?.headingsLine 
      ? `${accentColor}15` 
      : '#f3f4f6';
    style.padding = '4px 8px';
    style.borderRadius = '4px';
  } else if (headingStyle === 'none') {
    style.borderTop = 'none';
    style.borderBottom = 'none';
    style.borderLeft = 'none';
    style.borderRight = 'none';
  }
  
  return style;
}

function getSkillsDisplay(data: ResumeData, skills: Array<{ id: string; name: string; level?: string }>, accentColor: string) {
  const display = data.settings?.skillsDisplay || 'bubble';
  
  switch (display) {
    case 'grid':
      return (
        <div className="grid grid-cols-2 gap-2">
          {skills.map(skill => (
            <div key={skill.id} className="flex justify-between items-baseline" style={{ fontSize: '0.9em' }}>
              <span>{skill.name}</span>
              {skill.level && <span className="text-gray-400" style={{ fontSize: '0.8em' }}>{skill.level}</span>}
            </div>
          ))}
        </div>
      );
    case 'level':
      return (
        <div className="space-y-2">
          {skills.map(skill => (
            <div key={skill.id} style={{ fontSize: '0.9em' }}>
              <div className="flex justify-between mb-1">
                <span>{skill.name}</span>
                <span className="text-gray-400" style={{ fontSize: '0.8em' }}>{skill.level}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    backgroundColor: accentColor,
                    width: skill.level === 'Expert' ? '100%' : 
                           skill.level === 'Advanced' ? '75%' : 
                           skill.level === 'Intermediate' ? '50%' : '25%'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      );
    case 'compact':
      return (
        <p style={{ fontSize: '0.9em' }}>{skills.map(s => s.name).join(', ')}</p>
      );
    case 'text':
      return (
        <div className="space-y-1">
          {skills.map(skill => (
            <div key={skill.id} style={{ fontSize: '0.9em' }}>{skill.name}</div>
          ))}
        </div>
      );
    case 'dots':
      return (
        <div className="space-y-2">
          {skills.map(skill => (
            <div key={skill.id} className="flex items-center gap-2" style={{ fontSize: '0.9em' }}>
              <span>{skill.name}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <span 
                    key={i} 
                    className="w-2 h-2 rounded-full"
                    style={{ 
                      backgroundColor: i <= (skill.level === 'Expert' ? 5 : 
                                           skill.level === 'Advanced' ? 4 : 
                                           skill.level === 'Intermediate' ? 3 : 2)
                        ? accentColor : '#e5e7eb'
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case 'bar':
      return (
        <div className="space-y-2">
          {skills.map(skill => (
            <div key={skill.id} style={{ fontSize: '0.9em' }}>
              <span>{skill.name}</span>
              <div className="h-2 bg-gray-200 rounded mt-1">
                <div 
                  className="h-full rounded" 
                  style={{ 
                    backgroundColor: accentColor,
                    width: skill.level === 'Expert' ? '100%' : 
                           skill.level === 'Advanced' ? '75%' : 
                           skill.level === 'Intermediate' ? '50%' : '25%'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      );
    case 'bubble':
    default:
      return (
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span 
              key={skill.id} 
              className="px-2 py-1 rounded font-bold"
              style={{ 
                fontSize: '0.75em',
                backgroundColor: data.settings?.applyAccentTo?.iconsBars ? `${accentColor}15` : '#f3f4f6',
                color: data.settings?.applyAccentTo?.iconsBars ? accentColor : '#374151'
              }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      );
  }
}

function getLanguagesDisplay(data: ResumeData, languages: Array<{ id: string; name: string; level?: string }>, accentColor: string) {
    const display = data.settings?.languagesDisplay || 'text';
    
    switch (display) {
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-2">
            {languages.map(lang => (
              <div key={lang.id} className="flex justify-between items-baseline" style={{ fontSize: '0.9em' }}>
                <span className="font-medium">{lang.name}</span>
                <span className="text-gray-400" style={{ fontSize: '0.8em' }}>{lang.level}</span>
              </div>
            ))}
          </div>
        );
      case 'compact':
        return (
          <p style={{ fontSize: '0.9em' }}>{languages.map(l => `${l.name} (${l.level})`).join(', ')}</p>
        );
      case 'bubble':
        return (
          <div className="flex flex-wrap gap-2">
            {languages.map(lang => (
              <span 
                key={lang.id} 
                className="px-2 py-1 rounded font-medium"
                style={{ fontSize: '0.75em', backgroundColor: `${accentColor}15`, color: accentColor }}
              >
                {lang.name}
              </span>
            ))}
          </div>
        );
      case 'dots':
        return (
          <div className="space-y-2">
            {languages.map(lang => (
              <div key={lang.id} className="flex items-center gap-2" style={{ fontSize: '0.9em' }}>
                <span>{lang.name}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span 
                      key={i} 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        backgroundColor: i <= (lang.level === 'Native' ? 5 : 
                                             lang.level === 'Fluent' ? 4 : 
                                             lang.level === 'Conversational' ? 3 : 2)
                          ? accentColor : '#e5e7eb'
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 'bar':
        return (
          <div className="space-y-2">
            {languages.map(lang => (
              <div key={lang.id} style={{ fontSize: '0.9em' }}>
                <span>{lang.name}</span>
                <div className="h-2 bg-gray-200 rounded mt-1">
                  <div 
                    className="h-full rounded" 
                    style={{ 
                      backgroundColor: accentColor,
                      width: lang.level === 'Native' ? '100%' : 
                             lang.level === 'Fluent' ? '80%' : 
                             lang.level === 'Conversational' ? '60%' : '40%'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      case 'text':
      default:
        return (
          <div className="space-y-2">
            {languages.map(lang => (
              <div key={lang.id} className="flex justify-between items-baseline" style={{ fontSize: '0.9em' }}>
                <span className="font-medium">{lang.name}</span>
                <span className="text-gray-400" style={{ fontSize: '0.8em' }}>{lang.level}</span>
              </div>
            ))}
          </div>
        );
    }
  }
  
  function getDateStyle(data: ResumeData): React.CSSProperties {

  const style: React.CSSProperties = {};
  if (data.settings?.reduceDateLocationOpacity) {
    style.opacity = 0.6;
  }
  if (data.settings?.applyAccentTo?.dates) {
    style.color = getAccentColor(data);
  }
  return style;
}

function getEntryTitleStyle(data: ResumeData): React.CSSProperties {
  const style: React.CSSProperties = {};
  const titleSize = data.settings?.entryTitleSize || 'medium';
  
  switch (titleSize) {
    case 'small': style.fontSize = '1em'; break;
    case 'large': style.fontSize = '1.25em'; break;
    default: style.fontSize = '1.1em';
  }
  
  return style;
}

function getEntrySubtitleStyle(data: ResumeData, accentColor: string): React.CSSProperties {
  const style: React.CSSProperties = {};
  const subtitleStyle = data.settings?.entrySubtitleStyle || 'normal';
  
  if (subtitleStyle === 'bold') style.fontWeight = 600;
  if (subtitleStyle === 'italic') style.fontStyle = 'italic';
  
  if (data.settings?.applyAccentTo?.jobTitle) {
    style.color = accentColor;
  }
  
  return style;
}

function getListStyleChar(data: ResumeData): string {
  const listStyle = data.settings?.entryListStyle || 'bullet';
  if (listStyle === 'bullet') return '•';
  if (listStyle === 'hyphen') return '-';
  return '';
}

function renderExperienceEntry(exp: any, data: ResumeData, accentColor: string) {
  const order = data.settings?.experienceOrder || 'title-employer';
  const subtitlePlacement = data.settings?.entrySubtitlePlacement || 'next-line';
  const indent = data.settings?.entryDescriptionIndent;
  const listChar = getListStyleChar(data);
  const dateStyle = getDateStyle(data);
  const titleStyle = getEntryTitleStyle(data);
  const subtitleStyle = getEntrySubtitleStyle(data, accentColor);
  
  const title = order === 'title-employer' ? exp.position : exp.company;
  const subtitle = order === 'title-employer' ? exp.company : exp.position;
  
  return (
    <div key={exp.id} className="resume-entry" style={{ marginBottom: getEntrySpacing(data) }}>
      <div className="flex justify-between items-baseline">
        <div className={subtitlePlacement === 'same-line' ? 'flex items-baseline gap-2' : ''}>
          <h3 className="font-bold text-gray-900" style={titleStyle}>{title}</h3>
          {subtitlePlacement === 'same-line' && (
            <span style={{ fontSize: '0.9em', ...subtitleStyle }}>{subtitle}</span>
          )}
        </div>
        <span style={{ fontSize: '0.8em', color: '#6b7280', ...dateStyle }}>
          {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
        </span>
      </div>
      {subtitlePlacement === 'next-line' && (
        <p style={{ fontSize: '0.9em', ...subtitleStyle }}>{subtitle}</p>
      )}
      {exp.description && (
        <div className={cn("mt-2 text-gray-600", indent && "pl-4")} style={getBodyStyle(data)}>
          {listChar ? (
            <ul className="space-y-1">
              {exp.description.split('\n').filter(Boolean).map((line: string, i: number) => (
                <li key={i} className="flex gap-2">
                  <span>{listChar}</span>
                  <span>{line.replace(/^[•\-]\s*/, '')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="whitespace-pre-line">{exp.description}</p>
          )}
        </div>
      )}
    </div>
  );
}

function renderEducationEntry(edu: any, data: ResumeData, accentColor: string) {
  const order = data.settings?.educationOrder || 'degree-school';
  const dateStyle = getDateStyle(data);
  const titleStyle = getEntryTitleStyle(data);
  const subtitleStyle = getEntrySubtitleStyle(data, accentColor);
  
  const title = order === 'degree-school' ? edu.degree : edu.school;
  const subtitle = order === 'degree-school' ? edu.school : edu.degree;
  
  return (
    <div key={edu.id} className="resume-entry" style={{ marginBottom: getEntrySpacing(data) }}>
      <div className="resume-entry-header flex justify-between items-baseline">
        <h3 className="font-bold text-gray-900" style={titleStyle}>{title}</h3>
        <span style={{ fontSize: '0.8em', color: '#6b7280', ...dateStyle }}>
          {edu.startDate} — {edu.endDate}
        </span>
      </div>
      <p className="resume-entry-header" style={{ fontSize: '0.9em', ...subtitleStyle }}>{subtitle}</p>
    </div>
  );
}

function renderPublicationEntry(pub: any, data: ResumeData, accentColor: string) {
  const dateStyle = getDateStyle(data);
  const titleStyle = getEntryTitleStyle(data);
  
  return (
    <div key={pub.id} className="resume-entry" style={{ marginBottom: getEntrySpacing(data) }}>
      <div className="resume-entry-header flex justify-between items-baseline">
        <h3 className="font-bold text-gray-900" style={titleStyle}>{pub.title}</h3>
        {pub.date && (
          <span style={{ fontSize: '0.8em', color: '#6b7280', ...dateStyle }}>
            {pub.date}
          </span>
        )}
      </div>
      <p style={{ fontSize: '0.9em', color: accentColor }}>{pub.publisher}</p>
      {pub.authors && (
        <p style={{ fontSize: '0.85em', color: '#6b7280', fontStyle: 'italic' }}>{pub.authors}</p>
      )}
      {pub.description && (
        <p className="mt-1 text-gray-600" style={getBodyStyle(data)}>{pub.description}</p>
      )}
    </div>
  );
}

// Ensure hex is 6 digits
function normalizeHex(hex: string): string {
  if (!hex) return '000000';
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    return hex.split('').map(char => char + char).join('');
  }
  return hex;
}

// Helper to adjust color brightness (positive = lighter, negative = darker)
function adjustColorBrightness(hex: string, percent: number): string {
  try {
    if (!hex || !hex.startsWith('#')) return hex;

    // Normalize hex to 6 digits
    const cleanHex = normalizeHex(hex);
    if (cleanHex.length !== 6) return hex;

    // Parse hex to RGB
    let r = parseInt(cleanHex.substring(0, 2), 16);
    let g = parseInt(cleanHex.substring(2, 4), 16);
    let b = parseInt(cleanHex.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) return hex;

    // Adjust brightness
    r = Math.min(255, Math.max(0, r + (percent * 2.55)));
    g = Math.min(255, Math.max(0, g + (percent * 2.55)));
    b = Math.min(255, Math.max(0, b + (percent * 2.55)));

    // Convert back to hex
    const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch (e) {
    console.error('Error adjusting color brightness', e);
    return hex;
  }
}

// Helper to get contrast text color (black or white) based on background brightness
function getContrastColor(hex: string): string {
  try {
    if (!hex || !hex.startsWith('#')) return '#ffffff';

    const cleanHex = normalizeHex(hex);
    if (cleanHex.length !== 6) return '#ffffff';

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    // Calculate luminance (YIQ formula)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
  } catch (e) {
    return '#ffffff';
  }
}

// 1. MODERN
export function ModernTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const containerStyle = getContainerStyle(data);

  return (
    <div className="bg-white" style={containerStyle}>
      <header className="mb-8 border-b-4 pb-4" style={{ borderColor: accentColor }}>
        <NameDisplay data={data} className="uppercase tracking-tighter" />
        <p className="font-bold" style={jobTitleStyle}>
          {data.personalInfo.jobTitle}
        </p>
        <PersonalDetails 
          data={data} 
          className="mt-3 font-medium text-gray-500" 
          itemClassName="text-[0.9em]"
          iconColor={accentColor}
        />
      </header>
      <div className="grid grid-cols-3 gap-10">
        <div className={cn("col-span-2", sectionSpacing)}>
          <Section title="Summary" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={<p style={summaryStyle}>{data.personalInfo.summary}</p>} />
          <Section title="Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            <div>
              {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
            </div>
          } />
            {(data.certificates || []).length > 0 && (
              <Section title="Certificates" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
                <div>
                  {(data.certificates || []).map(cert => (
                    <div key={cert.id} style={{ marginBottom: getEntrySpacing(data) }}>
                      <h4 className="font-bold" style={{ fontSize: '1em' }}>{cert.name}</h4>
                      <p style={{ fontSize: '0.9em', color: accentColor }}>{cert.issuer} | {cert.date}</p>
                    </div>
                  ))}
                </div>
              } />
            )}
            {(data.publications || []).length > 0 && (
              <Section title="Publications" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
                <div>
                  {(data.publications || []).map(pub => renderPublicationEntry(pub, data, accentColor))}
                </div>
              } />
            )}
          </div>
          <div className={sectionSpacing}>
            <Section title="Skills" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              getSkillsDisplay(data, data.skills || [], accentColor)
            } />
            <Section title="Education" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div>
                {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
              </div>
            } />
            {(data.languages || []).length > 0 && (
              <Section title="Languages" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
                getLanguagesDisplay(data, data.languages || [], accentColor)
              } />
            )}
          </div>
        </div>
      </div>
    );
  }

// 2. MINIMAL
export function MinimalTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
    const nameStyle = getNameStyle(data);
    const jobTitleStyle = getJobTitleStyle(data, accentColor);
    const summaryStyle = getSummaryStyle(data);
    const containerStyle = getContainerStyle(data);

    return (
      <div className="bg-white" style={containerStyle}>
        <header className="text-center mb-12">
          <NameDisplay data={data} className="uppercase tracking-widest mb-2" />
          <p className="tracking-widest uppercase font-medium" style={{ ...jobTitleStyle, fontSize: '0.9em' }}>
            {data.personalInfo.jobTitle}
          </p>
        <PersonalDetails 
          data={data} 
          className="mt-6 uppercase tracking-widest font-medium" 
          itemClassName="text-[0.8em] text-gray-600"
          iconColor={accentColor}
        />
      </header>
      
      <div className={cn("max-w-2xl mx-auto", sectionSpacing)}>
        <section>
          <p className="italic text-center font-normal" style={{ ...summaryStyle, fontSize: '1.1em' }}>"{data.personalInfo.summary}"</p>
        </section>

        <Section title="Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <div>
            {(data.experience || []).map(exp => (
              <div key={exp.id} className="grid grid-cols-4 gap-4" style={{ marginBottom: getEntrySpacing(data) }}>
                <span style={{ fontSize: '0.8em', color: '#4b5563', paddingTop: '0.25rem', ...getDateStyle(data) }} className="uppercase tracking-wider font-bold">{exp.startDate} — {exp.endDate}</span>
                <div className="col-span-3 border-l-2 border-gray-100 pl-4">
                  <h3 className="font-bold text-gray-900" style={getEntryTitleStyle(data)}>{exp.position}</h3>
                  <p style={{ fontSize: '0.9em', color: '#4b5563', marginBottom: '0.5rem', ...getEntrySubtitleStyle(data, accentColor) }} className="uppercase font-bold tracking-wide">{exp.company}</p>
                  <p style={getBodyStyle(data)}>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        } />

        <Section title="Education" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <div>
            {(data.education || []).map(edu => (
              <div key={edu.id} className="grid grid-cols-4 gap-4" style={{ marginBottom: getEntrySpacing(data) }}>
                <span style={{ fontSize: '0.8em', color: '#4b5563', paddingTop: '0.25rem', ...getDateStyle(data) }} className="uppercase tracking-wider font-bold">{edu.startDate} — {edu.endDate}</span>
                <div className="col-span-3 border-l-2 border-gray-100 pl-4">
                  <h3 className="font-bold text-gray-900" style={getEntryTitleStyle(data)}>{edu.degree}</h3>
                  <p style={{ fontSize: '0.9em', color: '#4b5563', marginBottom: '0.25rem', ...getEntrySubtitleStyle(data, accentColor) }} className="uppercase font-bold tracking-wide">{edu.school}</p>
                </div>
              </div>
            ))}
          </div>
        } />

        <div className="grid grid-cols-2 gap-8">
          <Section title="Skills" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            getSkillsDisplay(data, data.skills || [], accentColor)
          } />

          {(data.languages || []).length > 0 && (
            <Section title="Languages" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              getLanguagesDisplay(data, data.languages || [], accentColor)
            } />
          )}
        </div>

          {(data.certificates || []).length > 0 && (
            <Section title="Certificates" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div className="grid grid-cols-2 gap-4">
                {(data.certificates || []).map(cert => (
                  <div key={cert.id} className="border-l-2 border-gray-100 pl-4" style={{ marginBottom: getEntrySpacing(data) }}>
                    <h3 className="font-bold text-gray-900" style={{ fontSize: '1em' }}>{cert.name}</h3>
                    <p style={{ fontSize: '0.9em', color: '#4b5563' }}>{cert.issuer} | {cert.date}</p>
                  </div>
                ))}
              </div>
            } />
          )}

          {(data.publications || []).length > 0 && (
            <Section title="Publications" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div>
                {(data.publications || []).map(pub => renderPublicationEntry(pub, data, accentColor))}
              </div>
            } />
          )}
        </div>
      </div>
    );
  }

// 3. CORPORATE
export function CorporateTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const sidebarWidth = data.settings?.columnWidth || 33;
  const sidebarColor = adjustColorBrightness(accentColor, -60);
  const sidebarTextColor = getContrastColor(sidebarColor);
  const sidebarAccentColor = sidebarTextColor === '#ffffff' ? adjustColorBrightness(accentColor, 40) : adjustColorBrightness(accentColor, -20);
  const containerStyle = getSidebarContainerStyle(data, sidebarColor, sidebarWidth, '#f8fafc');

  return (
    <div className="overflow-hidden" style={containerStyle}>
        <div className="flex h-full">
          <div 
            className="p-8 space-y-10 shrink-0" 
            style={{ width: `${sidebarWidth}%`, color: sidebarTextColor }}
          >
          <div className="space-y-2">
              <NameDisplay data={data} style={{ color: sidebarTextColor }} />
              <p className="uppercase tracking-widest" style={{ ...jobTitleStyle, fontSize: '0.9em', color: sidebarAccentColor }}>
                {data.personalInfo.jobTitle}
              </p>
            </div>

            <div className="space-y-4" style={{ fontSize: '0.9em' }}>
              <h2 className="text-xs font-black uppercase tracking-widest border-b pb-2" style={{ color: sidebarAccentColor, borderColor: `${sidebarTextColor}30` }}>Contact</h2>
              <PersonalDetails 
                data={data} 
                className="flex-col !items-start gap-y-2" 
                itemClassName="text-[0.9em]"
                iconColor={sidebarAccentColor}
              />
            </div>

          <div className="space-y-4" style={{ fontSize: '0.9em' }}>
            <h2 className="text-xs font-black uppercase tracking-widest border-b pb-2" style={{ color: sidebarAccentColor, borderColor: `${sidebarTextColor}30` }}>Education</h2>
            <div className="space-y-4" style={{ color: `${sidebarTextColor}CC` }}>
              {(data.education || []).map(edu => (
                <div key={edu.id} style={{ marginBottom: getEntrySpacing(data) }}>
                  <p className="font-bold" style={{ fontSize: '1em', color: sidebarTextColor }}>{edu.degree}</p>
                  <p style={{ fontSize: '0.9em' }}>{edu.school}</p>
                  <p style={{ fontSize: '0.85em', ...getDateStyle(data), opacity: 0.7 }}>{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4" style={{ fontSize: '0.9em' }}>
            <h2 className="text-xs font-black uppercase tracking-widest border-b pb-2" style={{ color: sidebarAccentColor, borderColor: `${sidebarTextColor}30` }}>Skills</h2>
            {getSkillsDisplay(data, data.skills || [], sidebarAccentColor)}
          </div>

          {(data.languages || []).length > 0 && (
            <div className="space-y-4" style={{ fontSize: '0.9em' }}>
              <h2 className="text-xs font-black uppercase tracking-widest border-b pb-2" style={{ color: sidebarAccentColor, borderColor: `${sidebarTextColor}30` }}>Languages</h2>
              {getLanguagesDisplay(data, data.languages || [], sidebarAccentColor)}
            </div>
          )}
        </div>

        <div className={cn("flex-1 p-12 bg-slate-50", sectionSpacing)}>
          <Section title="Profile" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            <p style={{ ...summaryStyle, color: '#475569' }}>{data.personalInfo.summary}</p>
          } />

          <Section title="Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            <div>
              {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
            </div>
          } />

          {(data.certificates || []).length > 0 && (
            <Section title="Certificates" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div className="grid grid-cols-2 gap-6">
                {(data.certificates || []).map(cert => (
                  <div key={cert.id} style={{ marginBottom: getEntrySpacing(data) }}>
                    <h3 className="font-bold text-slate-800" style={{ fontSize: '1em' }}>{cert.name}</h3>
                    <p style={{ fontSize: '0.9em', color: accentColor }}>{cert.issuer} | {cert.date}</p>
                  </div>
                ))}
              </div>
            } />
          )}
        </div>
      </div>
    </div>
  );
}

// 4. CREATIVE
export function CreativeTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const containerStyle = getContainerStyle(data);

  return (
      <div className="bg-amber-50" style={containerStyle}>
        <div className="border-8 border-black p-8">
            <header className="mb-12">
            <div className="bg-black text-white inline-block px-4 py-2 mb-4" style={{ backgroundColor: data.settings?.applyAccentTo?.name ? accentColor : undefined }}>
              <NameDisplay data={data} className="font-black" style={{ color: 'white' }} />
            </div>
            <p className="font-bold italic" style={{ ...jobTitleStyle, fontSize: '1.5em' }}>
              {data.personalInfo.jobTitle}
            </p>
            <PersonalDetails 
              data={data} 
              className="mt-2 font-bold" 
              itemClassName="text-[0.9em]"
              iconColor="#000"
            />
          </header>

        <div className={sectionSpacing}>
          <section className="grid grid-cols-4 gap-8">
            <h2 className="font-black uppercase border-r-4 border-black pr-4 text-right" style={{ fontSize: '1.2em', borderColor: accentColor }}>About</h2>
            <p className="col-span-3 font-medium" style={{ ...summaryStyle, fontSize: '1.1em' }}>{data.personalInfo.summary}</p>
          </section>

          <section className="grid grid-cols-4 gap-8">
            <h2 className="font-black uppercase border-r-4 border-black pr-4 text-right" style={{ fontSize: '1.2em', borderColor: accentColor }}>Work</h2>
            <div className="col-span-3">
              {(data.experience || []).map(exp => (
                <div key={exp.id} className="relative" style={{ marginBottom: getEntrySpacing(data) }}>
                  <div className="absolute -left-[36px] w-4 h-4 bg-black rounded-full" style={{ backgroundColor: accentColor }} />
                  <h3 className="font-black" style={getEntryTitleStyle(data)}>{exp.position} @ {exp.company}</h3>
                  <p className="font-bold mb-2" style={{ fontSize: '0.9em', ...getDateStyle(data) }}>{exp.startDate} — {exp.endDate}</p>
                  <p style={getBodyStyle(data)}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-4 gap-8">
            <h2 className="font-black uppercase border-r-4 border-black pr-4 text-right" style={{ fontSize: '1.2em', borderColor: accentColor }}>Education</h2>
            <div className="col-span-3">
              {(data.education || []).map(edu => (
                <div key={edu.id} style={{ marginBottom: getEntrySpacing(data) }}>
                  <h3 className="font-black" style={getEntryTitleStyle(data)}>{edu.degree}</h3>
                  <p className="font-bold" style={{ fontSize: '1em', ...getEntrySubtitleStyle(data, accentColor) }}>{edu.school}</p>
                  <p style={{ fontSize: '0.9em', ...getDateStyle(data) }}>{edu.startDate} — {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-4 gap-8">
            <h2 className="font-black uppercase border-r-4 border-black pr-4 text-right" style={{ fontSize: '1.2em', borderColor: accentColor }}>Skills</h2>
            <div className="col-span-3">
              {getSkillsDisplay(data, data.skills || [], accentColor)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


// 5. TECHNICAL
export function TechnicalTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const containerStyle = getContainerStyle(data);

  return (
      <div className="bg-white" style={containerStyle}>
        <div className={cn("border border-gray-300 p-6", sectionSpacing)}>
          <header className="flex justify-between items-center border-b pb-4">
            <div>
              <NameDisplay data={data} />
              <p className="text-gray-500 font-medium" style={jobTitleStyle}>
                {data.personalInfo.jobTitle}
              </p>
            </div>
            <PersonalDetails 
              data={data} 
              className="text-right" 
              itemClassName="text-[0.85em] text-gray-600"
              iconColor={accentColor}
            />
          </header>

        <Section title="_SUMMARY" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <p className="px-2" style={summaryStyle}>{data.personalInfo.summary}</p>
        } />

        <Section title="_SKILLS" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <div className="px-2">
            {getSkillsDisplay(data, data.skills || [], accentColor)}
          </div>
        } />

        <Section title="_EXPERIENCE" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <div className="px-2">
            {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
          </div>
        } />

        <Section title="_EDUCATION" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <div className="px-2">
            {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
          </div>
        } />
      </div>
    </div>
  );
}



// 7. ELEGANT
export function ElegantTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const containerStyle = getContainerStyle(data);

  return (
      <div className="bg-stone-50" style={containerStyle}>
        <header className="text-center py-12 px-10 bg-stone-100 border-b border-stone-200 space-y-4 -m-[inherit] mb-10">
          <NameDisplay data={data} className="font-normal tracking-wide text-stone-900 italic" />
          <div className="h-px w-24 bg-stone-400 mx-auto my-4" style={{ backgroundColor: accentColor }} />
          <p className="tracking-[0.3em] uppercase text-stone-700 font-medium" style={{ ...jobTitleStyle, fontSize: '0.9em' }}>
            {data.personalInfo.jobTitle}
          </p>
        <PersonalDetails 
          data={data} 
          className="mt-4" 
          itemClassName="text-[0.8em] text-stone-600 font-medium"
          iconColor={accentColor}
        />
      </header>
      <div className={sectionSpacing}>
        <section className="text-center max-w-lg mx-auto italic text-stone-800 border-b border-stone-200 pb-8 mb-10">
          <p style={summaryStyle}>{data.personalInfo.summary}</p>
        </section>

        <Section title="Professional Path" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <div>
            {(data.experience || []).map(exp => (
              <div key={exp.id} className="text-center max-w-2xl mx-auto" style={{ marginBottom: getEntrySpacing(data) }}>
                <h3 className="font-bold text-stone-900" style={getEntryTitleStyle(data)}>{exp.position}</h3>
                <p className="text-stone-700 font-medium italic mb-2" style={{ fontSize: '0.9em', ...getEntrySubtitleStyle(data, accentColor) }}>{exp.company} <span className="mx-2 text-stone-400">|</span> <span style={getDateStyle(data)}>{exp.startDate} - {exp.endDate}</span></p>
                <p className="text-stone-800" style={getBodyStyle(data)}>{exp.description}</p>
              </div>
            ))}
          </div>
        } />

        <Section title="Education" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <div>
            {(data.education || []).map(edu => (
              <div key={edu.id} className="text-center" style={{ marginBottom: getEntrySpacing(data) }}>
                <h3 className="font-bold text-stone-900" style={getEntryTitleStyle(data)}>{edu.degree}</h3>
                <p className="text-stone-600 italic" style={{ fontSize: '0.9em', ...getEntrySubtitleStyle(data, accentColor) }}>{edu.school}</p>
                <p style={{ fontSize: '0.8em', color: '#6b7280', marginTop: '0.25rem', ...getDateStyle(data) }}>{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        } />

        <div className="grid grid-cols-2 gap-10 max-w-4xl mx-auto">
          <Section title="Expertise" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            <div className="flex flex-wrap justify-center gap-3">
              {(data.skills || []).map(skill => (
                <span key={skill.id} className="text-stone-800 italic border-b border-stone-300 pb-1" style={{ fontSize: '1em' }}>{skill.name}</span>
              ))}
            </div>
          } />

          {(data.languages || []).length > 0 && (
            <Section title="Languages" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div className="space-y-2 text-center">
                {(data.languages || []).map(lang => (
                  <div key={lang.id} className="text-stone-800">
                    <span className="font-bold">{lang.name}</span> <span className="italic text-stone-600" style={{ fontSize: '0.9em' }}>- {lang.level}</span>
                  </div>
                ))}
              </div>
            } />
          )}
        </div>
      </div>
    </div>
  );
}

// 8. STARTUP
export function StartupTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const containerStyle = getContainerStyle(data);

  return (
      <div className="bg-white" style={containerStyle}>
        <div className="bg-indigo-600 -m-[inherit] p-12 text-white mb-12 rounded-b-[4rem]" style={{ backgroundColor: accentColor }}>
          <NameDisplay data={data} className="font-black mb-2 tracking-tight" style={{ color: 'white' }} />
          <p className="font-medium" style={{ ...jobTitleStyle, fontSize: '1.5em', color: data.settings?.applyAccentTo?.jobTitle ? undefined : 'rgba(255,255,255,0.8)' }}>{data.personalInfo.jobTitle}</p>
        <PersonalDetails 
          data={data} 
          className="mt-8 text-white/90 font-medium" 
          itemClassName="text-[0.9em]"
          iconColor="#fff"
        />
      </div>
      <div className="grid grid-cols-12 gap-12 mt-16 px-8">
        <div className={cn("col-span-8", sectionSpacing)}>
          <Section title="The Story" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            <p className="text-gray-600" style={{ ...summaryStyle, fontSize: '1.1em' }}>{data.personalInfo.summary}</p>
          } />

          <Section title="Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            <div>
              {(data.experience || []).map(exp => (
                <div key={exp.id} className="group relative pl-8 border-l-4 border-indigo-50" style={{ borderColor: `${accentColor}15`, marginBottom: getEntrySpacing(data) }}>
                  <div className="absolute left-[-10px] top-1 w-4 h-4 rounded-full bg-indigo-600" style={{ backgroundColor: accentColor }} />
                  <h3 className="font-bold text-gray-900" style={getEntryTitleStyle(data)}>{exp.position}</h3>
                  <p className="text-indigo-600 font-bold mb-4" style={getEntrySubtitleStyle(data, accentColor)}>{exp.company} &bull; <span style={getDateStyle(data)}>{exp.startDate} - {exp.endDate}</span></p>
                  <p className="text-gray-600" style={getBodyStyle(data)}>{exp.description}</p>
                </div>
              ))}
            </div>
          } />

          <Section title="Education" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            <div>
              {(data.education || []).map(edu => (
                <div key={edu.id} className="group relative pl-8 border-l-4 border-indigo-50" style={{ borderColor: `${accentColor}15`, marginBottom: getEntrySpacing(data) }}>
                  <div className="absolute left-[-10px] top-1 w-4 h-4 rounded-full bg-indigo-300" style={{ backgroundColor: `${accentColor}40` }} />
                  <h3 className="font-bold text-gray-900" style={getEntryTitleStyle(data)}>{edu.degree}</h3>
                  <p className="text-indigo-600 font-medium" style={getEntrySubtitleStyle(data, accentColor)}>{edu.school}</p>
                  <p style={{ fontSize: '0.8em', color: '#6b7280', marginTop: '0.25rem', ...getDateStyle(data) }}>{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          } />
        </div>

        <div className="col-span-4 space-y-12">
          <section className="bg-indigo-50 p-6 rounded-3xl space-y-4" style={{ backgroundColor: `${accentColor}10` }}>
            <h2 className="font-black uppercase" style={{ fontSize: '1.2em', color: accentColor }}>Superpowers</h2>
            <div className="flex flex-wrap gap-2">
              {(data.skills || []).map(s => <span key={s.id} className="bg-white px-3 py-1 rounded-full font-bold shadow-sm" style={{ fontSize: '0.85em', color: accentColor }}>{s.name}</span>)}
            </div>
          </section>

          {(data.languages || []).length > 0 && (
            <section className="bg-indigo-50 p-6 rounded-3xl space-y-4" style={{ backgroundColor: `${accentColor}10` }}>
              <h2 className="font-black uppercase" style={{ fontSize: '1.2em', color: accentColor }}>Languages</h2>
              <div className="space-y-2">
                {(data.languages || []).map(lang => (
                  <div key={lang.id} className="flex justify-between items-center" style={{ fontSize: '0.85em' }}>
                    <span className="font-bold" style={{ color: accentColor }}>{lang.name}</span>
                    <span className="px-2 py-1 rounded-full" style={{ fontSize: '0.8em', backgroundColor: `${accentColor}20`, color: accentColor }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}



// 10. CLASSIC
export function ClassicTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const containerStyle = getContainerStyle(data);

  return (
      <div className="bg-white text-black leading-normal" style={containerStyle}>
        <header className="text-center mb-8 border-b-2 border-black pb-4" style={{ borderColor: accentColor }}>
          <NameDisplay data={data} className="font-bold mb-1 underline" />
        <PersonalDetails 
          data={data} 
          itemClassName="text-[0.9em]"
          iconColor="#000"
        />
        <p className="font-bold mt-1" style={{ ...jobTitleStyle, fontSize: '0.9em' }}>{data.personalInfo.jobTitle}</p>
      </header>
      <div className={sectionSpacing}>
        <Section title="Professional Objective" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <p style={summaryStyle}>{data.personalInfo.summary}</p>
        } />

        <Section title="Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <div>
            {(data.experience || []).map(exp => (
              <div key={exp.id} style={{ marginBottom: getEntrySpacing(data) }}>
                <div className="flex justify-between font-bold">
                  <span>{exp.company}</span>
                  <span style={getDateStyle(data)}>{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="font-bold italic" style={{ ...getEntrySubtitleStyle(data, accentColor), fontSize: '0.95em' }}>{exp.position}</p>
                <p className="mt-1 pl-4 border-l border-gray-200" style={getBodyStyle(data)}>{exp.description}</p>
              </div>
            ))}
          </div>
        } />

        <Section title="Education" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <div>
            {(data.education || []).map(edu => (
              <div key={edu.id} style={{ marginBottom: getEntrySpacing(data) }}>
                <div className="flex justify-between font-bold">
                  <span>{edu.school}</span>
                  <span style={getDateStyle(data)}>{edu.startDate} - {edu.endDate}</span>
                </div>
                <p className="italic pl-4" style={{ ...getEntrySubtitleStyle(data, accentColor), fontSize: '0.95em' }}>{edu.degree}</p>
              </div>
            ))}
          </div>
        } />

        <Section title="Technical Skills" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <p className="pl-4 font-bold" style={{ fontSize: '1em' }}>{(data.skills || []).map(s => s.name).join(', ')}</p>
        } />

        {(data.languages || []).length > 0 && (
          <Section title="Languages" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            <p className="pl-4" style={{ fontSize: '1em' }}>
              {(data.languages || []).map(lang => `${lang.name} (${lang.level})`).join(', ')}
            </p>
          } />
        )}
      </div>
    </div>
  );
}

// 11. MODERN PHOTO
export function ModernPhotoTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const containerStyle = getContainerStyle(data);

  return (
      <div className="bg-white" style={containerStyle}>
        <header className="mb-8 border-b-4 pb-6 flex justify-between items-start" style={{ borderColor: accentColor }}>
            <div className="flex-1">
              <NameDisplay data={data} className="font-black uppercase tracking-tighter mb-2" />
              <p className="font-bold" style={jobTitleStyle}>{data.personalInfo.jobTitle}</p>
            <PersonalDetails 
              data={data} 
              className="mt-4 text-gray-500 font-medium" 
              itemClassName="text-[0.9em]"
              iconColor={accentColor}
            />
          </div>
        {data.personalInfo.profileImage && (
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg ml-6" style={{ borderColor: `${accentColor}20` }}>
            <img
              src={data.personalInfo.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>
      <div className="grid grid-cols-3 gap-10">
        <div className={cn("col-span-2", sectionSpacing)}>
          <Section title="Summary" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={<p style={summaryStyle}>{data.personalInfo.summary}</p>} />
          <Section title="Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            <div>
              {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
            </div>
          } />
            {(data.certificates || []).length > 0 && (
              <Section title="Certificates" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
                <div>
                  {(data.certificates || []).map(cert => (
                    <div key={cert.id} style={{ marginBottom: getEntrySpacing(data) }}>
                      <h4 className="font-bold" style={{ fontSize: '1em' }}>{cert.name}</h4>
                      <p style={{ fontSize: '0.9em', color: accentColor }}>{cert.issuer} | {cert.date}</p>
                    </div>
                  ))}
                </div>
              } />
            )}
            {(data.publications || []).length > 0 && (
              <Section title="Publications" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
                <div>
                  {(data.publications || []).map(pub => renderPublicationEntry(pub, data, accentColor))}
                </div>
              } />
            )}
          </div>
          <div className={sectionSpacing}>
            <Section title="Skills" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              getSkillsDisplay(data, data.skills || [], accentColor)
            } />
            <Section title="Education" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div>
                {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
              </div>
            } />
            {(data.languages || []).length > 0 && (
              <Section title="Languages" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
                getLanguagesDisplay(data, data.languages || [], accentColor)
              } />
            )}
          </div>
        </div>
      </div>
    );
  }



// 13. MERCURY
export function MercuryTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const nameStyle = getNameStyle(data);
  const sidebarWidth = data.settings?.columnWidth || 35;
  const sidebarColor = adjustColorBrightness(accentColor, -60);
  const sidebarTextColor = getContrastColor(sidebarColor);
  const sidebarAccentColor = sidebarTextColor === '#ffffff' ? adjustColorBrightness(accentColor, 40) : adjustColorBrightness(accentColor, -20);
  const containerStyle = getSidebarContainerStyle(data, sidebarColor, sidebarWidth, 'white');

  return (
        <div className="overflow-hidden" style={containerStyle}>
          <div className="flex h-full">
            <div 
              className="p-8 space-y-8 shrink-0" 
              style={{ width: `${sidebarWidth}%`, color: sidebarTextColor }}
            >
          <div className="flex flex-col items-center">
                <ProfilePhoto data={data} className="mb-4" defaultBorderColor={`${sidebarTextColor}30`} />
                <NameDisplay data={data} className="text-center leading-tight" style={{ color: sidebarTextColor }} />
              <p className="mt-1 text-center" style={{ fontSize: '0.9em', color: sidebarAccentColor }}>{data.personalInfo.jobTitle}</p>
            </div>

            <div className="space-y-2 text-[0.9em]">
              <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-2" style={{ color: sidebarAccentColor, borderColor: `${sidebarTextColor}30` }}>Contact</h2>
              <PersonalDetails 
                data={data} 
                className="flex-col !items-start gap-y-1" 
                itemClassName="text-xs"
                iconColor={sidebarAccentColor}
              />
            </div>

          <div className="space-y-2 text-[0.9em]">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-2" style={{ color: sidebarAccentColor, borderColor: `${sidebarTextColor}30` }}>Profile</h2>
            <p className="text-xs leading-relaxed whitespace-pre-line" style={{ ...getBodyStyle(data), color: `${sidebarTextColor}CC` }}>{data.personalInfo.summary}</p>
          </div>

          <div className="space-y-2 text-[0.9em]">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-2" style={{ color: sidebarAccentColor, borderColor: `${sidebarTextColor}30` }}>Skills</h2>
            {getSkillsDisplay(data, data.skills || [], sidebarAccentColor)}
          </div>

          {(data.languages || []).length > 0 && (
            <div className="space-y-2 text-[0.9em]">
              <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-2" style={{ color: sidebarAccentColor, borderColor: `${sidebarTextColor}30` }}>Languages</h2>
              {getLanguagesDisplay(data, data.languages || [], sidebarAccentColor)}
            </div>
          )}
        </div>

        <div className="flex-1 p-8 space-y-6">
          <Section title="Work Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            <div>
              {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
            </div>
          } />

          <Section title="Education" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            <div>
              {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
            </div>
          } />

          {(data.certificates || []).length > 0 && (
            <Section title="Awards & Certificates" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div className="grid grid-cols-2 gap-4">
                {(data.certificates || []).map(cert => (
                  <div key={cert.id} style={{ marginBottom: getEntrySpacing(data) }}>
                    <p className="font-bold text-gray-900" style={{ fontSize: '0.9em' }}>{cert.name}</p>
                    <p className="text-gray-500" style={{ fontSize: '0.8em' }}>{cert.issuer} | {cert.date}</p>
                  </div>
                ))}
              </div>
            } />
          )}
        </div>
      </div>
    </div>
  );
}

// 14. FINANCE
export function FinanceTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const containerStyle = getContainerStyle(data);

  return (
      <div className="bg-white" style={containerStyle}>
        <header className="text-center mb-8 border-b pb-6" style={{ borderColor: `${accentColor}30` }}>
          <NameDisplay data={data} className="font-bold tracking-wide" />
          <p className="font-medium mt-1" style={jobTitleStyle}>{data.personalInfo.jobTitle}</p>
        <PersonalDetails 
          data={data} 
          className="mt-3 font-medium text-gray-600" 
          itemClassName="text-[0.9em]"
          iconColor={accentColor}
        />
      </header>

      <div className={sectionSpacing}>
        <Section title="Summary" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <p className="text-gray-700 font-medium" style={summaryStyle}>{data.personalInfo.summary}</p>
        } />

        <Section title="Work Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <div>
            {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
          </div>
        } />

        <Section title="Education" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
          <div>
            {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
          </div>
        } />

        <div className="grid grid-cols-2 gap-8">
          <Section title="Skills" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
            getSkillsDisplay(data, data.skills || [], accentColor)
          } />

          {(data.languages || []).length > 0 && (
            <Section title="Languages" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              getLanguagesDisplay(data, data.languages || [], accentColor)
            } />
          )}
        </div>
      </div>
    </div>
  );
}

// 15. STEADY FORM
export function SteadyFormTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const sidebarWidth = data.settings?.columnWidth || 35;
  const bgAccent = adjustColorBrightness(accentColor, 50);
  const sidebarColor = `${bgAccent}20`;
  const containerStyle = getSidebarContainerStyle(data, sidebarColor, sidebarWidth, 'white', 'right');

  return (
        <div className="overflow-hidden" style={containerStyle}>
          <div className="flex h-full">
            <div className="flex-1 p-8 space-y-6">
                <header>
                  <NameDisplay data={data} style={{ color: accentColor }} />
                <p className="font-medium" style={jobTitleStyle}>{data.personalInfo.jobTitle}</p>
              <PersonalDetails 
                data={data} 
                className="mt-2 font-medium text-gray-500" 
                itemClassName="text-[0.8em]"
                iconColor={accentColor}
              />
            </header>

          <div className={sectionSpacing}>
            <Section title="Profile" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <p className="text-gray-700 font-medium" style={summaryStyle}>{data.personalInfo.summary}</p>
            } />

            <Section title="Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div>
                {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
              </div>
            } />
          </div>
        </div>

          <div 
            className="p-6 space-y-6 border-l-4 shrink-0" 
            style={{ width: `${sidebarWidth}%`, borderColor: accentColor }}
          >
            <ProfilePhoto data={data} className="mx-auto" defaultBorderColor={`${accentColor}40`} />

            <Section title="Skills" data={data} accentColor={accentColor} showDivider={false} content={
            getSkillsDisplay(data, data.skills || [], accentColor)
          } />

          <Section title="Education" data={data} accentColor={accentColor} showDivider={false} content={
            <div>
              {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
            </div>
          } />

          {(data.languages || []).length > 0 && (
            <Section title="Languages" data={data} accentColor={accentColor} showDivider={false} content={
              getLanguagesDisplay(data, data.languages || [], accentColor)
            } />
          )}
        </div>
      </div>
    </div>
  );
}

// 16. SIMPLY BLUE
export function SimplyBlueTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const sidebarWidth = 2; // Fixed 2px width roughly or 2%? The original was w-2 (8px). 
  // Let's use a small percentage or fixed px in gradient.
  const containerStyle = getSidebarContainerStyle(data, accentColor, 1.5, 'white');

  return (
        <div className="overflow-hidden" style={containerStyle}>
          <div className="flex h-full">
            <div className="w-2 shrink-0" />
            <div className="flex-1 p-8 space-y-6">
              <header className="border-b pb-4" style={{ borderColor: `${accentColor}30` }}>
              <h1 className="font-bold" style={{ ...nameStyle, color: adjustColorBrightness(accentColor, -20) }}>{data.personalInfo.firstName} {data.personalInfo.lastName}</h1>
              <p className="font-medium" style={jobTitleStyle}>{data.personalInfo.jobTitle}</p>
              <PersonalDetails 
                data={data} 
                className="mt-2 font-medium text-gray-500" 
                itemClassName="text-[0.8em]"
                iconColor={accentColor}
              />
            </header>

          <div className={sectionSpacing}>
            <section className="p-4 rounded-lg border-l-4 font-medium" style={{ backgroundColor: `${accentColor}10`, borderColor: accentColor }}>
              <h2 className="font-bold uppercase mb-2" style={{ fontSize: '0.8em', color: accentColor }}>Profile</h2>
              <p className="text-gray-700" style={summaryStyle}>{data.personalInfo.summary}</p>
            </section>

            <Section title="Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div>
                {(data.experience || []).map(exp => (
                  <div key={exp.id} className="pl-4 border-l-2" style={{ borderColor: `${accentColor}20` }}>
                    {renderExperienceEntry(exp, data, accentColor)}
                  </div>
                ))}
              </div>
            } />

            <div className="grid grid-cols-2 gap-8">
              <Section title="Education" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
                <div>
                  {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
                </div>
              } />
              <Section title="Skills" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
                getSkillsDisplay(data, data.skills || [], accentColor)
              } />
            </div>

            {(data.languages || []).length > 0 && (
              <Section title="Languages" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
                getLanguagesDisplay(data, data.languages || [], accentColor)
              } />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 17. HARVARD
export function HarvardTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const containerStyle = getContainerStyle(data);

  return (
      <div className="bg-white" style={containerStyle}>
          <header className="text-center mb-8 border-b-2 border-gray-300 pb-6">
            <NameDisplay data={data} className="font-bold tracking-wider" />
            <p className="font-bold uppercase mt-1 tracking-widest" style={{ fontSize: '0.9em' }}>{data.personalInfo.jobTitle}</p>
          <PersonalDetails 
            data={data} 
            className="mt-3 text-gray-600 font-medium" 
            itemClassName="text-[0.9em]"
            iconColor={accentColor}
          />
        </header>

      <div className={sectionSpacing}>
        <Section title="Education" data={data} accentColor={accentColor} showDivider={true} content={
          <div>
            {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
          </div>
        } />

        <Section title="Experience" data={data} accentColor={accentColor} showDivider={true} content={
          <div>
            {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
          </div>
        } />

        <Section title="Skills" data={data} accentColor={accentColor} showDivider={true} content={
          getSkillsDisplay(data, data.skills || [], accentColor)
        } />

        {(data.languages || []).length > 0 && (
          <Section title="Languages" data={data} accentColor={accentColor} showDivider={true} content={
            getLanguagesDisplay(data, data.languages || [], accentColor)
          } />
        )}
      </div>
    </div>
  );
}

// 18. BLUE STEEL
export function BlueSteelTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const sidebarWidth = data.settings?.columnWidth || 32;
  const sidebarColor = `${accentColor}10`;
  const containerStyle = getSidebarContainerStyle(data, sidebarColor, sidebarWidth, 'white', 'right');
  const darkAccent = adjustColorBrightness(accentColor, -20);

  return (
        <div className="overflow-hidden" style={containerStyle}>
          <div className="flex h-full">
            <div className="flex-1 p-8 space-y-6">
                <header className="mb-4">
                  <NameDisplay data={data} style={{ color: darkAccent }} />
                <p className="font-medium italic" style={{ ...jobTitleStyle, fontSize: '0.9em' }}>{data.personalInfo.jobTitle}</p>
              <PersonalDetails 
                data={data} 
                className="mt-2 font-medium text-gray-500" 
                itemClassName="text-[0.8em]"
                iconColor={accentColor}
              />
            </header>

          <div className={sectionSpacing}>
            <Section title="Summary" data={data} accentColor={accentColor} showDivider={false} content={
              <p className="italic border-l-4 pl-4 text-gray-700 font-medium" style={{ ...summaryStyle, borderColor: `${accentColor}40` }}>{data.personalInfo.summary}</p>
            } />

            <Section title="Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div>
                {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
              </div>
            } />
          </div>
        </div>

          <div 
            className="p-6 space-y-6 shrink-0" 
            style={{ width: `${sidebarWidth}%` }}
          >
            <ProfilePhoto data={data} className="mx-auto" defaultBorderColor={`${accentColor}40`} />

            <Section title="Skills" data={data} accentColor={accentColor} showDivider={false} content={
            getSkillsDisplay(data, data.skills || [], accentColor)
          } />

          <Section title="Education" data={data} accentColor={accentColor} showDivider={false} content={
            <div>
              {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
            </div>
          } />

          {(data.languages || []).length > 0 && (
            <Section title="Languages" data={data} accentColor={accentColor} showDivider={false} content={
              getLanguagesDisplay(data, data.languages || [], accentColor)
            } />
          )}
        </div>
      </div>
    </div>
  );
}



// 21. HUNTER GREEN
export function HunterGreenTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const sidebarWidth = data.settings?.columnWidth || 35;
  const sidebarColor = adjustColorBrightness(accentColor, -20);
  const sidebarTextColor = getContrastColor(sidebarColor);
  const sidebarContentColor = sidebarTextColor === '#ffffff' ? adjustColorBrightness(accentColor, 80) : adjustColorBrightness(accentColor, -20);
  const containerStyle = getSidebarContainerStyle(data, sidebarColor, sidebarWidth, 'white', 'right');

  return (
        <div className="overflow-hidden" style={containerStyle}>
          <div className="flex h-full">
            <div className="flex-1 p-8 space-y-6">
              <header className="mb-6">
              <p className="mb-1 uppercase tracking-widest font-bold" style={{ fontSize: '0.75em', color: '#6b7280' }}>Latest Role</p>
              {(data.experience || []).slice(0, 1).map(exp => (
                <div key={exp.id}>
                  <h3 className="font-bold" style={{ fontSize: '1.2em' }}>{exp.position}</h3>
                  <p className="font-bold" style={{ fontSize: '1em', color: accentColor }}>{exp.company}</p>
                </div>
              ))}
            </header>

            <div className={sectionSpacing}>
              <Section title="Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
                <div>
                  {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
                </div>
              } />

              <Section title="Education" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
                <div>
                  {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
                </div>
              } />
            </div>
          </div>

            <div 
              className="p-6 space-y-6 shrink-0" 
              style={{ width: `${sidebarWidth}%`, color: sidebarTextColor }}
            >
            <div className="text-center">
                <ProfilePhoto data={data} className="mx-auto mb-4" defaultBorderColor={`${sidebarTextColor}30`} />
                <NameDisplay data={data} className="text-center leading-tight" style={{ color: sidebarTextColor }} />
                <p className="mt-1 font-medium" style={{ ...jobTitleStyle, fontSize: '0.9em', color: sidebarContentColor }}>{data.personalInfo.jobTitle}</p>
              </div>

            <div className="text-center font-medium" style={{ fontSize: '0.75em' }}>
              <PersonalDetails 
                data={data} 
                className="flex-col !items-center gap-y-1" 
                itemClassName="text-[1em]"
                iconColor={sidebarContentColor}
              />
            </div>

          <Section title="Profile" data={data} accentColor={sidebarContentColor} showDivider={false} content={
            <p className="leading-relaxed" style={{ ...summaryStyle, fontSize: '0.75em', color: sidebarContentColor }}>{data.personalInfo.summary}</p>
          } />

          <Section title="Skills" data={data} accentColor={sidebarContentColor} showDivider={false} content={
            getSkillsDisplay(data, data.skills || [], sidebarContentColor)
          } />

          {(data.languages || []).length > 0 && (
            <Section title="Languages" data={data} accentColor={sidebarContentColor} showDivider={false} content={
              getLanguagesDisplay(data, data.languages || [], sidebarContentColor)
            } />
          )}
        </div>
      </div>
    </div>
  );
}

// 22. EVERGREEN SLATE
export function EvergreenSlateTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const containerStyle = getSidebarContainerStyle(data);
  const sidebarWidth = data.settings?.columnWidth || 35;
  const darkAccent = adjustColorBrightness(accentColor, -20);
  const headerTextColor = getContrastColor(darkAccent);
  const headerSubTextColor = headerTextColor === '#ffffff' ? adjustColorBrightness(accentColor, 70) : adjustColorBrightness(accentColor, -40);

    return (
        <div className="bg-white overflow-hidden" style={containerStyle}>
          <header className="p-8 flex gap-8" style={{ backgroundColor: darkAccent, color: headerTextColor }}>
            <ProfilePhoto data={data} className="shrink-0" defaultBorderColor={`${headerTextColor}30`} />
              <div className="flex-1">
              <NameDisplay data={data} style={{ color: headerTextColor }} />
            <p className="font-medium opacity-90" style={{ ...jobTitleStyle, fontSize: '1.2em', color: headerSubTextColor }}>{data.personalInfo.jobTitle}</p>
            <PersonalDetails 
              data={data} 
              className="mt-4 font-medium" 
              itemClassName="text-[0.8em] text-white/80"
              iconColor={headerSubTextColor}
            />
          </div>
        </header>

        <div className="flex h-full" style={{ 
          background: `linear-gradient(to right, #f8fafc ${sidebarWidth}%, white ${sidebarWidth}%)`,
          backgroundSize: '100% 11in',
          backgroundRepeat: 'repeat-y'
        }}>
          <div 
            className="p-8 space-y-6 shrink-0" 
            style={{ width: `${sidebarWidth}%` }}
          >
          <Section title="Profile" data={data} accentColor={darkAccent} showDivider={false} content={
            <p className="text-gray-700" style={{ ...summaryStyle, fontSize: '0.8em' }}>{data.personalInfo.summary}</p>
          } />

          <Section title="Skills" data={data} accentColor={darkAccent} showDivider={false} content={
            getSkillsDisplay(data, data.skills || [], accentColor)
          } />

          {(data.languages || []).length > 0 && (
            <Section title="Languages" data={data} accentColor={darkAccent} showDivider={false} content={
              getLanguagesDisplay(data, data.languages || [], accentColor)
            } />
          )}

          <Section title="Education" data={data} accentColor={darkAccent} showDivider={false} content={
            <div>
              {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
            </div>
          } />
        </div>

        <div className={cn("flex-1 p-8", sectionSpacing)}>
          <Section title="Experience" data={data} accentColor={darkAccent} showDivider={data.settings?.showDividers} content={
            <div>
              {(data.experience || []).map(exp => (
                <div key={exp.id}>
                  {renderExperienceEntry(exp, data, accentColor)}
                </div>
              ))}
            </div>
          } />
        </div>
      </div>
    </div>
  );
}

// 23. BANKING
export function BankingTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const containerStyle = getContainerStyle(data);

  return (
      <div className="bg-white" style={containerStyle}>
        <header className="text-center mb-8 border-b-2 pb-6" style={{ borderColor: `${accentColor}30` }}>
          <NameDisplay data={data} />
          <p className="font-bold uppercase tracking-[0.2em] mt-1" style={{ ...jobTitleStyle, fontSize: '1em' }}>{data.personalInfo.jobTitle}</p>
        <PersonalDetails 
          data={data} 
          className="mt-4 text-gray-600 font-medium" 
          itemClassName="text-[0.8em]"
          iconColor={accentColor}
        />
      </header>

      <div className={sectionSpacing}>
        <Section title="Profile" data={data} accentColor={accentColor} showDivider={true} content={
          <p style={summaryStyle}>{data.personalInfo.summary}</p>
        } />

        <Section title="Work Experience" data={data} accentColor={accentColor} showDivider={true} content={
          <div>
            {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
          </div>
        } />

        <Section title="Education" data={data} accentColor={accentColor} showDivider={true} content={
          <div>
            {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
          </div>
        } />

        <div className="grid grid-cols-2 gap-10">
          <Section title="Skills" data={data} accentColor={accentColor} showDivider={true} content={
            getSkillsDisplay(data, data.skills || [], accentColor)
          } />

          {(data.languages || []).length > 0 && (
            <Section title="Languages" data={data} accentColor={accentColor} showDivider={true} content={
              getLanguagesDisplay(data, data.languages || [], accentColor)
            } />
          )}
        </div>
      </div>
    </div>
  );
}

// 24. REFINED
export function RefinedTemplate({ data }: TemplateProps) {
  const accentColor = getAccentColor(data);
  const sectionSpacing = getSectionSpacing(data);
  const nameStyle = getNameStyle(data);
  const jobTitleStyle = getJobTitleStyle(data, accentColor);
  const summaryStyle = getSummaryStyle(data);
  const sidebarWidth = data.settings?.columnWidth || 35;
  const sidebarColor = adjustColorBrightness(accentColor, 85);
  const sidebarBorderColor = adjustColorBrightness(accentColor, 40);
  const containerStyle = getSidebarContainerStyle(data, sidebarColor, sidebarWidth, 'white', 'right');

  return (
        <div className="overflow-hidden" style={containerStyle}>
          <div className="flex h-full">
            <div className={cn("flex-1 p-8", sectionSpacing)}>
            <Section title="Professional Experience" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div>
                {(data.experience || []).map(exp => renderExperienceEntry(exp, data, accentColor))}
              </div>
            } />

            <Section title="Education" data={data} accentColor={accentColor} showDivider={data.settings?.showDividers} content={
              <div>
                {(data.education || []).map(edu => renderEducationEntry(edu, data, accentColor))}
              </div>
            } />
          </div>

            <div 
              className="p-8 space-y-8 border-l shrink-0" 
              style={{ width: `${sidebarWidth}%`, borderColor: sidebarBorderColor }}
            >
            <div className="text-center mb-6">
                <ProfilePhoto data={data} className="mx-auto mb-4" defaultBorderColor={sidebarBorderColor} />
                <NameDisplay data={data} className="leading-tight" />
                <p className="font-medium mt-1" style={{ ...jobTitleStyle, fontSize: '0.9em', color: accentColor }}>{data.personalInfo.jobTitle}</p>
              </div>

            <div className="text-center font-medium" style={{ fontSize: '0.85em' }}>
              <PersonalDetails 
                data={data} 
                className="flex-col !items-center gap-y-1" 
                itemClassName="text-gray-600"
                iconColor={accentColor}
              />
            </div>

          <Section title="Skills" data={data} accentColor={accentColor} showDivider={false} content={
            getSkillsDisplay(data, data.skills || [], accentColor)
          } />

          {(data.languages || []).length > 0 && (
            <Section title="Languages" data={data} accentColor={accentColor} showDivider={false} content={
              getLanguagesDisplay(data, data.languages || [], accentColor)
            } />
          )}

          {(data.certificates || []).length > 0 && (
            <Section title="Courses" data={data} accentColor={accentColor} showDivider={false} content={
              <div>
                {(data.certificates || []).map(cert => (
                  <div key={cert.id} style={{ marginBottom: getEntrySpacing(data) }}>
                    <p className="font-bold text-gray-800" style={{ fontSize: '0.9em' }}>{cert.name}</p>
                    <p className="text-gray-500" style={{ fontSize: '0.8em' }}>{cert.issuer} | {cert.date}</p>
                  </div>
                ))}
              </div>
            } />
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, content, data, accentColor, showDivider }: { title: string, content: React.ReactNode, data?: ResumeData, accentColor?: string, showDivider?: boolean }) {
  const color = accentColor || '#7c3aed';
  const headingStyle = data ? getHeadingStyle(data, color) : {};
  const headingCap = data ? getHeadingCapitalization(data) : 'uppercase';
  
  const finalStyle: React.CSSProperties = {
    ...headingStyle,
    color: data?.settings?.applyAccentTo?.headings ? color : 'inherit',
  };

  if (finalStyle.borderBottom === undefined) {
    finalStyle.borderBottom = showDivider ? `1px solid ${color}20` : 'none';
  }
  
  return (
    <section className="resume-section">
      <h2
        className={cn("font-black mb-4 tracking-wider resume-section-header", headingCap)}
        style={finalStyle}
      >
        {title}
      </h2>
      <div className="entry-content" style={getBodyStyle(data)}>
        {content}
      </div>
    </section>
  );
}
