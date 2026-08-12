import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BellRing,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileStack,
  Gauge,
  History,
  LockKeyhole,
  Network,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';

const outcomes = [
  {
    icon: Search,
    title: 'Visibility',
    description: 'See the current position of every contract, milestone, document, inspection and action.',
  },
  {
    icon: FileCheck2,
    title: 'Accuracy',
    description: 'Reuse approved contract information and requirements consistently across the execution journey.',
  },
  {
    icon: Gauge,
    title: 'Speed',
    description: 'Keep work moving with clear statuses, notifications and service-level monitoring.',
  },
  {
    icon: History,
    title: 'Continuity',
    description: 'Preserve institutional knowledge as teams, officers and administrations change.',
  },
];

const workflow = [
  {
    number: '01',
    title: 'Bring in the approved record',
    description: 'Start after lawful award with the authoritative contract reference, scope, milestones and requirements.',
  },
  {
    number: '02',
    title: 'Coordinate delivery',
    description: 'Give authorised teams and contractors one place for documents, evidence, dates and project events.',
  },
  {
    number: '03',
    title: 'Review with context',
    description: 'Route inspections, queries and approvals to the right people without changing their authority.',
  },
  {
    number: '04',
    title: 'Keep the full history',
    description: 'Connect milestones, decisions, approved changes and completion records in a searchable audit trail.',
  },
];

const platformFeatures = [
  'Controlled contract records',
  'Contractor onboarding',
  'Milestone and evidence tracking',
  'Inspection and approval routing',
  'Extensions and variation records',
  'Completion and handover history',
];

const CompliCheck = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <Helmet>
        <title>CompliCheck | Contract Execution & Oversight by TimingoTech</title>
        <meta
          name="description"
          content="CompliCheck is TimingoTech's post-award contract execution and oversight platform for structured records, milestone visibility, approvals and audit-ready history."
        />
        <meta
          name="keywords"
          content="CompliCheck, contract execution software, contract oversight, milestone tracking, audit trail, public sector technology, TimingoTech"
        />
        <link rel="canonical" href="https://www.timingotech.com/complicheck" />
      </Helmet>

      <section className="relative bg-[#06172f] px-6 pb-24 pt-32 text-white lg:pb-28 lg:pt-40">
        <div className="complicheck-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="absolute -right-40 top-16 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              A TimingoTech product
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              One clear record from award to handover.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              CompliCheck brings post-award contract records, milestones, evidence, reviews and decisions into one structured, auditable workspace.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-4 font-bold text-[#06172f] transition hover:bg-cyan-300"
              >
                Discuss CompliCheck <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                See how it works <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="relative lg:pl-4">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-400/15 to-blue-600/5 blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Illustrative workspace</span>
              </div>

              <div className="bg-slate-50 p-5 text-slate-900 sm:p-7">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Portfolio overview</p>
                    <h2 className="mt-2 text-2xl font-bold">Contract delivery</h2>
                  </div>
                  <div className="rounded-xl bg-[#06172f] p-3 text-cyan-300">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    ['Active', 'In delivery'],
                    ['Reviews', 'Clearly routed'],
                    ['Records', 'Audit-ready'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                      <p className="mt-1 text-xs font-bold text-slate-800 sm:text-sm">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">Infrastructure programme</p>
                      <p className="mt-1 text-xs text-slate-500">Milestone delivery overview</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">On track</span>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                  </div>
                  <div className="mt-5 grid gap-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 flex-none text-emerald-500" />
                      <span className="flex-1 font-medium">Evidence submitted</span>
                      <span className="text-slate-400">Complete</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock3 className="h-5 w-5 flex-none text-amber-500" />
                      <span className="flex-1 font-medium">Technical review</span>
                      <span className="text-slate-400">In review</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <BellRing className="h-5 w-5 flex-none text-blue-500" />
                      <span className="flex-1 font-medium">Next action</span>
                      <span className="text-slate-400">Assigned</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-semibold text-slate-500 lg:justify-between">
          <span className="text-xs uppercase tracking-[0.22em] text-slate-400">Designed for accountable delivery</span>
          <span className="flex items-center gap-2"><Users className="h-4 w-4 text-blue-600" /> Public institutions</span>
          <span className="flex items-center gap-2"><Network className="h-4 w-4 text-blue-600" /> Oversight teams</span>
          <span className="flex items-center gap-2"><FileStack className="h-4 w-4 text-blue-600" /> Delivery partners</span>
        </div>
      </section>

      <section className="px-6 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-700">Why CompliCheck</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Execution should not disappear into scattered files.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              After an award, the working record can spread across correspondence, physical files, reports and individual teams. CompliCheck connects that journey so authorised people can understand what happened, what is pending and what comes next.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {outcomes.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#071a34] px-6 py-24 text-white lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">How it works</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">A connected path through contract delivery.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              CompliCheck begins after contract award and works alongside established procedures, preserving the authority of every responsible institution and officer.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
            {workflow.map((step) => (
              <article key={step.number} className="relative bg-[#0a213f] p-7 lg:min-h-[290px]">
                <span className="text-4xl font-black text-cyan-300/30">{step.number}</span>
                <h3 className="mt-10 text-xl font-bold">{step.title}</h3>
                <p className="mt-4 leading-7 text-slate-300">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-100 p-6 sm:p-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Platform scope</p>
                  <h3 className="mt-2 text-2xl font-bold">Post-award delivery</h3>
                </div>
                <ShieldCheck className="h-9 w-9 text-blue-700" />
              </div>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {platformFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-700">Clear boundaries</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Technology supports the process. People retain authority.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              CompliCheck is an oversight and workflow platform—not an autonomous decision-maker. Procurement, technical certification, approvals and statutory responsibilities remain with the people and institutions that already hold them.
            </p>
            <div className="mt-8 space-y-4">
              {[
                'Preserves authoritative contract references and approved terms',
                'Routes work according to configured roles and responsibilities',
                'Records decisions without making them on an officer’s behalf',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
                  <p className="font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-700">Governed by design</p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight">The right record for the right role.</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                [LockKeyhole, 'Role-based access', 'Access follows configured authority and function.'],
                [History, 'Version history', 'Documents and material activity remain traceable.'],
                [FileCheck2, 'Audit-ready records', 'A chronological view makes review simpler.'],
              ].map(([Icon, title, description]) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <Icon className="h-6 w-6 text-blue-700" />
                  <h3 className="mt-5 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-[#06172f] px-7 py-16 text-center text-white shadow-2xl sm:px-14">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">Move from scattered updates to shared clarity</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Make every step of contract delivery easier to follow.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Talk with TimingoTech about how CompliCheck can support your organisation’s post-award workflow.
          </p>
          <Link
            to="/contact"
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-7 py-4 font-bold text-[#06172f] transition hover:bg-white"
          >
            Start a conversation <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <style jsx>{`
        .complicheck-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: 42px 42px;
          -webkit-mask-image: linear-gradient(to bottom, black, transparent 90%);
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }
      `}</style>
    </main>
  );
};

export default CompliCheck;
