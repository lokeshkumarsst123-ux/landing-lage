const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replacements = [
  // Card 1 - title
  ['Native Apps (iOS & Android)', 'Mobile App Development'],
  // Card 1 - body
  ['Built for performance, reliability, and deep device integration. Right for latency-sensitive or\r\n                hardware-dependent products.',
   'We build high-performance mobile applications engineered for usability, scalability, and long-term product growth. From startups launching MVPs to enterprise-grade platforms, our team delivers apps designed for real-world user demand.'],

  // Card 2 - title
  ['Cross-Platform Apps (Flutter & React)', 'iOS App Development'],
  // Card 2 - body
  ['One codebase, two platforms, no compromise on quality. Our preferred starting point for most startups\r\n                and scale-ups.',
   'As an experienced app developer Sydney businesses trust, we create premium iOS applications designed for seamless performance across the Apple ecosystem. Our team focuses on intuitive user experiences, strong security standards, and scalable backend systems that support future growth.'],

  // Card 4 - title
  ['UX & UI Design', 'UI/UX Design'],
  // Card 4 - body
  ["Design that makes your app easier to use, easier to trust, and easier to keep coming back to. Tested\r\n                with real users before a line of code is written.",
   'Great products are built around user behaviour, not assumptions. Our design team creates intuitive, modern, and conversion-focused experiences designed to improve engagement and usability. We focus on interfaces that look premium while remaining practical for real users.'],

  // Card 5 - title
  ['GenAI & AI-Powered Features', 'Cross-Platform App Development'],
  // Card 5 - body
  ['Conversational interfaces, recommendation engines, document processing, predictive analytics, and\r\n                workflow automation.',
   'Our cross-platform solutions help businesses reduce development time and operational costs while maintaining a consistent user experience across platforms. Using modern frameworks and scalable architecture, we build applications that perform reliably without sacrificing quality.'],

  // Card 6 - title
  ['Cloud & DevOps Infrastructure', 'MVP Development'],
  // Card 6 - body
  ["Architecture, deployment pipelines, and monitoring that keep your app fast, stable, and ready to grow.\r\n                24/7 monitoring before your first user arrives.",
   'Launching quickly matters \u2014 but launching correctly matters more. We help startups and businesses validate product ideas through lean MVP development built around scalability and future growth.'],

  // Card 7 - title
  ['Quality Assurance & Testing', 'AI App Development'],
  // Card 7 - body
  ["Testing is built into every sprint, not left to the end. Automated and manual QA across devices, OS\r\n                versions, and edge cases. We find any issues before the users do.",
   'AI should improve product functionality, not complicate it. We develop AI-powered mobile applications and intelligent workflows designed for practical business use cases. From conversational interfaces to smart automation systems, we help businesses integrate AI capabilities that create measurable value.'],

  // Card 8 - title
  ['Wearable & IoT applications', 'Web App Development'],
  // Card 8 - body
  ["Apps that connect to the physical world including wearables, sensors, medical devices, and smart\r\n                systems. Built for reliability, precision, and real-world performance.",
   'Modern businesses require platforms that work seamlessly across devices and operational environments. We develop scalable web applications engineered for speed, security, and operational efficiency.'],
];

let changed = 0;
for (const [from, to] of replacements) {
  if (html.includes(from)) {
    html = html.replace(from, to);
    changed++;
    console.log('OK:', from.slice(0, 60));
  } else {
    console.log('MISS:', from.slice(0, 60));
  }
}

fs.writeFileSync('index.html', html);
console.log('\nTotal:', changed);
