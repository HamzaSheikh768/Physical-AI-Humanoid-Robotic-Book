// import React, { useEffect, useState } from 'react';
// import clsx from 'clsx';
// import Link from '@docusaurus/Link';
// import Translate from '@docusaurus/Translate';
// import { useLocation } from '@docusaurus/router';
// import { useAlternatePageUtils } from '@docusaurus/theme-common/internal';
// import { NavbarNavLink } from '@theme/Navbar/NavbarLink';

// const NavbarItemCustomLocaleDropdown = () => {
//   const location = useLocation();
//   const alternatePageUtils = useAlternatePageUtils();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check authentication status from localStorage
//     try {
//       const session = localStorage.getItem('better-auth.session');
//       setIsAuthenticated(!!session);
//     } catch (error) {
//       console.error('Auth check error:', error);
//       setIsAuthenticated(false);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Get current locale and languages
//   const currentLocale = alternatePageUtils.getPreferredLocale();
//   const currentLanguage = currentLocale === 'ur' ? 'اردو' : 'English';

//   // Prepare dropdown items for languages
//   const languageItems = Object.entries(alternatePageUtils.locales).map(([localeKey, localeConfig]) => {
//     const isCurrent = localeKey === currentLocale;
//     const toUrl = alternatePageUtils.createUrl({
//       locale: localeKey,
//       pathname: location.pathname,
//     });

//     return {
//       label: localeConfig.label,
//       to: toUrl,
//       target: '_self',
//       rel: isCurrent ? 'nofollow' : undefined,
//       className: isCurrent ? 'dropdown__link--active' : '',
//       'data-language': localeKey,
//       tabIndex: isAuthenticated ? 0 : -1, // Disable tab navigation if not authenticated
//     };
//   });

//   // If not authenticated, show disabled dropdown
//   if (!isAuthenticated && !isLoading) {
//     return (
//       <div
//         className={clsx(
//           'navbar__item',
//           'dropdown',
//           'dropdown--right',
//           'dropdown--navbar',
//           'dropdown--disabled'
//         )}
//         aria-disabled="true"
//       >
//         <div
//           className="navbar__link"
//           style={{
//             opacity: 0.5,
//             cursor: 'not-allowed',
//             pointerEvents: 'none'
//           }}
//           aria-label="Language selector (requires authentication)"
//           title="Sign in to change language"
//         >
//           {currentLanguage}
//         </div>
//       </div>
//     );
//   }

//   // If loading, show a placeholder
//   if (isLoading) {
//     return (
//       <div className="navbar__item">
//         <span className="navbar__link" style={{ opacity: 0.5 }}>
//           <Translate id="theme.navbar.language.loading" description="Loading language selector">
//             ...
//           </Translate>
//         </span>
//       </div>
//     );
//   }

//   // If authenticated, show the full dropdown
//   return (
//     <div className="navbar__item dropdown dropdown--right dropdown--navbar">
//       <div
//         className="navbar__link dropdown__trigger"
//         aria-haspopup="true"
//         aria-expanded="false"
//         id="language-dropdown-menu"
//       >
//         {currentLanguage}
//       </div>
//       <ul
//         className="dropdown__menu"
//         role="menu"
//         aria-labelledby="language-dropdown-menu"
//       >
//         {languageItems.map((item, index) => (
//           <li key={index} role="none">
//             <Link
//               href={item.to}
//               className={clsx('dropdown__link', item.className)}
//               role="menuitem"
//               tabIndex={item.tabIndex}
//               rel={item.rel}
//               style={{ pointerEvents: isAuthenticated ? 'auto' : 'none' }}
//             >
//               {item.label}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NavbarItemCustomLocaleDropdown;