// import React from 'react';
// import { motion } from 'framer-motion';
// import { staggerContainer } from '../../animations/variants';

// interface DashboardLayoutProps {
//   children: React.ReactNode;
//   sidebar?: React.ReactNode;
//   header?: React.ReactNode;
//   className?: string;
// }

// const DashboardLayout: React.FC<DashboardLayoutProps> = ({
//   children,
//   sidebar,
//   header,
//   className = ''
// }) => {
//   return (
//     <motion.div
//       className={`container margin-vert--lg ${className}`}
//       variants={staggerContainer}
//       initial="initial"
//       animate="animate"
//     >
//       <div className="row">
//         {sidebar && (
//           <div className="col col--3">
//             <motion.div variants={staggerContainer}>
//               {sidebar}
//             </motion.div>
//           </div>
//         )}
//         <div className={sidebar ? "col col--9" : "col col--12"}>
//           {header && <div className="margin-bottom--lg">{header}</div>}
//           <motion.div variants={staggerContainer}>
//             {children}
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default DashboardLayout;