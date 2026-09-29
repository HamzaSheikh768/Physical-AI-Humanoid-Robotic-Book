import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './styles.module.css';

const pillars = [
  {
    title: 'Robot operating systems',
    description:
      'Build practical foundations in ROS 2 nodes, topics, services, and the architecture that connects robot software.',
  },
  {
    title: 'Simulation and digital twins',
    description:
      'Model robot behavior in realistic virtual environments before bringing systems into the physical world.',
  },
  {
    title: 'Perception and sensing',
    description:
      'Understand the sensors and perception pipelines that help robots interpret their surroundings.',
  },
  {
    title: 'The AI robot brain',
    description:
      'Explore the NVIDIA Isaac platform and the tools used to train, test, and deploy robot intelligence.',
  },
  {
    title: 'Vision, language, and action',
    description:
      'Connect visual understanding and language-guided decisions to meaningful movement and action.',
  },
  {
    title: 'Hands-on robotics journey',
    description:
      'Progress from foundations through simulation and embodied intelligence to a practical capstone.',
  },
];

const stages = [
  {
    number: '01',
    title: 'Physical AI Foundations',
    subtitle: 'Understand embodied intelligence',
    description:
      'Explore how intelligent systems connect perception, reasoning, and action in the physical world.',
    approach: 'Concepts · Systems',
    metric: 'Start with the fundamentals',
  },
  {
    number: '02',
    title: 'ROS 2',
    subtitle: 'Connect robot software',
    description:
      'Work with nodes, topics, services, and the middleware patterns used to coordinate robot systems.',
    approach: 'Nodes · Topics · Services',
    metric: 'Build your software foundation',
  },
  {
    number: '03',
    title: 'Digital Twins',
    subtitle: 'Develop inside simulation',
    description:
      'Create virtual environments and test robot behavior using physics-based simulation workflows.',
    approach: 'Gazebo · Unity',
    metric: 'Test before deployment',
  },
  {
    number: '04',
    title: 'The AI Robot Brain',
    subtitle: 'Build perception and planning',
    description:
      'Use modern robotics platforms to connect sensing, world models, navigation, and manipulation.',
    approach: 'Isaac · Perception',
    metric: 'Give robots context',
  },
  {
    number: '05',
    title: 'Humanoid Capstone',
    subtitle: 'Bring the system together',
    description:
      'Combine software, simulation, perception, and action in an end-to-end humanoid robotics project.',
    approach: 'Integration · Practice',
    metric: 'Apply what you learn',
  },
];

const waysToProfit = [
  {
    icon: '01',
    title: 'ROS 2',
    price: 'Robot software',
    description: 'Build nodes and connect robot components with topics and services.',
    audience: 'Communication, middleware',
  },
  {
    icon: '02',
    title: 'Digital Twins',
    price: 'Simulation',
    description: 'Prototype and evaluate robot behavior in virtual environments.',
    audience: 'Gazebo, physics, worlds',
  },
  {
    icon: '03',
    title: 'Robot Intelligence',
    price: 'Perception and planning',
    description: 'Explore AI tools for sensing, navigation, and embodied reasoning.',
    audience: 'NVIDIA Isaac platform',
  },
  {
    icon: '04',
    title: 'Vision, Language, Action',
    price: 'Embodied AI',
    description: 'Connect natural language and visual understanding to robot actions.',
    audience: 'Humanoid applications',
  },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={diagonal ? styles.diagonalArrow : styles.arrow}
      viewBox="0 0 20 20"
      fill="none"
    >
      {diagonal ? (
        <path d="M5 15 15 5M6 5h9v9" />
      ) : (
        <path d="M3.5 10h12m-5-5 5 5-5 5" />
      )}
    </svg>
  );
}

function SiteHeader() {
  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} to="/" aria-label="Physical AI home">
          <img className={styles.brandMark} src="/img/robot-logo.svg" alt="" />
          <span className={styles.brandName}>Physical AI &amp; Humanoid Robotics</span>
        </Link>
        <nav className={styles.navLinks} aria-label="Main navigation">
          <Link to="/docs/Introduction">
            Start reading
          </Link>
          <a href="#modules">
            Curriculum
          </a>
        </nav>
      </div>
    </header>
  );
}

function Authors() {
  return (
    <div className={styles.authors}>
      <span className={styles.authorsLabel}>An open, hands-on textbook</span>
      <div className={styles.authorList}>
        <span className={styles.author}>ROS 2</span>
        <span className={styles.author}>Digital twins</span>
        <span className={styles.author}>Embodied AI</span>
        <span className={styles.agentAuthor}>Labs · examples · capstone</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <Link className={styles.tutorBanner} to="/docs/Introduction">
            <span className={styles.freeTag}>Open</span>
            <span>
              Start with the <strong>Physical AI &amp; Humanoid Robotics textbook</strong>
            </span>
            <Arrow />
          </Link>
          <h1 id="hero-title" className={styles.heroTitle}>
            Physical AI &amp;
            <br />
            <span>Humanoid Robotics</span>
          </h1>
          <p className={styles.heroLead}>
            Connect artificial intelligence to the physical world. Learn the ideas,
            software, and tools behind robots that can perceive, reason, and act.
          </p>
          <p className={styles.heroDescription}>
            Move from ROS 2 foundations and digital-twin simulation to NVIDIA Isaac,
            humanoid systems, and vision-language-action workflows. A practical path
            from core concepts to embodied intelligence.
          </p>
          <div className={styles.heroButtons}>
            <Link className={styles.primaryButton} to="/docs/Introduction">
              Start reading <Arrow />
            </Link>
            <a className={styles.secondaryButton} href="#modules">
              Explore modules
            </a>
            <Link className={styles.textButton} to="/docs/Capstone">
              View capstone <Arrow diagonal />
            </Link>
          </div>
          <div className={styles.socialProof}>
            <div className={styles.learners}>
              <div className={styles.avatarStack} aria-hidden="true">
                <span>ROS</span>
                <span>AI</span>
                <span>3D</span>
              </div>
              <div>
                <strong>4 modules</strong>
                <span>one connected curriculum</span>
              </div>
            </div>
            <a className={styles.reviewLink} href="#foundations">
              <span className={styles.reviewStars}>01</span>
              <span>Practical examples</span>
              <Arrow diagonal />
            </a>
            <a
              className={styles.partnerLink}
              href="https://github.com/HamzaSheikh768/Physical-AI-Humanoid-Robotic-Book"
            >
              View source <Arrow diagonal />
            </a>
          </div>
        </div>
        <Authors />
        <div className={styles.bookColumn}>
          <div
            className={styles.bookCoverFrame}
            role="img"
            aria-label="AI Book: The Physical AI & Humanoid Robotics"
          >
            <img
              className={styles.bookCover}
              src="/img/agentfactory/book-cover.png"
              alt=""
              width={834}
              height={1248}
            />
            <span className={styles.coverBrand} aria-hidden="true">
              AI BOOK
            </span>
            <div className={styles.coverText} aria-hidden="true">
              <p className={styles.coverKicker}>ROS 2 · SIMULATION · EMBODIED AI</p>
              <p className={styles.coverTitle}>
                THE PHYSICAL AI
                <br />
                &amp; HUMANOID
                <br />
                <span>ROBOTICS</span>
              </p>
              <p className={styles.coverSubtitle}>
                The systems behind intelligent machines.
              </p>
              <p className={styles.coverDescription}>
                Explore robot software, digital twins, perception, and language-guided action.
              </p>
              <p className={styles.coverFooter}>PHYSICAL AI · HUMANOID ROBOTICS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <p className={styles.sectionEyebrow}>{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description && <p className={styles.sectionDescription}>{description}</p>}
    </div>
  );
}

function Mission() {
  return (
    <section className={styles.mission} id="foundations">
      <div className={styles.sectionContainer}>
        <div className={styles.missionGrid}>
          <div className={styles.missionIntro}>
            <p className={styles.sectionEyebrow}>A new kind of intelligence</p>
            <h2>
              Build for the
              <br />
              Physical
              <br />
              World.
            </h2>
            <p className={styles.missionSubhead}>
              Bring intelligence into the physical world.
            </p>
            <p className={styles.missionDescription}>
              Building capable robots takes more than a model. It takes dependable
              software, realistic simulation, and systems that turn perception into
              deliberate action.
            </p>
          </div>
          <div className={styles.missionPillars}>
            <article className={styles.missionItem}>
              <span className={styles.missionNumber}>01</span>
              <div>
                <h3>Robot software</h3>
                <div className={styles.certifications}>
                  <span>ROS 2</span>
                  <b>→</b>
                  <span>Nodes</span>
                  <b>→</b>
                  <span>Topics</span>
                  <b>→</b>
                  <span>Services</span>
                </div>
                <p>
                  Learn the communication patterns and middleware that coordinate
                  processes across a modern robot.
                </p>
              </div>
            </article>
            <article className={styles.missionItem}>
              <span className={styles.missionNumber}>02</span>
              <div>
                <h3>Simulation + digital twins</h3>
                <strong>Test in a virtual world</strong>
                <p>
                  Use physics-based simulators to model environments, validate behavior,
                  and refine robot systems before deployment.
                </p>
              </div>
            </article>
            <article className={styles.missionItem}>
              <span className={styles.missionNumber}>03</span>
              <div>
                <h3>Embodied intelligence</h3>
                <strong>Perception, planning, action</strong>
                <p>
                  Connect sensors, AI models, and control systems to build robots that
                  interpret and interact with the world around them.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function FteComparison() {
  const rows = [
    ['Core focus', 'Robot software', 'Embodied intelligence'],
    ['Main building blocks', 'Nodes, topics, services', 'Perception, planning, control'],
    ['Development space', 'Robot and middleware', 'Digital twin and simulation'],
    ['Learning approach', 'Build and connect components', 'Test behaviors in context'],
    ['Intelligence', 'Sensors and robot systems', 'AI models and world understanding'],
    ['Outcome', 'Coordinated robot applications', 'Systems that sense and act'],
  ];

  return (
    <section className={styles.comparison} aria-labelledby="fte-title">
      <div className={styles.sectionContainer}>
        <SectionHeading
          id="fte-title"
          eyebrow="The Physical AI stack"
          title="From simulation to the physical world"
          description="A complete robot system connects software, simulation, perception, and action."
        />
        <div className={styles.tableWrap}>
          <table className={styles.fteTable} aria-label="Robot software and Physical AI learning layers">
            <thead>
              <tr>
                <th>Layer</th>
                <th>Robot systems</th>
                <th>Physical AI</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([feature, human, digital]) => (
                <tr key={feature}>
                  <th scope="row">{feature}</th>
                  <td>{human}</td>
                  <td>{digital}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.comparisonStats}>
          <div>
            <strong>ROS 2</strong>
            <span>Robot middleware</span>
          </div>
          <div>
            <strong>3D</strong>
            <span>Simulation first</span>
          </div>
          <div>
            <strong>AI</strong>
            <span>Intelligence in motion</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function DevelopmentSpectrum() {
  const spectrum = [
    {
      title: 'ROS 2',
      label: 'Robot communication',
      description:
        'Build the software foundation that lets robot applications exchange data and coordinate work.',
      bullets: [
        'Nodes and packages',
        'Topics and services',
        'Launch and system design',
      ],
      example: 'Connect sensors, controllers, and robot applications',
      badge: 'Middleware',
      kind: 'assisted',
    },
    {
      title: 'Digital Twins',
      label: 'Simulation and testing',
      description:
        'Build virtual environments that let you design, simulate, and evaluate robots before deployment.',
      bullets: [
        'Worlds and robot models',
        'Physics-based simulation',
        'Virtual testing workflows',
      ],
      example: 'Develop and test a robot in Gazebo or a digital twin',
      badge: 'Simulation',
      kind: 'driven',
    },
    {
      title: 'Embodied AI',
      label: 'Intelligence in action',
      description:
        'Connect perception, reasoning, and control so intelligent systems can operate in the physical world.',
      bullets: [
        'Perception and sensing',
        'Navigation and manipulation',
        'Vision-language-action models',
      ],
      example: 'Give a humanoid robot the ability to see, understand, and move',
      badge: 'Physical AI',
      kind: 'native',
    },
  ];

  return (
    <section className={styles.spectrum}>
      <div className={styles.sectionContainer}>
        <SectionHeading
          eyebrow="A connected robotics curriculum"
          title="The building blocks of a robot"
          description="Move from robot middleware to realistic simulation, then bring perception and intelligent action into the loop."
        />
        <div className={styles.spectrumGrid}>
          {spectrum.map((item, index) => (
            <article
              className={`${styles.spectrumCard} ${styles[item.kind]}`}
              key={item.title}
            >
              <div className={styles.spectrumTopline}>
                <span className={styles.spectrumIndex}>0{index + 1}</span>
                <span className={styles.spectrumBadge}>{item.badge}</span>
              </div>
              <h3>{item.title}</h3>
              <p className={styles.spectrumLabel}>{item.label}</p>
              <p className={styles.spectrumDescription}>{item.description}</p>
              <ul>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <p className={styles.spectrumExample}>
                <span>Example</span>
                {item.example}
              </p>
            </article>
          ))}
        </div>
        <div className={styles.spectrumScale} aria-hidden="true">
          <span>Connect</span>
          <span>Simulate</span>
          <span>Act</span>
        </div>
      </div>
    </section>
  );
}

function BookPillars() {
  return (
    <section className={styles.bookPillars}>
      <div className={styles.sectionContainer}>
        <div className={styles.pillarsHeading}>
          <div>
            <p className={styles.sectionEyebrow}>Inside the textbook</p>
            <h2>Learn the systems behind intelligent robots</h2>
          </div>
          <p>
            Concepts, tools, and practical workflows for building and understanding
            physical AI systems.
          </p>
        </div>
        <div className={styles.pillarsGrid}>
          {pillars.map((pillar, index) => (
            <article className={styles.pillarCard} key={pillar.title}>
              <span className={styles.pillarNumber}>0{index + 1}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaturityJourney() {
  return (
    <section className={styles.maturity}>
      <div className={styles.sectionContainer}>
        <SectionHeading
          eyebrow="Your robotics journey"
          title="From first node to humanoid systems"
          description="Build your understanding step by step—from robot software foundations to simulation, embodied intelligence, and integration."
        />
        <div className={styles.stageList}>
          {stages.map((stage) => (
            <article className={styles.stage} key={stage.number}>
              <span className={styles.stageNumber}>{stage.number}</span>
              <div className={styles.stageTitle}>
                <h3>{stage.title}</h3>
                <span>{stage.subtitle}</span>
              </div>
              <p className={styles.stageDescription}>{stage.description}</p>
              <div className={styles.stageMeta}>
                <span>{stage.approach}</span>
                <strong>{stage.metric}</strong>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.maturityNote}>
          Start with the foundations, then connect each system in the{' '}
          <strong>humanoid robotics capstone</strong>.
        </p>
      </div>
    </section>
  );
}

function GreatShift() {
  const traditional = [
    ['Software-only view', 'Treat robot applications like ordinary programs'],
    ['Test on hardware first', 'Discover integration issues on the physical system'],
    ['Disconnected components', 'Build sensing, planning, and control in isolation'],
    ['Theory without context', 'Study models apart from the robot and its environment'],
    ['Reactive debugging', 'Find system issues after bringing everything together'],
  ];
  const native = [
    ['Systems view', 'Design software, sensors, simulation, and control together'],
    ['Simulation first', 'Explore behaviors before running on physical hardware'],
    ['Integrated perception', 'Use sensor data to understand the environment'],
    ['Grounded learning', 'Connect algorithms to real robots and physical constraints'],
    ['End-to-end practice', 'Bring the complete system together in a capstone'],
  ];

  return (
    <section className={styles.shift}>
      <div className={styles.sectionContainer}>
        <SectionHeading
          eyebrow="The embodied systems shift"
          title={
            <>
              From Simulation to Reality
              <br />
              From Perception to Action
            </>
          }
          description="Physical AI brings intelligence into machines that sense and act. Build the software, simulation, and perception systems that make embodied behavior possible."
        />
        <div className={styles.shiftGrid}>
          <article className={`${styles.shiftPanel} ${styles.oldWay}`}>
            <div className={styles.shiftPanelHeading}>
              <span className={styles.shiftKicker}>Hardware-first workflow</span>
              <h3>Build directly on the robot</h3>
            </div>
            <div className={styles.shiftRows}>
              {traditional.map(([title, description]) => (
                <div className={styles.shiftRow} key={title}>
                  <span className={styles.shiftBullet}>−</span>
                  <p>
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </p>
                </div>
              ))}
            </div>
          </article>
          <span className={styles.versus} aria-hidden="true">
            VS
          </span>
          <article className={`${styles.shiftPanel} ${styles.newWay}`}>
            <div className={styles.shiftPanelHeading}>
              <span className={styles.shiftKicker}>Simulation-first workflow</span>
              <h3>Develop a digital twin</h3>
            </div>
            <div className={styles.shiftRows}>
              {native.map(([title, description]) => (
                <div className={styles.shiftRow} key={title}>
                  <span className={styles.shiftBullet}>+</span>
                  <p>
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Modules() {
  return (
    <section className={styles.monetization} id="modules">
      <div className={styles.sectionContainer}>
        <SectionHeading
          eyebrow="Explore the curriculum"
          title="Four areas of humanoid robotics"
          description="Follow the core topics from robot middleware and simulation to intelligent perception and language-guided action."
        />
        <div className={styles.profitGrid}>
          {waysToProfit.map((way, index) => (
            <article className={styles.profitCard} key={way.title}>
              <div className={styles.profitTopline}>
                <span className={styles.profitIcon} aria-hidden="true">
                  {way.icon}
                </span>
                <span className={styles.profitIndex}>0{index + 1}</span>
              </div>
              <h3>{way.title}</h3>
              <strong className={styles.profitPrice}>{way.price}</strong>
              <p>{way.description}</p>
              <span className={styles.bestFor}>Best for: {way.audience}</span>
            </article>
          ))}
        </div>
        <p className={styles.profitNote}>
          The chapters combine engineering foundations with practical examples, labs,
          and a capstone that connects the full system.
        </p>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className={styles.closing}>
      <div className={styles.closingInner}>
        <div className={styles.closingCopy}>
          <p className={styles.sectionEyebrow}>Physical AI &amp; humanoid robotics</p>
          <h2>Ready to bring intelligence into the real world?</h2>
          <p>
            Explore the textbook and learn how ROS 2, simulation, AI perception, and
            humanoid systems come together in physical AI.
          </p>
          <div className={styles.closingActions}>
            <Link className={styles.closingPrimary} to="/docs/Introduction">
              Start learning <Arrow />
            </Link>
            <a className={styles.closingSecondary} href="#modules">
              Explore modules <Arrow diagonal />
            </a>
          </div>
        </div>
        <div className={styles.terminal} aria-label="Build output example">
          <div className={styles.terminalTop}>
            <span />
            <span />
            <span />
            <span>~/robotics-lab</span>
          </div>
          <div className={styles.terminalBody}>
            <p>
            <span>$</span> ros2 launch humanoid_bringup robot.launch.py
            </p>
            <p className={styles.terminalSuccess}>▸ Loading robot description...</p>
            <p className={styles.terminalSuccess}>✓ sensors and controllers ready</p>
            <div className={styles.terminalCursor} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerInner}>
        <div className={styles.footerLinks}>
          <div>
            <h2>Learn</h2>
            <Link to="/docs/Introduction">Start reading</Link>
            <a href="#modules">Curriculum</a>
            <Link to="/docs/Capstone">Humanoid capstone</Link>
          </div>
          <div>
            <h2>Explore</h2>
            <a href="#foundations">Robot systems</a>
            <a href="#fte-title">Physical AI stack</a>
            <a href="https://github.com/HamzaSheikh768/Physical-AI-Humanoid-Robotic-Book">
              Source on GitHub
            </a>
          </div>
        </div>
        <Link className={styles.footerWordmark} to="/" aria-label="Physical AI home">
          The Physical AI &amp; Humanoid Robotics Book
        </Link>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Hamza Sheikh · An open technical textbook</span>
          <a href="https://github.com/HamzaSheikh768/Physical-AI-Humanoid-Robotic-Book">
            View the open-source project <Arrow diagonal />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function AgentFactoryHome() {
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="A practical textbook for building intelligent robots with ROS 2, simulation, and embodied AI."
    >
      <main className={styles.home}>
        <SiteHeader />
        <Hero />
        <Mission />
        <FteComparison />
        <DevelopmentSpectrum />
        <BookPillars />
        <MaturityJourney />
        <GreatShift />
        <Modules />
        <Closing />
        <SiteFooter />
      </main>
    </Layout>
  );
}
