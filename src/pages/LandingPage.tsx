import TopBar from "@/components/Topbar";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Leaf,
  Brain,
  Activity,
  Sparkles,
  BarChart3,
  Cpu,
  Database,
} from "lucide-react";

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.4]);

  const features = [
    {
      icon: <Leaf className="h-6 w-6 text-green-600" />,
      title: "Personalized Plant Care",
      desc: "Adaptive routines and reminders designed for your specific plants, powered by real environmental data.",
    },
    {
      icon: <Activity className="h-6 w-6 text-green-600" />,
      title: "Lifecycle Insights",
      desc: "Visualize growth stages, trends, and health data over time with intelligent time-series visualizations.",
    },
    {
      icon: <Brain className="h-6 w-6 text-green-600" />,
      title: "AI Health Detection",
      desc: "Gemini Pro vision detects stress or disease early, classifying leaf textures and color anomalies with precision.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-green-600" />,
      title: "Conversational Intelligence",
      desc: "Ask questions in natural language  from watering schedules to pest control  and get accurate, AI-verified answers.",
    },
  ];

  const metrics = [
    { label: "Disease detection accuracy", value: "92.3%", sub: "Internal F1 score (micro)" },
    { label: "Response time (avg)", value: "1.4s", sub: "Client → inference → response" },
    { label: "Species recognition", value: "89.7%", sub: "Top-1 accuracy (100+ species)" },
    { label: "False alert rate", value: "3.8%", sub: "Threshold tuned per category" },
  ];

  const embeddings = [
    {
      icon: <Database className="h-6 w-6 text-green-600" />,
      title: "Embedding Generation",
      desc: "Each image and health log is transformed into a custom embedding  a mathematical fingerprint of the plant’s state.",
    },
    {
      icon: <Cpu className="h-6 w-6 text-green-600" />,
      title: "Specialized Algorithms",
      desc: "We utilize graph-based vector clustering and adaptive similarity scoring to structure embeddings efficiently.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-green-600" />,
      title: "Growing Our Own Dataset",
      desc: "Through these embeddings, Aarchid builds its own evolving, anonymized dataset from scratch  unique to each environment.",
    },
  ];

  const methodology = [
    {
      title: "Dataset and Labeling",
      desc: "18k+ images, 120+ species labeled by growth stage, disease, and environment diversity.",
    },
    {
      title: "Modeling Pipeline",
      desc: "Gemini Pro vision inference + rule-based validation + LLM explanation synthesis.",
    },
    {
      title: "Human-in-the-loop",
      desc: "User feedback loops generate weak labels that refine classification boundaries dynamically.",
    },
    {
      title: "Evaluation Protocol",
      desc: "Measured with stratified holdouts using F1 (micro/macro), latency (p95), and false positive rate.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-green-50 text-gray-800 font-sans">
      <TopBar />

      {/* Hero */}
      <motion.section
        style={{ y: yHero, opacity: opacityHero }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="flex flex-col items-center text-center mt-40 md:mt-48 px-6 relative overflow-hidden"
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute -top-16 right-32 text-green-100"
        >
          <Leaf className="w-24 h-24 opacity-60" />
        </motion.div>

        <div className="flex items-center space-x-3 mb-4">
          <Leaf className="h-10 w-10 text-green-600" />
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Aarchid
          </h1>
        </div>

        <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-600 leading-relaxed">
          Your AI-powered plant companion  detect, adapt, and grow smarter with
          every observation.
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="/auth"
            className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow-md transition-all"
          >
            Get Started
          </a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() =>
              window.scrollTo({ top: 800, behavior: "smooth" })
            }
            className="px-6 py-3 rounded-lg border border-green-600 text-green-700 font-medium hover:bg-green-50 transition-all"
          >
            Explore Features
          </motion.button>
        </div>
      </motion.section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8 md:px-20 mt-28">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-white border border-green-100 shadow-sm hover:shadow-lg"
          >
            <div className="flex items-center mb-3 space-x-2">
              {f.icon}
              <h3 className="font-semibold text-lg text-gray-800">{f.title}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Metrics */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="px-8 md:px-20 mt-24"
      >
        <div className="rounded-2xl border border-green-100 bg-green-50 p-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Measured Results</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-5 rounded-xl bg-white border border-green-100 shadow-sm hover:shadow-lg"
              >
                <div className="text-3xl font-extrabold text-green-700">
                  {m.value}
                </div>
                <div className="text-sm font-medium text-gray-700 mt-1">
                  {m.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">{m.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Data Engine / Embedding */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-8 md:px-20 mt-20"
      >
        <div className="rounded-2xl border border-green-100 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="h-5 w-5 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Intelligent Data Engine
            </h2>
          </div>
          <p className="text-gray-700 text-base leading-relaxed max-w-3xl">
            Aarchid doesn’t rely on external datasets  it <span className="font-semibold text-green-700">creates and stores embeddings</span> using
            specialized algorithms. Each observation is transformed into a vector representation, forming our proprietary dataset from scratch.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {embeddings.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="p-5 rounded-xl bg-green-50 border border-green-100 hover:shadow-md"
              >
                <div className="flex items-center mb-3 space-x-2">
                  {e.icon}
                  <h3 className="font-semibold text-gray-900">{e.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{e.desc}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Embeddings are anonymized and stored securely, allowing adaptive learning without compromising privacy or ownership.
          </p>
        </div>
      </motion.section>

      {/* Methodology */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-8 md:px-20 mt-20 mb-20"
      >
        <div className="rounded-2xl border border-green-100 bg-green-50 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="h-5 w-5 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Methodology and Evaluation
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {methodology.map((m) => (
              <div
                key={m.title}
                className="p-5 rounded-xl bg-white border border-green-100"
              >
                <div className="font-semibold text-gray-900">{m.title}</div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm border-t border-green-100 mt-auto bg-white">
        <p>
          Built with 🌱 by{" "}
          <a
            href="https://www.dilpreetgrover.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-green-700 hover:text-green-800 transition-colors"
          >
            Dilpreet Grover
          </a>{" "}
          and{" "}
          <a
            href="https://www.linkedin.com/in/dhruvsinghal6888/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-green-700 hover:text-green-800 transition-colors"
          >
            Dhruv Singhal
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
