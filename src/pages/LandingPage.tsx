import TopBar from "@/components/Topbar";
import { motion } from "framer-motion";
import {
  Leaf,
  Sparkles,
  Cpu,
  Layers,
  BarChart3,
  Activity,
  Brain,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useEffect, useState, useMemo } from "react";

const radarData = [
  { metric: "Detection", Aarchid: 92, Others: 82 },
  { metric: "Species ID", Aarchid: 90, Others: 80 },
  { metric: "Latency", Aarchid: 88, Others: 70 },
  { metric: "Care Plans", Aarchid: 95, Others: 76 },
  { metric: "Feedback Loop", Aarchid: 94, Others: 60 },
];

const lineData = [
  { week: "W0", score: 56 },
  { week: "W1", score: 61 },
  { week: "W2", score: 67 },
  { week: "W3", score: 72 },
  { week: "W4", score: 78 },
  { week: "W5", score: 84 },
  { week: "W6", score: 88 },
];

const LandingPage = () => {
  const radarConfig = useMemo(() => ({ outerRadius: 105 }), []);
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setGlow((g) => !g), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-green-50 text-gray-800">
      <TopBar />

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center pt-24 md:pt-32 px-4 sm:px-8 overflow-hidden">
        {/* Animated background visual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#a7f3d0_0%,_transparent_70%)]"
        />
        <motion.div
          className={`absolute w-72 h-72 rounded-full blur-3xl bg-green-300/40 ${
            glow ? "opacity-60" : "opacity-20"
          }`}
          animate={{ scale: glow ? 1.3 : 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 mb-3"
        >
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
            Aarchid
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-xl sm:max-w-2xl text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed"
        >
          The AI plant companion that senses, explains, and learns with your
          environment.
        </motion.p>

        {/* Product preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-12 w-full flex justify-center"
        >
          <div className="relative w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden border border-green-100">
            <video
              src="/demo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
              poster="/embed.png"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-green-600/10 to-transparent"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Sub-caption */}
        <p className="text-xs text-gray-500 mt-4">
          Real-time plant insight powered by AI.
        </p>
      </section>

      {/* FEATURES */}
      <section className="px-4 sm:px-8 md:px-16 mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {[
          {
            icon: <Brain className="h-6 w-6 mx-auto text-green-600" />,
            title: "AI Health Detection",
            desc:
              "Catch early signs of disease or stress with real-time scanning and analysis.",
          },
          {
            icon: <Activity className="h-6 w-6 mx-auto text-green-600" />,
            title: "Growth Analytics",
            desc:
              "See progress, growth velocity, and changes through your plant’s lifecycle.",
          },
          {
            icon: <Layers className="h-6 w-6 mx-auto text-green-600" />,
            title: "Smart Routines",
            desc:
              "Personalized care plans adapt automatically to climate and feedback.",
          },
          {
            icon: <BarChart3 className="h-6 w-6 mx-auto text-green-600" />,
            title: "Performance Insights",
            desc:
              "Benchmark against internal health scores and keep improving continuously.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white border border-green-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            {feature.icon}
            <h3 className="font-semibold text-gray-900 mt-2 text-lg">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm mt-2">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* BENCHMARK SECTION */}
      <section className="px-4 sm:px-8 md:px-20 mt-24 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-green-100 bg-green-50 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Accuracy Benchmark
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={radarConfig.outerRadius}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <Radar
                  name="Aarchid"
                  dataKey="Aarchid"
                  fill="#16a34a"
                  fillOpacity={0.35}
                  stroke="#16a34a"
                />
                <Radar
                  name="Others"
                  dataKey="Others"
                  fill="#9ca3af"
                  fillOpacity={0.25}
                  stroke="#9ca3af"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Health Improvement Over Time
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-8 md:px-20 mt-24 mb-24">
        <div className="rounded-2xl border border-green-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Grow Smarter Starting Today
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Detect earlier. Act confidently. Aarchid learns with you.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="/auth"
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow-md transition-all"
            >
              Start Free
            </a>
          </div>
        </div>
      </section>
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
