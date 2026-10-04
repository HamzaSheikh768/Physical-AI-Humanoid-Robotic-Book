import React from 'react';
import Link from '@docusaurus/Link';
import styles from '@site/src/css/HomepageJourney.module.css';

const journeyStages = [
  {
    index: '01',
    label: 'Sense',
    title: 'Ground the robot in its world.',
    description: 'Start with ROS 2, sensors, and embodied intelligence—the signals that make a machine aware of its surroundings.',
    href: '/docs/Module-1-ROS2/Introduction-to-Physical-AI',
    tools: 'ROS 2 / sensors',
  },
  {
    index: '02',
    label: 'Simulate',
    title: 'Test motion before metal.',
    description: 'Build a digital twin, tune physics, and make risky experiments repeatable before they reach the real robot.',
    href: '/docs/Module-2-Digital-Twin/Gazebo-Setup-and-Simulation',
    tools: 'Gazebo / URDF',
  },
  {
    index: '03',
    label: 'Reason',
    title: 'Turn perception into a plan.',
    description: 'Connect visual understanding, reinforcement learning, and manipulation into a robot brain that can choose its next move.',
    href: '/docs/Module-3-AI-Robot-Brain/NVIDIA-Isaac-Platform',
    tools: 'Isaac / planning',
  },
  {
    index: '04',
    label: 'Act',
    title: 'Bring language into motion.',
    description: 'Finish with kinematics, locomotion, and vision-language-action systems that translate intent into physical behavior.',
    href: '/docs/Module-4-Vision-Language-Action/Humanoid-Kinematics-and-Locomotion',
    tools: 'VLA / humanoids',
  },
];

const systemRows = [
  ['Input', 'Cameras, force, joint state', '01'],
  ['Decision', 'Models, memory, planning', '02'],
  ['Action', 'Motion, manipulation, feedback', '03'],
];

export default function HomepageJourney(): React.ReactElement {
  return (
    <div className={styles.journey}>
      <section className={styles.workflowSection} aria-labelledby="journey-title">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>The workflow</p>
              <h2 id="journey-title">Four moves from model to motion.</h2>
            </div>
            <p className={styles.sectionLead}>
              Follow the same loop used by real physical AI teams: understand the world, test the system, make a decision, then close the loop through action.
            </p>
          </div>

          <ol className={styles.journeyGrid}>
            {journeyStages.map((stage) => (
              <li className={styles.journeyCard} key={stage.index}>
                <div className={styles.cardTopline}>
                  <span className={styles.index}>{stage.index}</span>
                  <span className={styles.tools}>{stage.tools}</span>
                </div>
                <p className={styles.stageLabel}>{stage.label}</p>
                <h3>{stage.title}</h3>
                <p className={styles.cardDescription}>{stage.description}</p>
                <Link className={styles.cardLink} to={stage.href}>
                  Open module <span aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.systemSection} aria-labelledby="system-title">
        <div className={styles.container}>
          <div className={styles.systemGrid}>
            <div className={styles.systemIntro}>
              <p className={styles.eyebrow}>System view</p>
              <h2 id="system-title">Signals in. Decisions through. Action out.</h2>
              <p>
                Physical AI is not a single model. It is a living chain of perception, planning, and control—each layer giving the next one enough context to move with purpose.
              </p>
              <Link className={styles.textLink} to="/docs/Overview-Module-and-Chapter">
                See the full architecture <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className={styles.signalMap} aria-label="Physical AI system flow">
              {systemRows.map(([name, detail, index]) => (
                <div className={styles.signalRow} key={name}>
                  <span className={styles.signalIndex}>{index}</span>
                  <div>
                    <strong>{name}</strong>
                    <span>{detail}</span>
                  </div>
                  <span className={styles.signalArrow} aria-hidden="true">→</span>
                </div>
              ))}
              <div className={styles.feedbackLine}>
                <span>Feedback keeps the loop honest</span>
                <span className={styles.feedbackMark} aria-hidden="true">↺</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection} aria-labelledby="cta-title">
        <div className={styles.container}>
          <div className={styles.ctaPanel}>
            <div>
              <p className={styles.eyebrow}>Start with the foundations</p>
              <h2 id="cta-title">Make the next experiment physical.</h2>
            </div>
            <div className={styles.ctaAction}>
              <p>Read at your own pace, then take each idea into a simulation or a real robot.</p>
              <Link className={styles.ctaLink} to="/docs/Introduction">
                Begin the textbook <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
