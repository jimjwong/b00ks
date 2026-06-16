import Link from "next/link";

const benefits = [
  {
    title: "One private library",
    body: "Keep the books you own together in a personal cloud library.",
  },
  {
    title: "Continue anywhere",
    body: "Start on one device and continue from the same place on another.",
  },
  {
    title: "Your files remain yours",
    body: "Download your original books and export your reading data whenever you choose.",
  },
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-16 px-6 py-24 text-center">
      <section className="flex flex-col items-center gap-6">
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-charcoal-300">
          b00ks
        </span>
        <h1 className="font-serif text-4xl leading-tight text-charcoal-900 sm:text-5xl">
          Your books. Every device.
        </h1>
        <p className="max-w-xl text-lg text-charcoal-500">
          Upload your EPUB and PDF books once, then read them on the web, iPhone, iPad or
          Android without being locked into a bookstore ecosystem.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/register"
            className="rounded-md bg-accent-500 px-6 py-3 text-sm font-medium text-paper-50 transition-colors hover:bg-accent-600"
          >
            Create your library
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-md border border-charcoal-300 px-6 py-3 text-sm font-medium text-charcoal-700 transition-colors hover:bg-paper-100"
          >
            See how it works
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="grid w-full gap-8 sm:grid-cols-3">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="flex flex-col gap-2 text-left">
            <h2 className="font-serif text-lg text-charcoal-900">{benefit.title}</h2>
            <p className="text-sm text-charcoal-500">{benefit.body}</p>
          </div>
        ))}
      </section>

      <p className="max-w-md text-xs text-charcoal-300">
        b00ks supports DRM-free EPUB and PDF files that you have the legal right to upload. It
        is not a bookstore and does not sell books.
      </p>
    </main>
  );
}
