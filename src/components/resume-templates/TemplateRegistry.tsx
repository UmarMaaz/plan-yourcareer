import { ResumeData } from '@/types/resume';
import * as Templates from './Templates';

interface TemplateRegistryProps {
  templateId: string;
  data: ResumeData;
}

export function TemplateRenderer({ templateId, data }: TemplateRegistryProps) {
  switch (templateId) {
    case 'modern':
      return <Templates.ModernTemplate data={data} />;
    case 'minimal':
      return <Templates.MinimalTemplate data={data} />;
    case 'corporate':
      return <Templates.CorporateTemplate data={data} />;
    case 'creative':
      return <Templates.CreativeTemplate data={data} />;
    case 'technical':
      return <Templates.TechnicalTemplate data={data} />;

    case 'elegant':
      return <Templates.ElegantTemplate data={data} />;
    case 'startup':
      return <Templates.StartupTemplate data={data} />;

    case 'classic':
      return <Templates.ClassicTemplate data={data} />;
    case 'modern-photo':
      return <Templates.ModernPhotoTemplate data={data} />;

    // New templates
    case 'mercury':
      return <Templates.MercuryTemplate data={data} />;
    case 'finance':
      return <Templates.FinanceTemplate data={data} />;
    case 'steady-form':
      return <Templates.SteadyFormTemplate data={data} />;
    case 'simply-blue':
      return <Templates.SimplyBlueTemplate data={data} />;
    case 'harvard':
      return <Templates.HarvardTemplate data={data} />;
    case 'blue-steel':
      return <Templates.BlueSteelTemplate data={data} />;


    case 'hunter-green':
      return <Templates.HunterGreenTemplate data={data} />;
    case 'evergreen-slate':
      return <Templates.EvergreenSlateTemplate data={data} />;
    case 'banking':
      return <Templates.BankingTemplate data={data} />;
    case 'refined':
      return <Templates.RefinedTemplate data={data} />;
    default:
      return <Templates.ModernTemplate data={data} />;
  }
}
