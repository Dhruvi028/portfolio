import { Activity, Terminal, Database, Server, Layout, ArrowRight, ArrowUpRight, Github, Linkedin } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { IMPACT_METRICS, FEATURED_CASE_STUDIES, OTHER_WORK, EXPERIENCE_TIMELINE, TECHNICAL_ARSENAL } from "@/data/resume";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background relative font-mono text-sm selection:bg-primary/20">
      {/* Background Architectural Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-50 z-0 pointer-events-none"></div>

      {/* Main Structural Container */}
      <main className="relative z-10 max-w-6xl mx-auto border-x border-border bg-background min-h-screen shadow-2xl">
        
        {/* SYS HEADER */}
        <header className="border-b border-border p-4 md:p-6 flex justify-between items-center bg-background sticky top-0 z-50">
          <div className="font-bold text-lg md:text-xl uppercase tracking-widest flex items-center gap-3">
            <div className="w-3 h-3 bg-accent animate-pulse"></div>
            DHRUVI_SHAH.EXE
          </div>
          <div className="flex items-center gap-4 text-xs uppercase tracking-wider">
            <span className="hidden md:inline-block text-muted-foreground border-r border-border pr-4">SYS.STATUS: ONLINE</span>
            <ThemeToggle />
          </div>
        </header>

        {/* HERO GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 border-b border-border bg-background">
          <div className="md:col-span-2 p-8 md:p-16 border-b md:border-b-0 md:border-r border-border flex flex-col justify-center">
            <div className="text-primary mb-4 text-xs uppercase tracking-widest font-bold">Role: Full Stack Developer</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter leading-none mb-6">
              Engineering<br/>Scalable<br/>Systems.
            </h1>
            <p className="font-sans text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed">
              Specializing in high-throughput API architectures, enterprise database optimization, and cross-functional leadership across automotive, social care, and SaaS.
            </p>
          </div>
          <div className="p-8 md:p-16 flex flex-col justify-center gap-6 bg-muted/20">
            <div className="text-xs uppercase text-muted-foreground border-b border-border pb-2 mb-2">Connect</div>
            <a href="mailto:dhruvishahhh708@gmail.com" className="flex items-center justify-between hover:bg-primary hover:text-primary-foreground p-3 border border-border hover:border-primary transition-colors bg-background">
              <span>EMAIL</span> <ArrowRight className="w-4 h-4" />
            </a>
            <a href="tel:+919428817115" className="flex items-center justify-between hover:bg-primary hover:text-primary-foreground p-3 border border-border hover:border-primary transition-colors bg-background">
              <span>PHONE</span> <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-primary text-primary-foreground p-3 border border-primary hover:bg-primary/90 transition-colors">
              <span className="font-bold">RESUME.PDF</span> <ArrowRight className="w-4 h-4" />
            </a>
            <div className="p-3 border border-border text-muted-foreground bg-background">
              LOC: AHMEDABAD, IN
            </div>
          </div>
        </section>

        {/* IMPACT METRICS */}
        <section className="grid grid-cols-2 md:grid-cols-4 border-b border-border bg-background">
          {IMPACT_METRICS.map((stat, i) => (
             <div key={i} className="p-6 md:p-10 text-center hover:bg-accent/5 transition-colors border-border border-b md:border-b-0 [&:nth-child(odd)]:border-r md:[&:not(:last-child)]:border-r">
               <div className="text-3xl md:text-4xl font-bold text-accent tracking-tighter">{stat.value}</div>
               <div className="text-[10px] md:text-xs text-muted-foreground uppercase mt-3 tracking-widest">{stat.label}</div>
             </div>
          ))}
        </section>

        {/* FEATURED CASE STUDIES */}
        <section className="border-b border-border bg-background">
          <div className="p-4 md:p-6 border-b border-border bg-muted/20 text-xs uppercase tracking-widest font-bold">
            01 // Featured Architecture
          </div>
          <div className="divide-y divide-border">
            {FEATURED_CASE_STUDIES.map((study, i) => (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-4 hover:bg-muted/10 transition-colors group">
                <div className="p-6 md:p-8 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-border">
                  {((study as any).link && (study as any).link !== "#") ? (
                    <a href={(study as any).link} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      {study.title} <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 -translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all flex-shrink-0 mt-1" />
                    </a>
                  ) : (
                    <div className="inline-flex items-start gap-1 font-bold text-lg leading-tight">
                      {study.title}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4 items-center">
                    <span className="px-2 py-1 bg-accent/10 text-accent border border-accent/20 text-[10px] uppercase font-bold">
                      {study.domain}
                    </span>
                    {study.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6 md:p-8 lg:col-span-3 grid md:grid-cols-3 gap-8 text-xs font-sans">
                  <div>
                    <div className="font-mono text-[10px] uppercase text-muted-foreground mb-2 border-b border-border pb-1">Problem</div>
                    <p className="text-foreground/80">{study.problem}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase text-muted-foreground mb-2 border-b border-border pb-1">Built</div>
                    <p className="text-foreground/80">{study.built}</p>
                  </div>
                  <div className="bg-accent/10 p-4 border border-accent/20">
                    <div className="font-mono text-[10px] uppercase text-accent font-bold mb-2 border-b border-accent/20 pb-1 flex items-center gap-2">
                      <Activity className="w-3 h-3" /> OUTCOME
                    </div>
                    <p className="text-foreground font-medium">{study.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OTHER WORK */}
        <section className="border-b border-border bg-background">
          <div className="p-4 md:p-6 border-b border-border bg-muted/20 text-xs uppercase tracking-widest font-bold">
            02 // Other Work
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {OTHER_WORK.map((project, i) => {
              const hasLink = (project as any).link && (project as any).link !== "#";
              return hasLink ? (
                <a href={(project as any).link} target="_blank" rel="noopener noreferrer" key={i} className="block p-6 hover:bg-muted/10 transition-colors border-b border-border md:[&:nth-child(odd)]:border-r group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold flex items-center gap-1 group-hover:text-primary transition-colors">
                      {project.name} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[10px] uppercase flex items-center gap-2">
                      <span className="text-accent font-bold">{project.domain}</span>
                      <span className="text-border">|</span>
                      <span className="text-primary">{project.tags}</span>
                    </div>
                  </div>
                  <div className="text-xs font-sans text-muted-foreground">{project.desc}</div>
                </a>
              ) : (
                <div key={i} className="block p-6 hover:bg-muted/10 transition-colors border-b border-border md:[&:nth-child(odd)]:border-r">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold flex items-center gap-1">
                      {project.name}
                    </div>
                    <div className="text-[10px] uppercase flex items-center gap-2">
                      <span className="text-accent font-bold">{project.domain}</span>
                      <span className="text-border">|</span>
                      <span className="text-primary">{project.tags}</span>
                    </div>
                  </div>
                  <div className="text-xs font-sans text-muted-foreground">{project.desc}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* EXPERIENCE TIMELINE */}
        <section className="border-b border-border bg-background">
          <div className="p-4 md:p-6 border-b border-border bg-muted/20 text-xs uppercase tracking-widest font-bold">
            03 // Engineering Log
          </div>
          <div className="divide-y divide-border">
            {EXPERIENCE_TIMELINE.map((job, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 p-6 md:p-8 hover:bg-muted/5 transition-colors">
                <div className="md:col-span-1 mb-4 md:mb-0">
                  <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-widest">{job.date}</div>
                  <div className="font-bold">{job.company}</div>
                  <div className="text-primary text-xs mt-1 uppercase">{job.role}</div>
                </div>
                <div className="md:col-span-3 font-sans text-sm text-foreground/80 space-y-2">
                  {job.points.map((point, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="text-accent text-[10px] mt-1">►</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ARSENAL & WORKFLOW */}
        <section className="grid grid-cols-1 md:grid-cols-2 bg-background border-b border-border">
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-border">
            <div className="text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Technical Arsenal
            </div>
            <div className="space-y-4 font-sans text-sm">
              {TECHNICAL_ARSENAL.map((group, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border border-border bg-muted/10">
                  <div className="mt-0.5">{group.icon}</div>
                  <div>
                    <div className="font-mono text-xs font-bold uppercase">{group.cat}</div>
                    <div className="text-foreground/70 text-xs mt-1">{group.tools}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Workflow Leverage
            </div>
            <div className="space-y-6 font-sans text-sm p-4 border border-border bg-muted/10 h-[calc(100%-2.5rem)]">
              <div>
                <div className="font-mono text-xs font-bold uppercase text-primary mb-1">Architecture & Scaffolding</div>
                <div className="text-foreground/70">Antigravity & Claude for boilerplate generation, regex stress-testing, and typed DTO scaffolding.</div>
              </div>
              <div className="w-full h-px bg-border"></div>
              <div>
                <div className="font-mono text-xs font-bold uppercase text-primary mb-1">System Diagnostics</div>
                <div className="text-foreground/70">Chrome DevTools combined with AI profiling to eliminate unneeded frontend re-renders.</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/20 text-xs uppercase tracking-widest text-muted-foreground">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <span>BE.IT / Gov. Engineering College (2017-2021)</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Dhruvi028" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <span className="sr-only">GitHub Profile</span>
              <Github className="w-4 h-4" aria-hidden="true" />
            </a>
            <a href="https://www.linkedin.com/in/dhruvi-shah-b52b301a1" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <span className="sr-only">LinkedIn Profile</span>
              <Linkedin className="w-4 h-4" aria-hidden="true" />
            </a>
            <span className="hidden md:inline-block border-l border-border h-3 mx-2"></span>
            <span>© {new Date().getFullYear()} DHRUVI SHAH</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
