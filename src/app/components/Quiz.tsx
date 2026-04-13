"use client";

import { useCallback, useState } from "react";
import { FaArrowLeft, FaRepeat } from "react-icons/fa6";

type Q1 = "yes" | "no" | "doesnt-mind";
type Q2 = "individual" | "startup" | "enterprise";
type Q3 = "terraform" | "only-nextjs" | "alongside";

const EXPLANATIONS: Record<string, string> = {
  Vercel:
    "Hosted by the creators of Next.js. Free for hobby projects, but can get expensive for larger projects.",
  "Cloudflare or Netlify":
    "Great edge performance and generous free tiers. Uses OpenNext for serverless deployment.",
  Amplify:
    "A managed AWS service with minimal setup. It is generally considered the simplest option, though it is known to be slow at supporting new Next.js features. Amplify is supposed to be a comprehensive suite of services for developers, including products like authentication and persistence. While this can be useful, many developers feel it presents a poor experience and limits what can be done, making it frustrating to work with.",
  "OpenNext with SST":
    "Utilises the OpenNext framework with SST for serverless deployment on AWS. Many developers report a smooth developer experience and good performance. May not be suitable if you need full control over the infrastructure or are integrating it into a larger project, particularly if you're utilising additional platforms.",
  TerraNext:
    "Gives you full control over every AWS resource using Terraform. Although the most flexible, it requires more setup and maintenance compared to managed platforms.",
};

function rec(name: string, perfect?: boolean): Recommendation {
  return { name, explanation: EXPLANATIONS[name], ...(perfect && { perfect }) };
}

interface Recommendation {
  name: string;
  explanation: string;
  perfect?: boolean;
}

interface QuizResult {
  message: string;
  subtitle: string;
  recommendations: Recommendation[];
}

function computeResult(q1: Q1, q2: Q2 | null, q3: Q3 | null): QuizResult {
  if (q1 === "no") {
    return {
      message: "You don't need AWS for Next.js",
      subtitle: "",
      recommendations: [rec("Vercel"), rec("Cloudflare or Netlify")],
    };
  }

  if (q3 === "terraform" || q3 === "alongside") {
    return {
      message: "TerraNext is a perfect fit!",
      subtitle:
        q3 === "terraform"
          ? "Just integrate the TerraNext Terraform module to get started."
          : "TerraNext lets you manage your Next.js app alongside the rest of your infrastructure in one Terraform config.",
      recommendations: [rec("TerraNext", true)],
    };
  }

  if (q3 === "only-nextjs") {
    if (q1 === "yes") {
      return {
        message: "You have solid options on AWS",
        subtitle:
          "For a standalone Next.js app on AWS, Amplify is the simplest option. SST allows you to host your app while maintaining control of the infrastructure. TerraNext gives you more control.",
        recommendations: [
          rec("Amplify"),
          rec("OpenNext with SST"),
          rec("TerraNext"),
        ],
      };
    }
    return {
      message: "A managed platform is probably your best bet",
      subtitle:
        "For a standalone Next.js app, managed platforms handle the heavy lifting for you.",
      recommendations: [
        rec("Vercel"),
        rec("OpenNext with SST"),
        rec("TerraNext"),
      ],
    };
  }

  if (q2 === "individual") {
    return {
      message: "Managed platforms are hard to beat for hobby projects",
      subtitle: "They handle the infrastructure so you can focus on building.",
      recommendations: [
        rec("Vercel"),
        rec("Amplify"),
        rec("OpenNext with SST"),
        rec("TerraNext"),
      ],
    };
  }

  if (q2 === "startup") {
    return {
      message: "Speed and simplicity matter most right now",
      subtitle: "A managed platform is likely your best bet.",
      recommendations: [
        rec("Vercel"),
        rec("Amplify"),
        rec("OpenNext with SST"),
        rec("TerraNext"),
      ],
    };
  }

  return { message: "", subtitle: "", recommendations: [] };
}

function OptionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-accent/40 hover:bg-card-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5 cursor-pointer"
    >
      <p className="font-medium text-sm">{children}</p>
    </button>
  );
}

export function Quiz() {
  const [q1, setQ1] = useState<Q1 | null>(null);
  const [q2, setQ2] = useState<Q2 | null>(null);
  const [q3, setQ3] = useState<Q3 | null>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const handleQ1 = useCallback((answer: Q1) => {
    setQ1(answer);
    setQ2(null);
    setQ3(null);
    setStep(answer === "yes" ? 3 : answer === "no" ? 4 : 2);
  }, []);

  const handleQ2 = useCallback((answer: Q2) => {
    setQ2(answer);
    setQ3(null);
    setStep(answer === "enterprise" ? 3 : 4);
  }, []);

  const handleQ3 = useCallback((answer: Q3) => {
    setQ3(answer);
    setStep(4);
  }, []);

  const goBack = useCallback(() => {
    if (step === 2) {
      setQ1(null);
      setStep(1);
    } else if (step === 3) {
      if (q1 === "yes") {
        setQ1(null);
        setStep(1);
      } else if (q2 === "enterprise") {
        setQ2(null);
        setStep(2);
      } else {
        setQ1(null);
        setStep(1);
      }
    } else if (step === 4) {
      if (q3 !== null) {
        setQ3(null);
        setStep(3);
      } else {
        setQ2(null);
        setStep(2);
      }
    }
  }, [step, q1, q2, q3]);

  const reset = useCallback(() => {
    setQ1(null);
    setQ2(null);
    setQ3(null);
    setStep(1);
  }, []);

  if (step === 4 && q1) {
    const result = computeResult(q1, q2, q3);
    const isPerfect =
      result.recommendations.length === 1 && result.recommendations[0].perfect;

    return (
      <div className="max-w-2xl mx-auto text-center">
        <h3 className={`text-2xl font-bold ${isPerfect ? "text-accent" : ""}`}>
          {result.message}
        </h3>
        <p className="mt-3 text-muted leading-relaxed">{result.subtitle}</p>
        {!isPerfect && (
          <ol className="mt-8 space-y-3 text-left max-w-md mx-auto">
            {result.recommendations.map((rec, i) => (
              <li
                key={rec.name}
                className={`flex gap-3 rounded-lg border p-3 border-border bg-card`}
              >
                <span
                  className={`inline-flex items-center justify-center size-6 rounded-full text-xs font-bold shrink-0 mt-0.5 bg-border text-muted`}
                >
                  {i + 1}
                </span>
                <div>
                  <span className={`text-sm font-medium`}>{rec.name}</span>
                  <p className="text-xs text-muted mt-0.5">{rec.explanation}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
        {isPerfect && (
          <div className="mt-8">
            <a
              href="#quick-start"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </div>
        )}
        <div className="mt-6 flex justify-center gap-4">
          {(q2 !== null || q3 !== null) && (
            <button
              type="button"
              onClick={goBack}
              className="text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <FaArrowLeft className="inline-block mr-1" />
              Back
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <FaRepeat className="inline-block mr-1" />
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {step === 1 && (
        <div>
          <h3 className="text-xl font-semibold text-center mb-6">
            Do you want to host on AWS?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionButton onClick={() => handleQ1("yes")}>Yes</OptionButton>
            <OptionButton onClick={() => handleQ1("doesnt-mind")}>
              I don&apos;t mind
            </OptionButton>
            <OptionButton onClick={() => handleQ1("no")}>No</OptionButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-xl font-semibold text-center mb-6">
            What type of project is this?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionButton onClick={() => handleQ2("individual")}>
              Individual or hobby
            </OptionButton>
            <OptionButton onClick={() => handleQ2("startup")}>
              For my startup
            </OptionButton>
            <OptionButton onClick={() => handleQ2("enterprise")}>
              Large organisation or enterprise
            </OptionButton>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-xl font-semibold text-center mb-6">
            What are your infrastructure plans?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionButton onClick={() => handleQ3("terraform")}>
              To manage infrastructure with Terraform or OpenTofu
            </OptionButton>
            <OptionButton onClick={() => handleQ3("only-nextjs")}>
              To host a Next.js app only
            </OptionButton>
            <OptionButton onClick={() => handleQ3("alongside")}>
              To host a Next.js app alongside other infrastructure
            </OptionButton>
          </div>
        </div>
      )}

      {step > 1 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={goBack}
            className="text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <FaArrowLeft className="inline-block mr-1" />
            Back
          </button>
        </div>
      )}
    </div>
  );
}
