"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";
import SectionReveal from "@/components/ui/SectionReveal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const CareersPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#010a08] transition-colors duration-500">
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white dark:bg-transparent border-b border-slate-100 dark:border-emerald-500/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <SectionReveal>
            <Breadcrumbs items={[{ label: "Company", href: "/about" }, { label: "Careers" }]} />

            <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
              Join Our <span className="text-emerald-600">Team</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-emerald-100/60 font-medium mb-12">
              We are always on the lookout for talented individuals to help us revolutionize travel in Visakhapatnam.
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionReveal>
            <div className="p-12 rounded-[3rem] bg-white dark:bg-emerald-950/20 border border-slate-100 dark:border-emerald-500/10 shadow-sm">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 mb-6">
                <Briefcase className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">No Open Positions Currently</h2>
              <p className="text-slate-600 dark:text-emerald-100/60 font-medium mb-8">
                While we don't have any specific openings at the moment, we love connecting with passionate people. Feel free to send us your resume, and we'll keep you in mind for future opportunities.
              </p>
              
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20"
              >
                Get in Touch <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      </main>
  );
};

export default CareersPage;
