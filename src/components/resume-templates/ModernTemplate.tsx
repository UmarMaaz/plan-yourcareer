import { ResumeData } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
}

export function ModernTemplate({ data }: TemplateProps) {
  return (
    <div className="p-8 bg-white h-full font-sans">
      <header className="mb-8 border-b-2 border-purple-600 pb-4">
        <h1 className="text-4xl font-black text-gray-900 uppercase">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <p className="text-xl text-purple-600 font-bold mt-1">{data.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
          {data.personalInfo.website && <a href={data.personalInfo.website} className="underline">{data.personalInfo.website}</a>}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {data.personalInfo.summary && (
            <section>
              <h2 className="text-lg font-black uppercase text-purple-600 mb-2 tracking-wider">Summary</h2>
              <p className="text-gray-700 leading-relaxed text-sm">{data.personalInfo.summary}</p>
            </section>
          )}

            {(data.experience || []).length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase text-purple-600 mb-4 tracking-wider">Experience</h2>
                <div className="space-y-6">
                  {(data.experience || []).map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <span className="text-sm text-gray-500">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <p className="text-sm font-medium text-purple-600">{exp.company}</p>
                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
  
          <div className="space-y-8">
            {(data.skills || []).length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase text-purple-600 mb-4 tracking-wider">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {(data.skills || []).map((skill) => (
                    <span key={skill.id} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-100">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
  
            {(data.education || []).length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase text-purple-600 mb-4 tracking-wider">Education</h2>
                <div className="space-y-4">
                  {(data.education || []).map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                      <p className="text-xs text-purple-600">{edu.school}</p>
                      <p className="text-xs text-gray-500">{edu.startDate} — {edu.current ? 'Present' : edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
  
            {(data.languages || []).length > 0 && (
              <section>
                <h2 className="text-lg font-black uppercase text-purple-600 mb-4 tracking-wider">Languages</h2>
                <div className="space-y-1">
                  {(data.languages || []).map((lang) => (
                    <div key={lang.id} className="flex justify-between text-sm">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-gray-500">{lang.level}</span>
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
