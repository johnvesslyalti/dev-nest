import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowRight, Code2, Users, Rocket, Globe } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-charcoal dark:to-midnight pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent-blue/10 dark:bg-accent-blue/5 rounded-[100%] blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
            </span>
            v2.0 is now live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-slide-up">
            Build, ship, and <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-violet">
              grow together.
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up [animation-delay:100ms]">
            The all-in-one community for developers to collaborate on projects, 
            share knowledge, and build their public profile.
          </p>

          <div className="flex items-center justify-center gap-4 animate-slide-up [animation-delay:200ms]">
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 text-lg hover:scale-105 shadow-xl shadow-accent-blue/20">
                Join DevNest
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="secondary" size="lg" className="rounded-full px-8 text-lg hover:scale-105 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800">
                Explore Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-white dark:bg-charcoal/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Users}
              title="Build in Public"
              description="Share your journey, get feedback, and build your reputation within the developer community."
            />
            <FeatureCard 
              icon={Code2}
              title="Collaborate"
              description="Find contributors for your projects or join exciting open-source initiatives."
            />
            <FeatureCard 
              icon={Rocket}
              title="Grow Faster"
              description="Learn from senior engineers, access curated roadmaps, and level up your skills."
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-midnight">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">Trusted by developers worldwide</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos (React, Stripe, Vercel styles) */}
             <div className="flex items-center gap-2 text-2xl font-bold dark:text-white"><Globe className="h-8 w-8" /> TechCorp</div>
             <div className="flex items-center gap-2 text-2xl font-bold dark:text-white"><Rocket className="h-8 w-8" /> StartupInc</div>
             <div className="flex items-center gap-2 text-2xl font-bold dark:text-white"><Code2 className="h-8 w-8" /> OpenSource</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-charcoal">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center text-white font-bold">D</div>
              <span className="font-bold text-lg dark:text-white">DevNest</span>
           </div>
           <p className="text-gray-500 dark:text-gray-400 text-sm">
             © 2026 DevNest. Open source and free forever.
           </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-8 rounded-2xl bg-gray-50 dark:bg-charcoal hover:bg-white dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-300 group cursor-default">
    <div className="h-12 w-12 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
      {description}
    </p>
  </div>
);
