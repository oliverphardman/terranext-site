import { GitHubIcon, ArrowIcon, StarIcon } from "./components/Icons";
import Image from "next/image";
import terranextIcon from "./icon.svg";
import { CodeBlock } from "./components/CodeBlock";
import { ThemeToggle } from "./components/ThemeToggle";
import { Quiz } from "./components/Quiz";
import {
  GITHUB_URL,
  QUICK_START_BUILD,
  QUICK_START_TF,
  COMPARISONS,
} from "./data";

function StepNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center size-8 rounded-full bg-accent text-white text-sm font-bold shrink-0">
      {n}
    </span>
  );
}

async function getStarCount(): Promise<number | null> {
  try {
    const res = await fetch(
      GITHUB_URL.replace(
        "https://github.com/",
        "https://api.github.com/repos/",
      ),
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count;
  } catch {
    return null;
  }
}

export default async function Home() {
  const stars = await getStarCount();
  return (
    <div className="flex flex-col flex-1 font-sans">
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="hero-glow -top-48 -right-48" />
          <div className="hero-glow -bottom-48 -left-48" />
          <div className="mx-auto max-w-6xl px-6 py-28 sm:py-40 relative text-center">
            <h1 className="flex items-center justify-center gap-4 text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1]">
              <Image
                src={terranextIcon}
                alt=""
                className="size-14 sm:size-20"
                priority
              />
              TerraNext
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-4xl mx-auto">
              Develop with Next.js. Package with OpenNext. Deploy with Terraform
              or OpenTofu. Host on AWS.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#quick-start"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
              >
                Get Started
                <ArrowIcon />
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-7 py-3.5 text-sm font-semibold transition-all hover:bg-card-hover hover:-translate-y-0.5"
              >
                <GitHubIcon />
                View on GitHub
                {stars !== null && stars >= 100 && (
                  <span className="inline-flex items-center gap-1 ml-1 text-muted">
                    <StarIcon />
                    {stars.toLocaleString()}
                  </span>
                )}
              </a>
            </div>
          </div>
        </section>

        {/* Quiz */}
        <section id="quiz" className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Is TerraNext right for you?
              </h2>
              <p className="mt-4 text-muted text-lg">
                Answer a few questions and find out.
              </p>
            </div>
            <Quiz />
          </div>
        </section>

        {/* Comparison */}
        <section id="comparison" className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                For your consideration
              </h2>
              <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
                It's always good to be honest.
              </p>
            </div>
            <div className="my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COMPARISONS.map((option) => (
                <div
                  key={option.name}
                  className={`rounded-2xl border p-6 ${option.name === "TerraNext" ? "border-accent/40 bg-accent/5" : "border-border bg-card"}`}
                >
                  <h3
                    className={`text-lg font-semibold ${option.name === "TerraNext" ? "text-accent" : ""}`}
                  >
                    {option.name}
                  </h3>
                  <ul className="mt-5 space-y-2.5 text-sm">
                    {option.pros.map((pro) => (
                      <li key={pro} className="flex gap-2.5">
                        <span className="text-green-500 shrink-0">
                          &#10003;
                        </span>
                        <span className="text-muted">{pro}</span>
                      </li>
                    ))}
                    {option.cons.map((con) => (
                      <li key={con} className="flex gap-2.5">
                        <span className="text-red-400 shrink-0">&#10005;</span>
                        <span className="text-muted">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Quick start
              </h2>
            </div>
            <div className="mt-16 max-w-3xl mx-auto space-y-12">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <StepNumber n={1} />
                  <h3 className="text-lg font-semibold">
                    Build your Next.js app with OpenNext
                  </h3>
                </div>
                <CodeBlock language="sh">{QUICK_START_BUILD}</CodeBlock>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <StepNumber n={2} />
                  <h3 className="text-lg font-semibold">
                    Add TerraNext to your Terraform/OpenTofu
                  </h3>
                </div>
                <CodeBlock language="hcl">{QUICK_START_TF}</CodeBlock>
              </div>
              {/* New to Terraform? */}
              <h3 className="text-center text-lg font-medium text-muted">
                New to Terraform? Start with the{" "}
                <a
                  href="https://developer.hashicorp.com/terraform/tutorials/aws-get-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  official Terraform AWS tutorial
                </a>
                .
              </h3>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-24 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to deploy?
            </h2>
            <p className="mt-4 text-muted text-lg max-w-xl mx-auto">
              TerraNext is open source and free to use under the MIT License.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
              >
                <GitHubIcon />
                View on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              A project by{" "}
              <a
                href="https://oliverhardman.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Oliver Hardman
              </a>
              .
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://opennext.js.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                OpenNext
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <ThemeToggle />
            </div>
          </div>
          <div className="mt-4 text-xs text-center sm:text-left space-y-1">
            <p>
              TerraNext is free and open-source under the{" "}
              <a href={`${GITHUB_URL}/blob/main/LICENSE`}>MIT License</a>. Not
              affiliated with{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel
              </a>
              ,{" "}
              <a
                href="https://opennext.js.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenNext
              </a>
              ,{" "}
              <a
                href="https://www.hashicorp.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                HashiCorp
              </a>{" "}
              or{" "}
              <a
                href="https://aws.amazon.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                AWS
              </a>
              .
            </p>
            <p>
              &ldquo;Terraform&rdquo; is a trademark of{" "}
              <a
                href="https://www.hashicorp.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                HashiCorp
              </a>
              . OpenTofu is a trademark of{" "}
              <a
                href="https://lfprojects.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LF Projects
              </a>
              . &ldquo;Next.js&rdquo; is a trademark of{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel
              </a>
              . With thanks to{" "}
              <a
                href="https://github.com/nhsengland"
                target="_blank"
                rel="noopener noreferrer"
              >
                NHS England
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
